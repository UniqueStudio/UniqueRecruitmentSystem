import { Button } from '@material-ui/core';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { InputProps } from './index';

export const FileInput: FC<Omit<InputProps, 'type'>> = ({ name, label, required }) => {
    const { register } = useFormContext();
    return (
        <>
            <Button variant='contained' component='label' color='secondary'>
                {label}
                <input
                    id={name}
                    {...register(name, {
                        required,
                    })}
                    type='file'
                    hidden
                    required={required}
                />
            </Button>
        </>
    );
};
