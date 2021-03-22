import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactElement } from 'react';

import { GRADES } from '@config/consts';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';

const SMSPicker: FC = observer(() => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const handleDeselect = (id: string) => () => {
        $candidate.deselectCandidate(id);
    };

    const chips: ReactElement[] = [];
    $candidate.selected.forEach(({ _id, name, grade, institute }) =>
        chips.push(
            <Chip
                key={_id}
                label={`${name} ${GRADES[grade]} ${institute}`}
                onDelete={handleDeselect(_id)}
                className={classes.templateItem}
                color='primary'
            />,
        ),
    );
    return (
        <div className={clsx(classes.templateContent, classes.templateItem, classes.picker)}>
            {chips.length ? (
                chips
            ) : (
                <Typography variant='h6' className={classes.templateItem}>
                    你未选中任何人!
                </Typography>
            )}
        </div>
    );
});

export default SMSPicker;
