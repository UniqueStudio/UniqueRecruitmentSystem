import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import { colorStyles } from './comment';

const styles: StyleRulesCallback = () => ({
    ...colorStyles,
    iconButton: {
        fill: 'white',
    },
});

export default styles;
