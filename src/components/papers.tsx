import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

interface OrderPaperProps {
  onClick: any;
  style: any;
  priority: number;
  count: number;
  title: string;
}
export default function OrderPaper({
  title,
  onClick,
  count,
  style,
  priority,
}: OrderPaperProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "lightblue";
  };

  const priorityColors = {
    0: { bg: "#FFC6C6", text: "#8F0000" },
    1: { bg: "#FFE5B4", text: "#8F5700" },
    2: { bg: "#D2FAFF", text: "#00537E" },
    3: { bg: "#E7D8FA", text: "#4B0082" },
    4: { bg: "#FFF0AA", text: "#805C00" },
  };

  function getPriorityColor(priority: number) {
    if (priorityColors[priority]) {
      return priorityColors[priority];
    } else {
      return priorityColors[4];
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 250,
          height: 100,
          margin: "10px auto",
          background: getPriorityColor(priority).bg,
          color: getPriorityColor(priority).text,
        },
      }}
      style={style}
    >
      <Paper
        onClick={() => onClick()}
        sx={{ padding: "10px", cursor: "pointer" }}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          e.currentTarget.style.backgroundColor = "white";
        }}
        elevation={3}
      >
        <Typography variant="body1">
          ORDEM:{" "}
          <span style={{ fontWeight: "bold", fontSize: "24px" }}>{title}</span>
        </Typography>
        <Typography variant="body1">
          PEÇAS:{" "}
          <span style={{ fontWeight: "bold", fontSize: "24px" }}>{count}</span>
        </Typography>
        <Typography variant="body1">
          ESTOQUE PARA:{" "}
          <span
            style={{ fontWeight: "bold", fontSize: "24px", color: "green" }}
          >
            100%
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}
