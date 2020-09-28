import React, { FC, memo } from 'react';

import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { GRADES } from '../../config/consts';
import { Candidate } from '../../config/types';

import useStyles from '../../styles/sms';

interface Props {
    selected: Candidate[];
    onDelete: (name: string) => () => void;
}

const SMSPicker: FC<Props> = memo(({ onDelete, selected }) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.templateContent, classes.templateItem, classes.picker)}>
            {!selected.length ? (
                <Typography variant='h6' className={classes.templateItem}>
                    你未选中任何人!
                </Typography>
            ) : (
                selected.map(({ _id, name, grade, institute }) => (
                    <Chip
                        key={_id}
                        label={`${name} ${GRADES[grade]} ${institute}`}
                        onDelete={onDelete(_id)}
                        className={classes.templateItem}
                        color='primary'
                    />
                ))
            )}
        </div>
    );
});

export default SMSPicker;
