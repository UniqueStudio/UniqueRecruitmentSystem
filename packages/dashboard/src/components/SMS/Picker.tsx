import { Chip, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactElement } from 'react';

import { GRADES } from '@config/consts';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';

export const SMSPicker: FC = observer(() => {
    const { $application } = useStores();
    const classes = useStyles();
    const handleDeselect = (id: string) => () => {
        $application.deselectOne(id);
    };

    const chips: ReactElement[] = [];
    $application.selected.forEach(({ id, candidate, grade, institute }) =>
        chips.push(
            <Chip
                key={id}
                label={`${candidate.name} ${GRADES[grade]} ${institute}`}
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
