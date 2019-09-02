import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core";

interface IStyleProps {
  color?: "white" | undefined;
  fontColor?: string | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: (props: IStyleProps) => ({
      color: props.color,
      fontWeight: "bold",
      margin: theme.spacing(1)
    })
  })
);

export default (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [abandon, setAbandon] = useState(false);

  const white = useStyles({ color: "white" });

  const handleClickOpen = (action: "submit" | "abandon") => () => {
    switch (action) {
      case "abandon":
        setAbandon(true);
        break;
      case "submit":
        setAbandon(false);
        break;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen("submit")}
          className={white.button}
        >
          提交
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen("abandon")}
          className={white.button}
        >
          放弃面试
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"请确认你的选择"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {abandon
              ? "如果你以上时间都无法到场，可以尝试联系我们调整时间，或选择放弃面试同时错过本次招新"
              : "请务必保证面试可以到场，你的选择将无法更改"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            className={white.button}
          >
            我确认
          </Button>
          <Button
            onClick={handleClose}
            color="secondary"
            autoFocus
            variant="contained"
            className={white.button}
          >
            再想想
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
