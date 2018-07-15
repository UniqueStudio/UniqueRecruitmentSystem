import * as React from "react";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Dispatch } from 'redux';

import withRoot from "../../style/withRoot";
import styles from "../../style/index";
import Column from "../../container/Column";

import { requestCandidate } from '../../action/async';
import { STEP } from '../../lib/const';

interface Props extends WithStyles {
    isLoading: boolean;
    pathname: string;
    dispatch: Dispatch<any>;
}

class Container extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.props.dispatch(requestCandidate('web'));
    }

    render() {
        const { classes, pathname } = this.props;
        const steps = pathname === '/view' ? STEP : STEP.slice(4);
        return (
            <div className={classes.columnContainer}>
                {steps.map(i => <Column title={i} key={i} />)}
                {/*this div with a full-width-space is used to show right margin of the last element*/}
                <div style={{visibility: 'hidden'}}>　</div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Container));
