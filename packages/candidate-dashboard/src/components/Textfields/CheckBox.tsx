import { Checkbox, FormControlLabelProps, FormControlLabel } from '@material-ui/core';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

export const CheckBox = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    ...rest
}: UseControllerProps<T, N> & Omit<FormControlLabelProps, 'control'>) => {
    const {
        field: { ref, onChange, onBlur, value },
    } = useController({
        name,
        control,
        defaultValue,
        shouldUnregister,
        rules,
    });

    return (
        <FormControlLabel
            control={<Checkbox onBlur={onBlur} onChange={onChange} checked={value ?? false} inputRef={ref} />}
            {...rest}
        />
    );
};
