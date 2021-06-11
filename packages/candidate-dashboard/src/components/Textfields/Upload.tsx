import { Button, ButtonTypeMap } from '@material-ui/core';
import { BaseProps } from '@material-ui/core/OverridableComponent';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface Props extends BaseProps<ButtonTypeMap> {
    label: string;
}

export const Upload = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    label,
    ...rest
}: UseControllerProps<T, N> & Props) => {
    const {
        field: { ref, onChange, onBlur, value },
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
    const files = value as FileList | undefined;
    return (
        <Button component='label' {...rest}>
            {files?.[0]?.name ?? label}
            <input ref={ref} onChange={(e) => onChange(e.target.files)} onBlur={onBlur} type='file' hidden />
        </Button>
    );
};
