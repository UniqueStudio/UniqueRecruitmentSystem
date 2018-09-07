import * as React from 'react';
import classNames from 'classnames';
import arrow from '../../asset/img/arrow.svg'

interface Props {
    selections: string[];
    name: string;
    onChange: (e: React.ChangeEvent) => void;
    onToggle: () => void;
    open: boolean;
}

class Select extends React.Component<Props> {
    state = {
        value: this.props.name,
    };

    handleChange = (event: React.MouseEvent) => {
        this.setState({
            value: event.target['innerHTML']
        });
        const e = {target: {value: event.target['innerHTML']}} as any;
        this.props.onChange(e as React.ChangeEvent);
    };


    public render() {
        const { selections, name, open, onToggle } = this.props;
        const { value } = this.state;
        return (
            <div className='selectContainer' onClick={onToggle}>
                <div className={classNames('select', {'selectClicked': open})}>
                    <div className={classNames('selectValue', {'hidden': value === name})}>{value}</div>
                    <div className={classNames({'hidden': value !== name})}>{name}</div>
                    <img src={arrow} className={classNames('selectArrow', {'selectArrowRotate': open})} />
                </div>
                {open && <div className='selectMenu'>
                    {selections.map((i, j) =>
                        <div key={j} onClick={this.handleChange}>{i}</div>
                    )}
                </div>}

            </div>
        );
    }
}

export default Select;
