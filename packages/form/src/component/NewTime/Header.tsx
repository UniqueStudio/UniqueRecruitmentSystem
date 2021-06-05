import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import fontStyle from '../../style/Font';
import combineStyles from '../../utils/combindStyles';

const useStyles = makeStyles(
    combineStyles(
        (theme: Theme) =>
            createStyles({
                root: {
                    width: '100%',
                    textAlign: 'center',
                    marginTop: theme.spacing(1),
                },
                timeTitle: {
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    marginTop: theme.spacing(2),
                },
                subTitle: {
                    fontWeight: 'bold',
                    userSelect: 'none',
                    paddingBottom: theme.spacing(1),
                    color: theme.palette.primary.main,
                },
                description: {
                    fontWeight: 'bold',
                    userSelect: 'none',
                    color: theme.palette.primary.light,
                },
                emphasize: {
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    userSelect: 'none',
                    color: theme.palette.secondary.main,
                },
            }),
        fontStyle,
    ),
);

export default (): React.ReactElement => {
    const classes = useStyles() as any;
    return (
        <div className={classes.root}>
            <Typography variant={'h4'} className={classes.subTitle}>
                {'面试时间选择'}
            </Typography>
            <Typography variant={'subtitle1'} color={'primary'} className={classes.description}>
                {'请选择以下你有空的'}
                <span className={classes.emphasize}>{'全部'}</span>
                {'时间段，一旦确定无法更改。'}
            </Typography>
        </div>
    );
};
