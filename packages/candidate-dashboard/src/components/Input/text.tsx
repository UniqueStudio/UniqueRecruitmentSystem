import { TextField } from '@material-ui/core';
import { FC } from 'react';
import { useController } from 'react-hook-form';

import { InputProps } from './index';

export const TextInput: FC<Omit<InputProps, 'type'>> = ({ name, label, className, required }) => {
    const {
        field: { ref, ...props },
        fieldState: { invalid, error },
    } = useController({
        name,
        rules: { required },
    });
    return (
        <>
            <TextField
                {...props}
                inputRef={ref}
                error={invalid}
                helperText={error?.message}
                required={required}
                label={label}
                variant='outlined'
                className={className}
            />
        </>
    );
};
