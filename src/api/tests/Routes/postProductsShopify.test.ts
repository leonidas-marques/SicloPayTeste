import request from "supertest";
import { server } from "../Server/serverTests";
import { ServicoProduto } from "../../Services";
import { criarProdutoShopify } from "../../../services/shopifyService";

jest.mock("../../Services");
jest.mock("../../../services/shopifyService");

describe("POST /api/v1/products/shopify", () => {
  afterAll(async () => {
    await server.close();
  });
  it("deve criar um produto na Shopify e no banco de dados com sucesso", async () => {
    const mockProduto = {
      title: "Camiseta Personalizada",
      metafields: [
        {
          namespace: "custom_fields",
          key: "material",
          type: "single_line_text_field",
          value: "Algodão",
        },
      ],
      productOptions: [
        {
          name: "Cor",
          values: [{ name: "Vermelho" }, { name: "Verde" }, { name: "Azul" }],
        },
        {
          name: "Tamanho",
          values: [{ name: "P" }, { name: "M" }],
        },
      ],
      status: "ACTIVE",
      descriptionHtml: "<p>Camiseta de alta qualidade, 100% algodão.</p>",
      tags: "roupas, camiseta, algodão",
      productType: "tipo1",
      variants: [
        {
          optionValues: [
            { name: "Amarelo", optionName: "Cor" },
            { name: "P", optionName: "Tamanho" },
          ],
          price: 51.0,
        },
        {
          optionValues: [
            { name: "Azul", optionName: "Cor" },
            { name: "P", optionName: "Tamanho" },
          ],
          price: 50.0,
        },
      ],
    };

    const novoProdutoId = "shopify-produto-id-123";
    (criarProdutoShopify as jest.Mock).mockResolvedValue(novoProdutoId);

    const produtoCriadoNoDb = {
      id: 1,
      shopifyProductId: novoProdutoId,
      title: mockProduto.title,
      productType: mockProduto.productType,
      description: mockProduto.descriptionHtml,
      variants: mockProduto.variants,
    };
    (ServicoProduto.criarProduto as jest.Mock).mockResolvedValue(
      produtoCriadoNoDb
    );

    const response = await request(server)
      .post("/api/v1/products/shopify")
      .send(mockProduto);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "Produto criado com sucesso!",
      produtoId: novoProdutoId,
    });
  });

  // simula falha
  it("deve retornar erro se a criação do produto na Shopify falhar", async () => {
    const mockProduto = {
      title: "Produto Teste",
      metafields: [
        { namespace: "global", key: "color", type: "string", value: "red" },
      ],
      status: "ACTIVE",
      descriptionHtml: "<p>Descrição do produto</p>",
      tags: "tag1, tag2",
      variants: [
        { optionValues: [{ name: "Tamanho", optionName: "M" }], price: 100 },
      ],
      productOptions: [{ name: "Cor", values: [{ name: "Red" }] }],
      productType: "Tipo Teste",
    };

    (criarProdutoShopify as jest.Mock).mockRejectedValue(
      new Error("Erro ao criar produto na Shopify")
    );

    const response = await request(server)
      .post("/api/v1/products/shopify")
      .send(mockProduto);

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "Erro ao criar produto",
      detalhes: "Erro ao criar produto na Shopify",
    });
  });
});
