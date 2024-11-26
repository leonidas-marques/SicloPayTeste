import { Request, Response } from "express";
import { ServicoProduto } from "./Services";
import {
  criarProdutoShopify,
  obterProdutoPorIdShopify,
  obterTodosProdutosShopify,
} from "../services/shopifyService";
import { Product } from "@prisma/client";

// retorna a lista de produtos no banco de dados Postgres.
export const obterTodosProdutosNoBanco = async (
  req: Request,
  res: Response
) => {
  try {
    const produtos = await ServicoProduto.obterTodosProdutos();
    res.json(produtos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar os produtos no db.", error });
  }
};
// retorna a lista de produtos na shopify.
export const obterTodosProdutosNaShopify = async (
  req: Request,
  res: Response
) => {
  try {
    const produtos = await obterTodosProdutosShopify();
    res.json(produtos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar os produtos na shopify.", error });
  }
};

// sincroniza os produtos
// caso o produto exista mas tenha dados divergentes, ele atualiza
// caso exista mas não tenha dados divergentes, nada acontece
// caso o produto não exista, ele cria
// caso o produto tenha sido excluido da shopify ele é deletado no db tambem
export const sincronizarProdutosShopify = async (
  req: Request,
  res: Response
) => {
  try {
    const produtosShopify = await obterTodosProdutosShopify();
    const produtosExistentes = await ServicoProduto.obterTodosProdutos();

    for (const produtoShopify of produtosShopify) {
      const produtoExistente = produtosExistentes.find(
        (produto: Product) => produto.shopifyProductId === produtoShopify.id
      );

      if (!produtoExistente) {
        ServicoProduto.criarProduto(produtoShopify)
          .then((produtoCriado) => {
            console.log("Produto criado com sucesso:", produtoCriado);
          })
          .catch((erro) => {
            console.error("Erro ao criar produto:", erro);
          });
      } else {
        console.log(
          `Produto ${produtoShopify.title} já existe. Pulando criação.`
        );
        ServicoProduto.atualizarProdutoSeNecessario(
          produtoShopify,
          produtoExistente
        );
      }
    }

    const idsProdutosShopify = produtosShopify.map((produto) => produto.id);
    console.log("Verificando produtos a serem excluídos...");
    for (const produtoExistente of produtosExistentes) {
      if (!idsProdutosShopify.includes(produtoExistente.shopifyProductId)) {
        await ServicoProduto.deletarProduto(produtoExistente.id)
          .then(() => {
            console.log(
              `Produto ${produtoExistente.title} excluído com sucesso.`
            );
          })
          .catch((erro) => {
            console.error("Erro ao excluir produto:", erro);
          });
      }
    }

    res.status(200).json({ message: "Produtos sincronizados com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao sincronizar produtos" });
  }
};

// cria produto na shopify
// cria produto no db tambem
export const criarProduto = async (req: Request, res: Response) => {
  try {
    const {
      title,
      metafields,
      status,
      descriptionHtml,
      tags,
      variants,
      productOptions,
      productType,
    } = req.body;

    if (!title) {
      res.status(400).json({ error: "O título do produto é obrigatório." });
      return;
    }
 
    const novoProdutoId = await criarProdutoShopify(
      title,
      metafields,
      status,
      descriptionHtml,
      tags,
      variants,
      productOptions,
      productType
    );

    const produto = await obterProdutoPorIdShopify(novoProdutoId);

    ServicoProduto.criarProduto(produto)
      .then((produtoCriado) => {
        console.log("Produto criado com sucesso:", produtoCriado);
      })
      .catch((erro) => {
        console.error("Erro ao criar produto:", erro);
      });

    console.log(`Produto criado com sucesso! ID: ${novoProdutoId}`);
    res.status(201).json({
      message: "Produto criado com sucesso!",
      produtoId: novoProdutoId,
    });
  } catch (error: any) {
    console.error("Erro ao criar produto:", error.message);
    res.status(500).json({
      error: "Erro ao criar produto",
      detalhes: error.message || "Erro desconhecido",
    });
  }
};
