import * as React from "react";
import {
  Button,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  TextField,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

import Comment from "./Comment";
import styles from "../style/style";

interface Props extends WithStyles {
  name: string;
  grade: string;
  institute: string;
  comments: object;
}

class Candidate extends React.Component<Props> {
  state = { expanded: false };

  handleExpand = () =>
    this.setState(state => ({
      expanded: !this.state.expanded
    }));

  render() {
    const { name, grade, institute, comments, classes } = this.props;
    return (
      <Card className={classes.card} onClick={this.handleExpand}>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={name}
          subheader={`${grade} - ${institute}`}
          classes={{ root: classes.cardHeader }}
        />
        <Collapse timeout="auto" unmountOnExit in={this.state.expanded}>
            <form className={classes.commentContainer}>
              <TextField
                id="comment"
                label="输入评论"
                placeholder="你的评论"
                margin="normal"
                onClick={e => e.stopPropagation()}
              />
              <Button color="primary" onClick={e => e.stopPropagation()}>
                发表评论
              </Button>
            </form>

            {Object.entries(comments).map(i => (
              <Comment name={i[0]} comment={i[1]} key={i[0]} />
            ))}
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(Candidate);
