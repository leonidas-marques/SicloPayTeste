import axios, { AxiosResponse } from "axios";
import {
  Product,
  ShopifyResponseProducts,
  shopifyResponseSingleProduct,
  ShopifyResponseVariants,
} from "../interfaces/interfaces";
import { ShopifyResponse } from "../interfaces/interfaces";

const accessToken = process.env.SHOPIFY_API_KEY;
const shopName = process.env.SHOPIFY_SHOP_NAME;

// utilizando axios conforme o pedido no pdf do teste
const shopifyClient = axios.create({
  baseURL: `https://${shopName}.myshopify.com/admin/api/2024-10/graphql.json`,
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  },
});

// a api da shopify retorna um numero limitado de produtos, para contornar isso tive que usar as flags hasNextPage e o endCursor
export const obterTodosProdutosShopify = async (): Promise<Product[]> => {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  while (hasNextPage) {
    const query = `
    query {
      products(first: 10${endCursor ? `, after: "${endCursor}"` : ""}) {
        edges {
          node {
            id
            title
            productType
            description
            variants(first: 10) {
              edges {
                node {
                  id
                  sku
                  barcode
                  price
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    `;

    try {
      const response: AxiosResponse<ShopifyResponse> = await shopifyClient.post(
        "",
        { query }
      );

      const data = response.data.data.products;

      data.edges.forEach((edge) => {
        const productNode = edge.node;
        const variants = productNode.variants.edges.map(
          (variantEdge) => variantEdge.node
        );

        allProducts.push({
          id: productNode.id,
          title: productNode.title,
          productType: productNode.productType,
          description: productNode.description,
          variants,
        });
      });

      hasNextPage = data.pageInfo.hasNextPage;
      endCursor = data.pageInfo.endCursor;
    } catch (error) {
      throw new Error(`Erro ao buscar todos os produtos: ${error}`);
    }
  }

  

  return allProducts;
};

export const criarVariantesProdutoShopify = async (
  productId: string,
  variants: Array<{
    optionValues: Array<{ name: string; optionName: string }>;
    price: number;
  }>
) => {
  const mutation = `
  mutation productVariantsBulkCreate(
    $productId: ID!, 
    $variants: [ProductVariantsBulkInput!]!, 
    $strategy: ProductVariantsBulkCreateStrategy!
  ) {
    productVariantsBulkCreate(
      productId: $productId, 
      variants: $variants, 
      strategy: $strategy
    ) {
      userErrors {
        field
        message
      }
      product {
        id
        options {
          id
          name
          values
          position
          optionValues {
            id
            name
            hasVariants
          }
        }
      }
      productVariants {
        id
        title
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;
  const strategy = "REMOVE_STANDALONE_VARIANT";
  const variables = {
    productId,
    variants,
    strategy,
  };

  try {
    const response: AxiosResponse<ShopifyResponseVariants> =
      await shopifyClient.post("", {
        query: mutation,
        variables,
      });
  

    const data = response.data.data.productVariantsBulkCreate;
    if (data.userErrors && data.userErrors.length > 0) {
      throw new Error(
        `Erros ao criar variantes: ${data.userErrors
          .map((error) => error.message)
          .join(", ")}`
      );
    }

    console.log("Variantes criadas com sucesso:", data.productVariants);
  } catch (error: any) {
    throw new Error(`Erro ao criar variantes na Shopify: ${error.message}`);
  }
};

export const criarProdutoShopify = async (
  title: string,
  metafields?: Array<{
    namespace: string;
    key: string;
    type: string;
    value: string;
  }>,
  status?: string, // pode ser "DRAFT" ou "ACTIVE" ou "ARCHIVED"
  descriptionHtml?: string,
  tags?: string, // tag separada por virgula
  variants?: Array<{
    optionValues: Array<{ name: string; optionName: string }>;
    price: number;
  }>,
  productOptions?: Array<{
    name: string;
    values: Array<{ name: string }>;
  }>,
  productType?: string
): Promise<string> => {
  const input = {
    title,
    status,
    descriptionHtml,
    tags,
    metafields,
    productOptions,
    productType,
  };

  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const variables = { input };
  try {
    const response: AxiosResponse<ShopifyResponseProducts> =
      await shopifyClient.post("", {
        query: mutation,
        variables,
      });


    const data = response.data.data.productCreate;

    if (data.userErrors && data.userErrors.length > 0) {
      const formattedErrors = data.userErrors
        .map((error: { field?: string[]; message: string }) => {
          const fieldPath = error.field
            ? `Campo: ${error.field.join(" -> ")}`
            : "Sem campo específico";
          return `${fieldPath} - Mensagem: ${error.message}`;
        })
        .join("\n");
      console.log(formattedErrors);

      throw new Error(
        `Erros encontrados ao processar a solicitação:\n${formattedErrors}`
      );
    }

    if (variants) {
      await criarVariantesProdutoShopify(data.product.id, variants);
    }

    return data.product.id;
  } catch (error: any) {
    throw new Error(`Erro ao criar produto na Shopify: ${error}`);
  }
};

export const obterProdutoPorIdShopify = async (id: string) => {
  const query = `
    query {
      product(id: "${id}") {
        id
        title
        productType
        description
        variants(first: 10) {
          edges {
            node {
              id
              sku
              barcode
              price
            }
          }
        }
      }
    }
  `;

  try {
    const response: AxiosResponse<shopifyResponseSingleProduct> =
      await shopifyClient.post("", { query });

 

    const productData = response.data.data.product;

    const dadosProduto: Product = {
      id: productData.id,
      title: productData.title,
      productType: productData.productType,
      description: productData.description,
      variants: productData.variants.edges.map(
        (variantEdge) => variantEdge.node
      ),
    };

    

    return dadosProduto;
  } catch (error) {
    throw new Error(`Erro ao buscar o produto com ID ${id}: ${error}`);
  }
};
