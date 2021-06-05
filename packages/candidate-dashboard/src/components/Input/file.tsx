import { Button } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import type { InputProps } from './index';

export const FileInput: React.FC<Omit<InputProps, 'type'>> = ({ name, label, required }) => {
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
