import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import WEGTable from "./dataTable";
import { Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface props2 {
  ordem: string;
  open: boolean;
  setOpen: any;
}

export default function FullScreenDialog({ open, setOpen, ordem }: props2) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            ></IconButton>
            <Button autoFocus color="inherit" onClick={handleClose}>
              FECHAR
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ padding: "50px" }}>
          <Typography style={{ textAlign: "center" }} variant="body1">
            Materiais da ordem:{" "}
            <span style={{ fontWeight: "bold", fontSize: "24px" }}>
              {ordem}
            </span>
          </Typography>
          <br />

          <WEGTable />
        </div>
      </Dialog>
    </div>
  );
}
