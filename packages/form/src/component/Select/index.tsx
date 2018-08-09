import * as React from 'react';
import classNames from 'classnames';

interface Props {
    selections: string[];
    name: string;
    onChange: (e: React.ChangeEvent) => void;
}

class Select extends React.Component<Props> {
    state = {
        value: this.props.name,
        clicked: false,
    };

    handleChange = (event: React.MouseEvent) => {
        this.setState({
            value: event.target['innerHTML']
        });
        const e = {target: {value: event.target['innerHTML']}} as any;
        this.props.onChange(e as React.ChangeEvent);
    };

    handleClick = () => {
        this.setState({
            clicked: !this.state.clicked
        })
    };

    public render() {
        const { selections, name } = this.props;
        const { clicked, value } = this.state;
        return (
            <div className='selectContainer' onClick={this.handleClick}>
                <div className={classNames('select', {'selectClicked': clicked})}>
                    <div className={classNames('selectValue', {'hidden': value === name})}>{value}</div>
                    <div className={classNames({'hidden': value !== name})}>{name}</div>
                </div>
                {clicked && <div className='selectMenu'>
                    {selections.map((i, j) =>
                        <div key={j} onClick={this.handleChange}>{i}</div>
                    )}
                </div>}
                <svg className={classNames('selectArrow', {'selectArrowRotate': clicked})}>
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
