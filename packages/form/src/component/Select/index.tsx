import * as React from 'react';
import classNames from 'classnames';

interface Props {
    selections: string[];
    name: string;
}

class Select extends React.Component<Props> {
    state = {
        value: this.props.name,
        clicked: false,
    };

    handleChange = (event: React.MouseEvent) => {
        this.setState({
            value: event.target['innerHTML']
        })
    };

    handleClick = () => {
        this.setState({
            clicked: !this.state.clicked
        })
    };

    public render() {
        const { selections, name } = this.props;
        return (
            <div className='selectContainer' onClick={this.handleClick}>
                <div className='select'>
                    <div className={classNames('selectValue', {'hidden': this.state.value === name})}>{this.state.value}</div>
                    <div className={classNames({'hidden': this.state.value !== name})}>{name}</div>
                </div>
                <div className='selectMenu'>
                    {selections.map((i, j) =>
                        <div key={j} onClick={this.handleChange}>{i}</div>
                    )}
                </div>
                <svg className='selectArrow'>
                    <polyline points="3 11, 15 23, 27 11"
                              strokeWidth="2"
                              stroke="#3FA9F5"
                              fill="transparent" />
                </svg>
            </div>
        );
    }
}

export default Select;
