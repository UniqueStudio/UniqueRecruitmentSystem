import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';

interface Props {
    title: string;
}


export class Header extends PureComponent<Props> {
    render() {
        const { title, children } = this.props;
        return (
            <>
                <Typography variant="title" color="inherit" noWrap>
                    {title}
                </Typography>
                {children}
            </>
        )
    }
}