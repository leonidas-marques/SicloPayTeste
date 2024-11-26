import { Router } from "express";
import {
  criarProduto,
  obterTodosProdutosNaShopify,
  obterTodosProdutosNoBanco,
  sincronizarProdutosShopify,
} from "./Controllers";
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger/swagger.json")
const productApiRoutes = Router();

// A Api foi construida no intuido de ser um mero exemplo para o teste
// por isso não coloquei todos os campos possiveis de serem cadastrados 


// Este endpoint deve buscar e retornar a lista de produtos armazenados no banco de dados Postgres
// ✅
productApiRoutes.get("/products", obterTodosProdutosNoBanco);

// Este endpoint deve criar um novo produto na Shopify e armazenar os detalhes no banco de dados Postgres.
// ✅
productApiRoutes.post("/products/shopify", criarProduto);

// Este endpoint deve buscar os produtos diretamente da Shopify e retornar a lista de produtos.
// ✅
productApiRoutes.get("/shopify/products", obterTodosProdutosNaShopify);

// Este endpoint deve buscar todos os
// produtos da Shopify e sincronizar os dados com o banco de dados local,
// armazenando ou atualizando os produtos conforme necessário.
// ✅
productApiRoutes.post("/shopify/products/sync", sincronizarProdutosShopify);

productApiRoutes.use("/api-docs", swaggerUi.serve);
productApiRoutes.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default productApiRoutes;
