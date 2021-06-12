import { Autocomplete, BaseTextFieldProps, TextField } from '@material-ui/core';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface Props extends BaseTextFieldProps {
    options: string[];
}

export const AutoComplete = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    options,
    ...rest
}: UseControllerProps<T, N> & Props) => {
    const {
        field: { onChange, onBlur, value },
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
        <Autocomplete
            value={value as string}
            inputValue={value ?? ''}
            options={options}
            onChange={(_, value) => onChange(value)}
            onInputChange={(_, value) => onChange(value)}
            onBlur={() => onBlur()}
            autoHighlight
            freeSolo
            renderInput={(params) => (
                <TextField {...params} error={invalid} variant='standard' {...rest} />
            )}
        />
    );
};
