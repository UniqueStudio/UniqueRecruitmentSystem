import { Chip, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactElement } from 'react';

import { GRADES } from '@config/consts';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';

export const SMSPicker: FC = observer(() => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const handleDeselect = (id: string) => () => {
        $candidate.deselectOne(id);
    };

    const chips: ReactElement[] = [];
    $candidate.selected.forEach(({ id, name, grade, institute }) =>
        chips.push(
            <Chip
                key={id}
                label={`${name} ${GRADES[grade]} ${institute}`}
                onDelete={handleDeselect(id)}
                className={classes.templateItem}
                color='primary'
            />,
        ),
    );
    return (
        <div className={classes.templateItem}>
            {chips.length ? chips : <Typography variant='body1'>你未选中任何人!</Typography>}
        </div>
    );
});
