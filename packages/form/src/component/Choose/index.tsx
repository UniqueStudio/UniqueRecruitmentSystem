import * as React from 'react';
import Button from '../Button';

interface Props {
    onChange: (e: React.ChangeEvent) => void;
}

class Choose extends React.Component<Props> {
    state = {
        choose: 0,
    };

    handleClick = (i: number) => {
        this.setState({
            choose: i
        });
        const e = {target: {value: ['男', '女'][i - 1]}} as any;
        this.props.onChange(e as React.ChangeEvent);
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
