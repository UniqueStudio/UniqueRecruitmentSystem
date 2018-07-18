import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/index'
import withRoot from '../../style/withRoot';

import { Link } from 'react-router-dom';

interface Props extends WithStyles {
    to: string
}

class Anchor extends React.Component<Props> {

    render() {
        const { children, to } = this.props;
        return (
            <Link to={to} style={{
                textDecoration: 'none',
                outline: 'none'
            }}>
                {children}
            </Link>
        );
    }
}

export default withRoot(withStyles(styles)(Anchor));
