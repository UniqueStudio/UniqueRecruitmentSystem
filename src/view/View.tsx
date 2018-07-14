import * as React from "react";
import { withStyles } from "@material-ui/core";

import withRoot from "../style/withRoot";
import styles from "../style/index";
import Column from "../container/Column";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { STEP } from '../constants';

@DragDropContext(HTML5Backend)
class View extends React.Component<any> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.columnContainer}>
                {STEP.map(i => <Column title={i} key={i} />)}
                {/*this div with a full-width-space is used to show right margin of the last element*/}
                <div style={{visibility: 'hidden'}}>　</div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(View));
