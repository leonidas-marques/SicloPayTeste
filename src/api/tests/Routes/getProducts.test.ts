import { server } from "../Server/serverTests";
import { ServicoProduto } from "../../Services";
import request from "supertest";

// Mockado para não acessar o banco de dados real
jest.mock("../../Services", () => ({
  ServicoProduto: {
    obterTodosProdutos: jest.fn(),
  },
}));

describe("GET /api/v1/products", () => {
  afterAll(async () => {
    await server.close();
  });

  it("deve retornar a lista de produtos", async () => {
    const produtosMock = [
      {
        id: 1,
        title: "Produto 1",
        productType: "Tipo 1",
        description: "Descrição 1",
      },
      {
        id: 2,
        title: "Produto 2",
        productType: "Tipo 2",
        description: "Descrição 2",
      },
    ];

    (ServicoProduto.obterTodosProdutos as jest.Mock).mockResolvedValue(
      produtosMock
    );

    const response = await request(server).get("/api/v1/products");

    expect(response.status).toBe(200);

    expect(response.body).toEqual(produtosMock);
  });

  it("deve retornar um erro se a obtenção dos produtos falhar", async () => {
    (ServicoProduto.obterTodosProdutos as jest.Mock).mockRejectedValue(
      new Error("Erro ao buscar produtos")
    );

    const response = await request(server).get("/api/v1/products");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      message: "Erro ao buscar os produtos no db.",
      error: expect.any(Object),
    });
  });
});
