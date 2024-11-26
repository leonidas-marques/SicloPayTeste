import request from "supertest";
import { server } from "../Server/serverTests";
import { ServicoProduto } from "../../Services";
import { obterTodosProdutosShopify } from "../../../services/shopifyService";

jest.mock("../../Services");
jest.mock("../../../services/shopifyService");

describe("POST /api/v1/shopify/products/sync", () => {
  afterAll(async () => {
    await server.close();
  });

  it("deve sincronizar os produtos da Shopify com sucesso", async () => {
    const produtosShopifyMock = [
      {
        id: "gid://shopify/Product/14630481232237",
        title: "7 Shakra Bracelet teste",
        productType: "Bracelet",
        description: "7 chakra bracelet, in blue or black.",
        variants: [
          {
            id: "gid://shopify/ProductVariant/51685322490221",
            sku: null,
            barcode: null,
            price: "42.99",
          },
          {
            id: "gid://shopify/ProductVariant/51685322522989",
            sku: null,
            barcode: null,
            price: "42.99",
          },
        ],
      },
      {
        id: "gid://shopify/Product/14630481330541",
        title: "Anchor Bracelet Mens",
        productType: "Bracelet",
        description:
          "Black leather bracelet with gold or silver anchor for men.",
        variants: [
          {
            id: "gid://shopify/ProductVariant/51685322883437",
            sku: null,
            barcode: null,
            price: "69.99",
          },
          {
            id: "gid://shopify/ProductVariant/51685322916205",
            sku: null,
            barcode: null,
            price: "55.00",
          },
        ],
      },
    ];

    const produtosExistentesMock = [
      {
        id: 1,
        shopifyProductId: "gid://shopify/Product/14630481232237",
        title: "7 Shakra Bracelet teste",
        productType: "Bracelet",
        description: "7 chakra bracelet, in blue or black.",
        variants: [
          {
            id: "gid://shopify/ProductVariant/51685322490221",
            sku: null,
            barcode: null,
            price: "42.99",
          },
        ],
      },
    ];

    (obterTodosProdutosShopify as jest.Mock).mockResolvedValue(
      produtosShopifyMock
    );

    (ServicoProduto.obterTodosProdutos as jest.Mock).mockResolvedValue(
      produtosExistentesMock
    );

    (ServicoProduto.criarProduto as jest.Mock).mockResolvedValue({
      id: 2,
      shopifyProductId: produtosShopifyMock[1].id,
      title: produtosShopifyMock[1].title,
      productType: produtosShopifyMock[1].productType,
      description: produtosShopifyMock[1].description,
      variants: produtosShopifyMock[1].variants,
    });

    (
      ServicoProduto.atualizarProdutoSeNecessario as jest.Mock
    ).mockResolvedValue(undefined);
    (ServicoProduto.deletarProduto as jest.Mock).mockResolvedValue(undefined);

    const response = await request(server).post(
      "/api/v1/shopify/products/sync"
    );

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Produtos sincronizados com sucesso!",
    });

    expect(ServicoProduto.criarProduto).toHaveBeenCalledWith(
      produtosShopifyMock[1]
    );

    expect(ServicoProduto.atualizarProdutoSeNecessario).toHaveBeenCalledWith(
      produtosShopifyMock[0],
      produtosExistentesMock[0]
    );

    expect(ServicoProduto.deletarProduto).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a sincronização falhar", async () => {
    (obterTodosProdutosShopify as jest.Mock).mockRejectedValue(
      new Error("Erro ao obter produtos da Shopify")
    );

    const response = await request(server).post(
      "/api/v1/shopify/products/sync"
    );

    expect(response.status).toBe(500);

    expect(response.body).toEqual({ error: "Erro ao sincronizar produtos" });
  });
});
