import request from "supertest";
import { server } from "../Server/serverTests";
import { obterTodosProdutosShopify } from "../../../services/shopifyService";

jest.mock("../../../services/shopifyService");

describe("GET /api/v1/shopify/products", () => {
  afterAll(async () => {
    await server.close();
  });

  it("deve retornar a lista de produtos da Shopify com sucesso", async () => {
    const produtosMock = [
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
      {
        id: "gid://shopify/Product/14630481363309",
        title: "Bangle Bracelet",
        productType: "Bracelet",
        description: "Gold bangle bracelet with studded jewels.",
        variants: [
          {
            id: "gid://shopify/ProductVariant/51685322948973",
            sku: null,
            barcode: null,
            price: "39.99",
          },
        ],
      },
    ];

    (obterTodosProdutosShopify as jest.Mock).mockResolvedValue(produtosMock);

    const response = await request(server).get("/api/v1/shopify/products");

    expect(response.status).toBe(200);

    expect(response.body).toEqual(produtosMock);
  });

  it("deve retornar erro se houver falha ao buscar produtos da Shopify", async () => {
    (obterTodosProdutosShopify as jest.Mock).mockRejectedValue(
      new Error("Erro ao buscar produtos da Shopify")
    );

    const response = await request(server).get("/api/v1/shopify/products");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      message: "Erro ao buscar os produtos na shopify.",
      error: expect.any(Object),
    });
  });
});
