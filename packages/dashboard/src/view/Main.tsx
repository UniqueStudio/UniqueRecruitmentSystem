import React, { PureComponent } from "react";
import { Route, withRouter } from "react-router-dom";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import AppBar from "../container/AppBar/AppBar";
import Menu from "../container/Menu/index";
import styles from "../style/main";
import withRoot from "../style/withRoot";

import Content from "../container/Content";
import Index from './Index';
import Data from './Data';
import Candidates from './Candidates';
import MassInterview from './MassInterview';
import MyInfo from './MyInfo';
import MyGroup from './MyGroup';

class Main extends PureComponent<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar />
                <Menu />
                <Content>
                    <Route path='/' exact component={Index} />
                    <Route path='/data' component={Data} />
                    <Route path='/candidates' component={Candidates}/>
                    <Route path='/massInterview' component={MassInterview}/>
                    <Route path='/myInfo' component={MyInfo} />
                    <Route path='/myGroup' component={MyGroup} />
                </Content>
            </div>
        );
    }
}

export default withRouter(withRoot(withStyles(styles)(Main)));
