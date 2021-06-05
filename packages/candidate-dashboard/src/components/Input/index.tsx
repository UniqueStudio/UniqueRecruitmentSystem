import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import { TextInput } from './text';
import { SelectInput } from './select';
import { FileInput } from './file';

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

export const Input: React.FC<InputProps> = ({ type, children, className, ...props }) => {
    const classes = useStyle();

    if (type === 'text') {
        return <TextInput {...props} className={clsx(className, classes.input)} />;
    } else if (type === 'select') {
        return (
            <SelectInput {...props} className={clsx(className, classes.input)}>
                {children}
            </SelectInput>
        );
    } else if (type === 'file') {
        return <FileInput {...props} />;
    }

    return null;
};
