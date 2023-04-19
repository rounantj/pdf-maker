import express from "express";
import { createServer } from "http";

import * as dotenv from "dotenv";
import ApiWEG from "./core/api";
import SocketWEG from "./core/socket";
import cors from "cors";
import { getconn } from "./helpers/conn";


dotenv.config();

const app = express();
app.use(cors());
const httpServer = createServer(app);

// Configuração da porta HTTP
const PORT = Number(process.env.PORT) || 3001;

// Configuração da porta Socket.io
const SOCKET_PORT = Number(process.env.SOCKET_PORT) || 3002;

getconn();

ApiWEG(app, httpServer, PORT);
SocketWEG(httpServer, SOCKET_PORT);
