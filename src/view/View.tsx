import * as React from "react";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withStyles, WithStyles } from "@material-ui/core/styles";

import withRoot from "../style/withRoot";
import styles from "../style/index";

import ColumnContainer from '../container/Column/ColumnContainer';

@DragDropContext(HTML5Backend)
class View extends React.Component<WithStyles> {
    render() {
        return <ColumnContainer />;
    }
}

export default withRoot(withStyles(styles)(View));
