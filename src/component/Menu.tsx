import * as React from 'react';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    WithStyles,
    withStyles
} from '@material-ui/core';
import withRoot from '../style/withRoot';
import styles from '../style/style';

interface Props extends WithStyles {
    primary: string;
    children?: any;
}

class MenuItem extends React.Component<Props> {
    render() {
        const { children, primary } = this.props;
        return (
            <ListItem button>
                <ListItemIcon>
                    {children}
                </ListItemIcon>
                <ListItemText primary={primary} />
            </ListItem>
        )
    }
}

export default withRoot(withStyles(styles)(MenuItem));
