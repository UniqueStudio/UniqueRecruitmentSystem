import * as React from 'react';
import classNames from 'classnames';

interface Props {
    title: string;
    description: string;
    className?: string;
}

class Submitted extends React.Component<Props> {

    public render() {
        const { title, description, className } = this.props;
        return (
            <div className={classNames('decided', className)}>
                <div className='decidedTitle'>
                    <span>{title}</span>
                    <svg className='done' viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                </div>
                <div className='decidedDescription'>{description}</div>
            </div>
        );
    }
}

export default Submitted;
