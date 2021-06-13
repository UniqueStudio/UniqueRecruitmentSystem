import { TextFieldProps, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Upload as UploadIcon } from '@material-ui/icons';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

export const Upload = <T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
    control,
    name,
    rules,
    defaultValue,
    shouldUnregister,
    ...rest
}: UseControllerProps<T, N> & TextFieldProps) => {
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
        <TextField
            variant='standard'
            required
            InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position='end'>
                        <label htmlFor='resume'>
                            <input
                                ref={ref}
                                id='resume'
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                type='file'
                                hidden
                            />
                            <IconButton component='span' size={rest.size}>
                                <UploadIcon />
                            </IconButton>
                        </label>
                    </InputAdornment>
                ),
                ...rest.InputProps,
            }}
            {...rest}
            value={files?.[0]?.name ?? rest.value ?? ''}
        />
    );
};
