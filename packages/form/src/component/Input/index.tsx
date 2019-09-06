import React, { memo } from 'react';

import { InputBase, InputLabel } from '@material-ui/core';
import classNames from 'classnames';
import useStyles from '../../style/Input';

interface InputProps {
    name: string;
    for: string;
    placeholder?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent) => void;
    size?: number;
    labelSize?: number;
    inputProps?: object;
}

const Input = memo((props: InputProps) => {
    const { for: htmlFor, name, size = 6, labelSize = 4, onChange, placeholder, inputProps } = props;
    const classes = useStyles({ size, labelSize });
    return (
        <div className={classNames(classes.container, classes.height)}>
            <div className={classes.labelContainer}>
                <InputLabel
                    classes={{ root: classNames(classes.label, classes.border, classes.labelText, classes.font) }}
                    htmlFor={htmlFor}
                >
                    {name}
                </InputLabel>
            </div>
            <div className={classes.inputContainer}>
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
});

export default Input;
