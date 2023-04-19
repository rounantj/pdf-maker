import * as exphbs from "express-handlebars";
import express from "express";
import { technicalSpecification } from "../helpers/mocks";
import cors from "cors";
import MySQLConnection from "./sequelize";
import bodyParser from "body-parser";
import { makePdfPlus } from "../helpers/pdfMaker";

const connection = new MySQLConnection();

export default async function ApiWEG(app: any, httpServer: any, PORT: number) {
  Setup(app);
  Routes(app);
  httpServer.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
  });
}

async function Setup(app: express.Application) {
  // Configuração do Handlebars
  const hbs = exphbs.create({ extname: ".hbs" });
  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");
  app.use(cors());

  // Configuração do diretório de views
  app.set("views", __dirname + "/views");

  // Configuração do diretório público
  app.use(express.static(__dirname + "/public"));

  // Configuração do Body Parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}

async function Routes(app: any) {
  // app.get("/technical-specification", (req: any, res: any) => {
  //   res.status(201).json({ data: technicalSpecification });
  // });

  app.post("/makePDF", async (req: any, res: any) => {

    try {
      const { tables, pdfName } = req.body;
      const buffer = makePdfPlus(tables, pdfName)
      res.status(200).json({ buffer });
    } catch (error) {
      console.error(`Error: `, error);
      res.status(500).json({ error });
    }
  });

  // app.post("/locals/:id", async (req: any, res: any) => {
  //   let { id } = req.params;
  //   let { sector_name, sector_locals } = req.body;
  //   if (!id || id === "null") {
  //     id = undefined;
  //   }

  //   sector_locals = JSON.stringify(sector_locals);

  //   try {
  //     await connection.updateLocal(id, { sector_name, sector_locals });
  //     res.status(200).json({ message: `Local ${id} updated successfully` });
  //   } catch (error) {
  //     console.error(`Error updating local ${id}:`, error);
  //     res.status(500).json({ error: `Error updating local ${id}` });
  //   }
  // });
  // app.get("/locals", async (req: any, res: any) => {
  //   try {
  //     const locals = await connection.getLocals();

  //     locals.forEach((local: any) => {
  //       while (typeof local.sector_locals === "string") {
  //         local.sector_locals = JSON.parse(local.sector_locals);
  //       }
  //     });

  //     res.status(200).json({ locals });
  //   } catch (error) {
  //     console.error("Error retrieving locals:", error);
  //     res.status(500).json({ error: "Error retrieving locals" });
  //   }
  // });
}
