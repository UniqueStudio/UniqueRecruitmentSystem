import * as React from "react";
import {
  Avatar,
  Chip,
  WithStyles,
  withStyles
} from "@material-ui/core";

import styles from "../style/style";

interface Props extends WithStyles {
    name: string;
    comment: string;
}

class Comment extends React.Component<Props> {

  render() {
    const { name, comment , classes } = this.props;
    return (
        <Chip
        avatar={<Avatar>{name}</Avatar>}
        label={comment}
        className={classes.chip}
      />
    );
  }
}

export default withStyles(styles)(Comment);
