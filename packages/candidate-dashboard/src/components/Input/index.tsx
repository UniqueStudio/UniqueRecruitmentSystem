import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';

import { FileInput } from './file';
import { SelectInput } from './select';
import { TextInput } from './text';

const useStyle = makeStyles((theme) => ({
    input: {
        margin: theme.spacing(2),
        width: theme.spacing(24),
    },
}));

type InputType = 'text' | 'select' | 'file';

export interface InputProps {
    label: string;
    name: string;
    type: InputType;
    className?: string;
    required?: boolean;
    defaultValue?: string;
}

export const Input: FC<InputProps> = ({ type, children, className, ...props }) => {
    const classes = useStyle();

    switch (type) {
        case 'text':
            return <TextInput {...props} className={clsx(className, classes.input)} />;
        case 'select':
            return (
                <SelectInput {...props} className={clsx(className, classes.input)}>
                    {children}
                </SelectInput>
            );
        case 'file':
            return <FileInput {...props} />;
        default:
            return null;
    }
};
