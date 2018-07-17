import * as React from "react";
import { WithStyles, withStyles } from '@material-ui/core/styles';

import withRoot from "../../style/withRoot";
import styles from "../../style/index";
import Column from "../../container/Column/Column";

import { STEP } from '../../lib/const';

interface Props extends WithStyles {
    candidates: object;
    pathname: string;
    changeGroup: (group: string) => void;
}

class Container extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        props.changeGroup('web');
    }

    render() {
        const { classes, pathname, candidates } = this.props;
        const steps = pathname === '/view' ? STEP : STEP.slice(4);
        return (
            <div className={classes.columnContainer}>
                {steps.map(i => <Column title={i} key={i} candidates={candidates[STEP.indexOf(i)] || {}} />)}
                {/*this div with a full-width-space is used to show right margin of the last element*/}
                <div style={{ visibility: 'hidden' }}>{'　'}</div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Container));
