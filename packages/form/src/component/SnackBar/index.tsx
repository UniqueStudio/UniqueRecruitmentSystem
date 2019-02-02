import React, { PureComponent } from 'react';

interface Props {
    content: string;
    onClose: () => void;
}

class SnackBar extends PureComponent<Props> {

    public render() {
        const { content, onClose } = this.props;
        return (
            <div className='snackBar' ref={(e) => {
                if (e) e.addEventListener('animationend', onClose);
            }}>
                {content}
            </div>
        );
    }
}

export default SnackBar;
