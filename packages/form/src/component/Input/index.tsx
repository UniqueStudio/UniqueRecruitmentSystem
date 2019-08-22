import React, { PureComponent } from 'react';

import { InputBase, InputLabel } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import styles from '../../style/Input';

interface Props extends WithStyles<typeof styles> {
    name: string;
    for: string;
    placeholder?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent) => void;
    size?: number;
    labelSize?: number;
    inputProps?: object;
}

class Input extends PureComponent<Props> {
    render() {
        const { for: htmlFor, name, size, labelSize, onChange, placeholder, classes, inputProps } = this.props;
        return (
            <div className={classes.container}>
                <div style={{ width: `${labelSize || 4}vw` }}>
                    <InputLabel
                        classes={{ root: classNames(classes.label, classes.border, classes.labelText, classes.font) }}
                        htmlFor={htmlFor}
                    >
                        {name}
                    </InputLabel>
                </div>
                <div style={{ width: `${size || 6}vw` }}>
                    <InputBase
                        classes={{ root: classNames(classes.input, classes.border, classes.inputText, classes.font) }}
                        name={htmlFor}
                        id={htmlFor}
                        placeholder={placeholder}
                        onChange={onChange}
                        inputProps={inputProps}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Input);
