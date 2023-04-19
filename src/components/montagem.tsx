import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { CssBaseline, Container } from "@mui/material";
import OrderPaper from "../components/papers";
import { INITIAL_ORDERS } from "../helpers/mocks";
import { LINE, LOCAL, ORDER } from "../helpers/interfaces";
import { Item } from "../helpers/styles";
import SocketConnection from "../components/socket-client";

export default function Montagem() {
  const [ordersM, setOrdersM] = useState<LOCAL>({
    sector_name: "Montagem",
    sector_locals: [],
  } as LOCAL);

  const handleDragEnd2 = (result: any) => {
    if (!result) return; // do nothing if dropped outside the list
    if (!result.destination) return; // do nothing if dropped outside the list
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // reordering within the same droppable
      const droppableId = source.droppableId;
      const lineIndex = droppableId.split("-")[1];
      let orders = ordersM.sector_locals.find((o: any) => o.name === lineIndex);

      if (!orders) return; // do nothing if orders is undefined
      const newOrders = Array.from(orders.orders);
      const [reorderedItem] = newOrders.splice(source.index, 1);
      newOrders.splice(destination.index, 0, reorderedItem);
      let newOrdesB = ordersM;

      newOrdesB.sector_locals.forEach((o: any) => {
        if (o.name === lineIndex) {
          o.orders = newOrders;
        }
      });
      setOrdersM(newOrdesB);
    } else {
      // moving to a different droppable
      const sourceDroppableId = source.droppableId;
      const destinationDroppableId = destination.droppableId;
      const [sourceSector, sourceLine] = sourceDroppableId.split("-");
      const [destinationSector, destinationLine] =
        destinationDroppableId.split("-");
      if (sourceSector !== destinationSector) return; // do nothing if dragging between sectors
      const ordersSource = ordersM?.sector_locals.find(
        (o: any) => o.name === sourceLine
      );
      const ordersDestination = ordersM?.sector_locals.find(
        (o: any) => o.name === destinationLine
      );
      if (ordersSource && ordersDestination) {
        const sourceOrders = Array.from(ordersSource.orders);
        const destinationOrders = Array.from(ordersDestination.orders);
        const [movedItem] = sourceOrders.splice(source.index, 1);
        destinationOrders.splice(destination.index, 0, movedItem);
        let newOrdesB = ordersM;
        newOrdesB.sector_locals.forEach((o: any) => {
          if (o.name === sourceLine) {
            o.orders = sourceOrders;
          }

          if (o.name === destinationLine) {
            o.orders = destinationOrders;
          }
        });
        setOrdersM(newOrdesB);
      }
    }
  };

  useEffect(() => {
    let ordensM: LOCAL | undefined = INITIAL_ORDERS.find(
      (n) => n.sector_name === "Montagem"
    );

    if (ordensM) {
      setOrdersM(ordensM);
    }
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <DragDropContext onDragEnd={handleDragEnd2}>
        <Grid container spacing={2}>
          {ordersM.sector_locals.map((line: LINE, u: number) => (
            <Droppable
              key={`${ordersM.sector_name}-${line.name}`}
              droppableId={`${ordersM.sector_name}-${line.name}`}
            >
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ flexGrow: 1, mb: 2 }}
                >
                  <Item sx={{ mb: 1 }} variant="outlined">
                    {`${ordersM.sector_name} - ${line.name}`}
                  </Item>
                  {line.orders.map((order: ORDER, i: number) => (
                    <Draggable
                      key={i}
                      draggableId={`${ordersM.sector_name}-${line.name}-${i}`}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div {...provided.dragHandleProps}>
                            <OrderPaper
                              count={i}
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
    </div>
  );
}
