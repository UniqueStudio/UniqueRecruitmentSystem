import React, { PureComponent } from 'react';

import classNames from 'classnames';
import arrow from '../../asset/img/arrow.svg';

interface Props {
    selections: string[];
    value: string;
    defaultValue: string;
    handleSelect: (value: string | number) => () => void;
    onToggle: () => void;
    open: boolean;
}

class Select extends PureComponent<Props> {

    render() {
        const { selections, defaultValue, open, onToggle, handleSelect, value } = this.props;
        return (
            <div className='selectContainer' onClick={onToggle}>
                <div className={classNames('select', { 'selectClicked': open })}>
                    <div className={classNames('selectValue', { 'hidden': !value })}>{value}</div>
                    <div className={classNames({ 'hidden': value })}>{defaultValue}</div>
                    <img src={arrow} className={classNames('selectArrow', { 'selectArrowRotate': open })} alt='arrow' />
                </div>
                {open && <div className='selectMenu'>
                    {selections.map((i, j) =>
                        <div key={j} onClick={handleSelect(j)}>{i}</div>
                    )}
                </div>}
            </div>
        );
    }
}

export default Select;
