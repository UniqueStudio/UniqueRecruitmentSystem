import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    to: string;
}

class Anchor extends PureComponent<Props> {

    render() {
        const { children, to } = this.props;
        return (
            <Link
                to={to}
                style={{
                    textDecoration: 'none',
                    outline: 'none',
                }}
            >
                {children}
            </Link>
        );
    }
}

export default Anchor;
