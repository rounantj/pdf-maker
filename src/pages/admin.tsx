import React, { useEffect, useState } from "react";
import Montagem from "../components/montagem";
import SocketConnection from "../components/socket-client";
import { LOCAL } from "../helpers/interfaces";
import { getLocals } from "../helpers/mocks";
import Secao from "../components/secao";
import axios from "axios";
import { Typography } from "@mui/material";

export default function Admin() {
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [ordersB, setOrdersB] = useState<LOCAL>({
    sector_name: "Bobinagem",
    sector_locals: [],
    id: null,
  } as LOCAL);

  const [loading, setLoading] = useState(true); // adiciona variável de estado loading

  useEffect(() => {
    setLoading(false); // desativa o loading quando o conteúdo é carregado
  }, []);

  const [ordersM, setOrdersM] = useState<LOCAL>({
    sector_name: "Montagem",
    sector_locals: [],
    id: null,
  } as LOCAL);
  const socket = SocketConnection.getInstance();
  function socketInstanceA() {
    console.log({ socketConnected });
    if (!socketConnected) {
      socket.connect();

      socket.on("connect", () => {
        console.log("Connected");
        setSocketConnected(true);
      });
    }
  }

  async function transmit() {
    socket.emit("updates", { ordersB, ordersM });
    await axios.post("http://localhost:3001/locals/" + ordersB.id, {
      sector_name: ordersB.sector_name,
      sector_locals: ordersB.sector_locals,
    });
    await axios.post("http://localhost:3001/locals/" + ordersM.id, {
      sector_name: ordersM.sector_name,
      sector_locals: ordersM.sector_locals,
    });
  }

  useEffect(() => {
    let getOrders = async () => {
      const dt = await getLocals();
      let ordensB = dt.find((t) => t.sector_name === "Bobinagem");
      if (ordensB) {
        setOrdersB(ordensB);
      }

      let ordensM = dt.find((t) => t.sector_name === "Montagem");
      if (ordensM) {
        setOrdersM(ordensM);
      }
    };

    getOrders().then((data) => {});

    socketInstanceA();
  }, []);

  useEffect(() => {
    console.log({ socketConnected });
    if (socketConnected) {
      console.log("estou ouvindo");

      socket.on("data", (data: any) => {
        setLoading(true);
        console.log("Received updates:", data);
        setOrdersB(data.ordersB);
        setOrdersM(data.ordersM);
      });
    }
  }, [socketConnected]);

  useEffect(() => {
    console.log({ ordersB, ordersM });
    setLoading(false);
  }, [ordersB, ordersM]);

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ display: "inline-flex", gap: "50px" }}>
        <img src="https://www.weg.net/institutional/_ui/desktop/theme-institutional/img/brand.svg"></img>
        <Typography variant="body1">
          Inicio{" / "}
          <span style={{ fontWeight: "bold", fontSize: "24px" }}>
            {"ADMIN"}
          </span>
        </Typography>
      </div>
      <Secao
        loading={loading}
        disableSync={false}
        transmit={transmit}
        ordersA={ordersB}
        setOrders={setOrdersB}
      />
      <Secao
        loading={loading}
        disableSync={false}
        transmit={transmit}
        ordersA={ordersM}
        setOrders={setOrdersM}
      />
    </div>
  );
}
