import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import AppBar from "../container/AppBar";
import withRoot from "../style/withRoot";
import styles from "../style/style";
import Menu from "../container/Menu";
import Column from "../component/Column";
import Candidate from "../component/Candidate";

// import logo from './image/logo.png';

class Main extends React.Component<WithStyles> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar />
        <Menu />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.columnContainer}>
            <Column title="报名流程">
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
            </Column>
            <Column title="笔试流程">
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
            </Column>
            <Column title="面试流程">
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
            </Column>
            <Column title="熬测流程">
              <Candidate
                name="名字"
                grade="年级"
                institute="学院"
                comments={{ WR: "太菜了", QA: "太菜了", ZX: "太菜了" }}
              />
            </Column>
          </div>
        </main>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Main));
