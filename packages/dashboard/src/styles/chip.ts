import { alpha, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Evaluation } from '@config/enums';

const useStyles = makeStyles(({ spacing, palette }: Theme) => {
    const colors = {
        [Evaluation.good]: palette.success.main,
        [Evaluation.fair]: palette.warning.main,
        [Evaluation.poor]: palette.error.main,
    };
    return {
        chip: ({ evaluation }: { evaluation: Evaluation }) => ({
            margin: spacing(1),
            cursor: 'pointer',
            maxWidth: '90%',
            background: colors[evaluation],
            color: 'white',
            '&:hover': {
                background: alpha(colors[evaluation], 0.6),
            },
        }),
        popover: {
            pointerEvents: 'none',
        },
        content: ({ evaluation }: { evaluation: Evaluation }) => ({
            maxWidth: 400,
            background: colors[evaluation],
            color: 'white',
            padding: spacing(2),
            wordWrap: 'break-word',
        }),
    };
});

export default useStyles;
