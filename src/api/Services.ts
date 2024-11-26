const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
import {
  Product as ProductInterfaceDB,
  Variant as VariantInterfaceDB,
} from "@prisma/client";
import { Product as ProductInterface } from "../interfaces/interfaces";

// relacionado aos produtos do db, não da shopify
export const ServicoProduto = {
  async obterTodosProdutos() {
    return prisma.product.findMany({
      include: {
        variants: true, 
      },
    });
  },

  async deletarProduto(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  },

  // função para criar produto com base na product interface
  async criarProduto(dados: ProductInterface) {
    return prisma.product.create({
      data: {
        shopifyProductId: dados.id,
        title: dados.title,
        productType: dados.productType,
        description: dados.description,
        variants: {
          create: dados.variants.map((variant) => ({
            shopifyVariantId: variant.id,
            sku: variant.sku,
            barcode: variant.barcode,
            price: variant.price,
          })),
        },
      },
    });
  },

  async atualizarProdutoSeNecessario(
    produtoShopify: ProductInterface,
    produtoExistente: ProductInterfaceDB & { variants: VariantInterfaceDB[] }
  ) {
    try {
      const produtoDesatualizado =
        produtoExistente.title !== produtoShopify.title ||
        produtoExistente.description !== produtoShopify.description ||
        produtoExistente.productType !== produtoShopify.productType;

      if (produtoDesatualizado) {
        await prisma.product.update({
          where: { shopifyProductId: produtoExistente.shopifyProductId },
          data: {
            title: produtoShopify.title,
            description: produtoShopify.description,
            productType: produtoShopify.productType,
          },
        });
        console.log(
          `Produto ${produtoShopify.title} atualizado com sucesso no banco.`
        );
      } else {
        console.log(
          `Produto ${produtoShopify.title} já está atualizado no banco.`
        );
      }

      // sincroniza as variantes
      for (const varianteShopify of produtoShopify.variants) {
        const varianteExistente = produtoExistente.variants.find(
          (v) => v.shopifyVariantId === varianteShopify.id
        );

        if (!varianteExistente) {
          // Criaa uma nova variante se não existir
          await prisma.variant.create({
            data: {
              shopifyVariantId: varianteShopify.id,
              sku: varianteShopify.sku,
              barcode: varianteShopify.barcode,
              price: varianteShopify.price,
              produtoId: produtoExistente.id,
            },
          });
          console.log(
            `Nova variante ${varianteShopify.id} criada para o produto ${produtoShopify.title}.`
          );
        } else {
          //  verifica se as variantes divergem
          const varianteAtualizada =
            varianteExistente.sku !== varianteShopify.sku ||
            varianteExistente.barcode !== varianteShopify.barcode ||
            varianteExistente.price !== varianteShopify.price;

          if (varianteAtualizada) {
            // se a variante existir atualizar ela
            await prisma.variant.update({
              where: { shopifyVariantId: varianteExistente.shopifyVariantId },
              data: {
                sku: varianteShopify.sku,
                barcode: varianteShopify.barcode,
                price: varianteShopify.price,
              },
            });
            console.log(
              `Variante ${varianteShopify.id} atualizada para o produto ${produtoShopify.title}.`
            );
          } else {
            console.log(
              `Variante ${varianteShopify.id} do produto ${produtoShopify.title} já está atualizada.`
            );
          }
        }
      }
    } catch (error) {
      console.error(
        `Erro ao atualizar o produto ou variantes: ${produtoShopify.id}`,
        error
      );
      throw new Error(
        `Erro ao atualizar o produto ${produtoShopify.title} ou suas variantes.`
      );
    }
  },
};
