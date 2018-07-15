import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import withRoot from "../style/withRoot";
import styles from "../style/index";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ColumnContainer from '../container/ColumnContainer';

@DragDropContext(HTML5Backend)
class View extends React.Component<WithStyles> {
    render() {
        return <ColumnContainer />;
    }
}

export default withRoot(withStyles(styles)(View));
