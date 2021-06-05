import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { SnackbarItem } from './Item';

import { useStores } from '@hooks/useStores';
import useStyles from '@styles/snackbars';

interface Props {
    maxItems?: number;
    autoHideDuration?: number;
}

export const Snackbars: FC<Props> = observer(({ maxItems = 5, autoHideDuration = 3000 }) => {
    const classes = useStyles();
    const { $component } = useStores();
    return (
        <div className={classes.root}>
            {Object.entries($component.snackbars).map(([key, { variant, message }], index, array) => (
                <SnackbarItem
                    key={key}
                    popped={index < array.length - maxItems}
                    autoHideDuration={autoHideDuration}
                    variant={variant}
                    message={message}
                    TransitionProps={{
                        onExited() {
                            $component.removeSnackbar(key);
                        },
                    }}
                />
            ))}
        </div>
    );
});
