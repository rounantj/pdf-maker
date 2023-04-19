import React, { useEffect, useState } from "react";
import SocketConnection from "../components/socket-client";
import { LOCAL } from "../helpers/interfaces";
import { getLocals } from "../helpers/mocks";
import Secao from "../components/secao";
import { Typography } from "@mui/material";

export default function Monitor() {
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [ordersB, setOrdersB] = useState<LOCAL>({
    sector_name: "Bobinagem",
    sector_locals: [],
    id: null,
  } as LOCAL);

  const [ordersM, setOrdersM] = useState<LOCAL>({
    sector_name: "Montagem",
    sector_locals: [],
    id: null,
  } as LOCAL);

  const [loading, setLoading] = useState(false); // adiciona variável de estado loading

  useEffect(() => {
    setLoading(false); // desativa o loading quando o conteúdo é carregado
  }, []);

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
  function transmit() {
    return true;
  }

  function teste() {
    socket.emit("updates", { ordersB, ordersM });
  }

  useEffect(() => {
    let getOrders = async () => {
      const dt = await getLocals();
      console.log({ dt });
      let ordensB = dt.find((t) => t.sector_name === "Bobinagem");
      if (ordensB) {
        setOrdersB(ordensB);
      }

      let ordensM = dt.find((t) => t.sector_name === "Montagem");
      if (ordensM) {
        setOrdersM(ordensM);
      }
    };

    getOrders().then((data) => {
      console.log({ data });
    });

    socketInstanceA();
  }, []);

  useEffect(() => {
    console.log({ socketConnected });
    if (socketConnected) {
      console.log("estou ouvindo");
      setLoading(true);
      socket.on("data", (data: any) => {
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
            {"MONITOR"}
          </span>
        </Typography>
      </div>

      <Secao
        loading={loading}
        disableSync={true}
        transmit={transmit}
        ordersA={ordersB}
        setOrders={setOrdersB}
      />
      <Secao
        loading={loading}
        disableSync={true}
        transmit={transmit}
        ordersA={ordersM}
        setOrders={setOrdersM}
      />
    </div>
  );
}
