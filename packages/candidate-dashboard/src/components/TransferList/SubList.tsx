import {
    Card,
    CardHeader,
    CardHeaderProps,
    Checkbox,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import React, { Dispatch, FC, SetStateAction } from 'react';

interface Props {
    title: CardHeaderProps['title'];
    items: Map<string, string>;
    checked: Set<string>;
    setChecked: Dispatch<SetStateAction<Set<string>>>;
    disabled?: boolean;
}

export const SubList: FC<Props> = ({ title, items, checked, setChecked, disabled = false }) => {
    const handleToggle = (key: string) => () =>
        setChecked((prevChecked) => {
            const checked = new Set(prevChecked);
            if (prevChecked.has(key)) {
                checked.delete(key);
            } else {
                checked.add(key);
            }
            return checked;
        });

    const handleToggleAll = () =>
        setChecked((prevChecked) => {
            if (prevChecked.size === items.size) {
                return new Set();
            } else {
                return new Set(items.keys());
            }
        });

    return (
        <Card variant='outlined' sx={{ width: 130 }}>
            <CardHeader
                sx={{ p: 0, py: 0.5, pr: 1, '& > .MuiCardHeader-avatar': { mr: 0 } }}
                avatar={
                    <Checkbox
                        size='small'
                        onClick={handleToggleAll}
                        checked={checked.size === items.size && !!checked.size}
                        indeterminate={checked.size !== items.size && !!checked.size}
                        disabled={disabled || !items.size}
                    />
                }
                title={title}
                subheader={`${checked.size}/${items.size}`}
            />
            <Divider />
            <List dense>
                {[...items.entries()].map(([key, value]) => (
                    <ListItem key={key} button onClick={handleToggle(key)} sx={{ p: 0, pr: 1 }} disabled={disabled}>
                        <ListItemIcon sx={{ minWidth: 'unset' }}>
                            <Checkbox size='small' checked={checked.has(key)} disabled={disabled} />
                        </ListItemIcon>
                        <ListItemText primary={value} />
                    </ListItem>
                ))}
            </List>
        </Card>
    );
};
