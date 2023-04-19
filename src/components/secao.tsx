import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OrderPaper from "./papers";
import { LINE, LOCAL, ORDER } from "../helpers/interfaces";
import { Item } from "../helpers/styles";
import FullScreenDialog from "./modalFull";
import stilos from "./styles.module.css";

interface props {
  setOrders: any;
  transmit: any;
  disableSync: boolean;
  ordersA: LOCAL;
  loading: boolean;
}

export default function Secao({
  setOrders,
  ordersA,
  loading,
  transmit,
  disableSync,
}: props) {
  const [open, setOpen] = useState<boolean>(false);
  const [ordem, setOrdem] = useState<string>("");
  const handleDragEnd2 = (result: any) => {
    if (disableSync) return;
    if (!result) return; // do nothing if dropped outside the list
    if (!result.destination) return; // do nothing if dropped outside the list
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // reordering within the same droppable
      const droppableId = source.droppableId;
      const lineIndex = droppableId.split("-")[1];
      let orders = ordersA.sector_locals.find((o: any) => o.name === lineIndex);

      if (!orders) return; // do nothing if orders is undefined
      const newOrders = Array.from(orders.orders);
      const [reorderedItem] = newOrders.splice(source.index, 1);
      newOrders.splice(destination.index, 0, reorderedItem);
      let newOrdesB = ordersA;

      newOrdesB.sector_locals.forEach((o: any) => {
        if (o.name === lineIndex) {
          o.orders = newOrders;
        }
      });
      setOrders(newOrdesB);
    } else {
      // moving to a different droppable
      const sourceDroppableId = source.droppableId;
      const destinationDroppableId = destination.droppableId;
      const [sourceSector, sourceLine] = sourceDroppableId.split("-");
      const [destinationSector, destinationLine] =
        destinationDroppableId.split("-");
      if (sourceSector !== destinationSector) return; // do nothing if dragging between sectors
      const ordersSource = ordersA?.sector_locals.find(
        (o: any) => o.name === sourceLine
      );
      const ordersDestination = ordersA?.sector_locals.find(
        (o: any) => o.name === destinationLine
      );
      if (ordersSource && ordersDestination) {
        const sourceOrders = Array.from(ordersSource.orders);
        const destinationOrders = Array.from(ordersDestination.orders);
        const [movedItem] = sourceOrders.splice(source.index, 1);
        destinationOrders.splice(destination.index, 0, movedItem);
        let newOrdesB = ordersA;
        newOrdesB.sector_locals.forEach((o: any) => {
          if (o.name === sourceLine) {
            o.orders = sourceOrders;
          }

          if (o.name === destinationLine) {
            o.orders = destinationOrders;
          }
        });
        setOrders(newOrdesB);
      }

      transmit();
    }
  };

  async function mudaOrdem(ordem: string) {
    setOpen(!open);
    setOrdem(ordem);
  }
  const [highlightColor, setHighlightColor] = useState<string>("yellow");

  function isAlert(time: string) {
    if (time <= "00:10:00") {
      return true;
    }
    return false;
  }

  function getTime(length: number): string {
    const milliseconds = length * 10 * 60 * 1000;
    const date = new Date(milliseconds);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div style={{ padding: "50px" }}>
      {loading ? (
        // verifica se loading é verdadeiro e exibe o skeleton
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "50px",
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "#eee",
            }}
          ></div>
          <div
            style={{
              height: "100px",
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "#eee",
            }}
          ></div>
          <div
            style={{
              height: "100px",
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "#eee",
            }}
          ></div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd2}>
          <Grid container spacing={2}>
            {ordersA.sector_locals &&
              ordersA.sector_locals.map((line: LINE, u: number) => (
                <Droppable
                  key={`${ordersA.sector_name}-${line.name}`}
                  droppableId={`${ordersA.sector_name}-${line.name}`}
                >
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={
                        isAlert(getTime(line.orders.length))
                          ? stilos.pulsar
                          : ""
                      }
                      sx={{
                        flexGrow: 1,
                        mb: 2,
                      }}
                    >
                      <Item
                        sx={{
                          mb: 1,
                          color: "rgb(0,87,156)",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                        variant="outlined"
                      >
                        {`${ordersA.sector_name} - ${line.name}`}
                      </Item>
                      <Item
                        sx={{
                          mb: 1,
                          color: "red",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                        variant="outlined"
                      >
                        {getTime(line.orders.length)}
                      </Item>
                      {line.orders.map((order: ORDER, i: number) => (
                        <Draggable
                          key={i}
                          draggableId={`${ordersA.sector_name}-${line.name}-${i}`}
                          index={i}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div {...provided.dragHandleProps}>
                                <OrderPaper
                                  onClick={() => mudaOrdem(order.order)}
                                  count={order.count}
                                  priority={i}
                                  title={order.order}
                                  style={{ mb: 1 }}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              ))}
          </Grid>
        </DragDropContext>
      )}

      <FullScreenDialog open={open} ordem={ordem} setOpen={setOpen} />
    </div>
  );
}
