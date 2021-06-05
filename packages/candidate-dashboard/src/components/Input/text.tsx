import { TextField } from '@material-ui/core';
import { useController } from 'react-hook-form';

import type { InputProps } from './index';

export const TextInput: React.FC<Omit<InputProps, 'type'>> = ({ name, label, className, required }) => {
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
