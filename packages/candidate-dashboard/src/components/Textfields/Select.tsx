import { MenuItem, TextField, BaseTextFieldProps } from '@material-ui/core';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface Props extends BaseTextFieldProps {
    selections: { key: string | number; value: string }[];
}

export const Select = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    selections,
    ...rest
}: UseControllerProps<T, N> & Props) => {
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
            select
            error={invalid}
            inputRef={ref}
            variant='standard'
            {...rest}
        >
            {selections.map(({ key, value }) => (
                <MenuItem key={key} value={key}>
                    {value}
                </MenuItem>
            ))}
        </TextField>
    );
};
