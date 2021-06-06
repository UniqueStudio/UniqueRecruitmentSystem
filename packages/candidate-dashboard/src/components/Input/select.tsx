import { FormControl, FormHelperText, NativeSelect } from '@material-ui/core';
import { FC } from 'react';
import { useController } from 'react-hook-form';

import { InputProps } from './index';

export const SelectInput: FC<Omit<InputProps, 'type'>> = ({
    name,
    label,
    children,
    className,
    required = false,
}) => {
    const {
        field: { ref, ...props },
    } = useController({
        name,
    });
    return (
        <>
            <FormControl className={className} required={required}>
                <FormHelperText required={required}>{label}</FormHelperText>
                <NativeSelect {...props} inputRef={ref} variant='outlined' required={required}>
                    {children}
                </NativeSelect>
            </FormControl>
        </>
    );
};
