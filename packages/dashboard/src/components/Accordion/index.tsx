import React, { PureComponent } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import styles from '../../styles/accordion';

interface Props extends WithStyles<typeof styles> {
    title: string;
    classes: Record<string, string>;
}

class Accordion extends PureComponent<Props> {

    render() {
        const { title, classes, children } = this.props;
        return (
            <ExpansionPanel className={classes.expansion}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>{title}</ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {children}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(Accordion);
