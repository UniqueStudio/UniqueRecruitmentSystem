import { IconButton, InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

export const Password = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    ...rest
}: UseControllerProps<T, N> & TextFieldProps) => {
    const [display, setDisplay] = useState(false);
    const {
        field: { ref, onChange, onBlur, value },
        fieldState: { invalid },
    } = useController({
        name,
        control,
        defaultValue,
        shouldUnregister,
        rules: {
            required: true,
            ...rules,
        },
    });

    return (
        <TextField
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            type={display ? 'text' : 'password'}
            inputRef={ref}
            variant='standard'
            required
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton size={rest.size} onClick={() => setDisplay((prevDisplay) => !prevDisplay)}>
                            {display ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
                ...rest.InputProps,
            }}
            {...rest}
        />
    );
};
