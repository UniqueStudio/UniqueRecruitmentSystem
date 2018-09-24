import React, { PureComponent } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/appBar'
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    data: string[];
    currentValue: string;
    onChange: (event: React.ChangeEvent) => void;
}

class Selects extends PureComponent<Props> {

    render() {
        const { classes, data, onChange, currentValue } = this.props;
        return (
            <Select
                value={currentValue}
                onChange={onChange}
                className={classes.select}
            >
                {data.map(i =>
                    <MenuItem value={i.toLowerCase()} key={i.toLowerCase()}>{i}</MenuItem>
                )}
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


