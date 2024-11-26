import express, { Request, Response } from "express";
import { Pool } from "pg";
import productApiRoutes from "../../Routes";

export const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Banco de dados conectado! hora: ${result.rows[0].now}`);
  } catch (error) {
    res
      .status(500)
      .send(
        "Erro ao conectar com o banco de dados: " + (error as Error).message
      );
  }
});

app.use("/api/v1/", productApiRoutes);

export var server = app.listen(0, () => {
  console.log("server de teste iniciado");
});
