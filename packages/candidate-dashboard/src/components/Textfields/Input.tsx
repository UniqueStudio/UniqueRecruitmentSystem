import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

export const Input = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    ...rest
}: UseControllerProps<T, N> & TextFieldProps) => {
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
            inputRef={ref}
            variant='standard'
            required
            {...rest}
        />
    );
};
