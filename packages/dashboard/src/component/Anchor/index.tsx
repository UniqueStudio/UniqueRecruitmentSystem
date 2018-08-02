import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import withRoot from '../../style/withRoot';

import { Link } from 'react-router-dom';

interface Props extends WithStyles {
    to: string
}

class Anchor extends PureComponent<Props> {

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

export default withRoot(withStyles({})(Anchor));
