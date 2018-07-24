import * as React from 'react';
import Button from '../Button';

class Choose extends React.Component {
    state = {
        choose: 0,
    };

    handleClick = (i: number) => {
        this.setState({
            choose: i
        })
    };

    public render() {
        return (
            <>
                <Button name='男'
                        bgColor={this.state.choose === 1 ? 'primaryLight' : 'white'}
                        textColor='primary'
                        onClick={() => this.handleClick(1)} />
                <Button name='性别'
                        bgColor='primary'
                        textColor='white'
                        className='disabled' />
                <Button name='女'
                        bgColor={this.state.choose === 2 ? 'primaryLight' : 'white'}
                        textColor='primary'
                        onClick={() => this.handleClick(2)} />
            </>
        );
    }
}

export default Choose;
