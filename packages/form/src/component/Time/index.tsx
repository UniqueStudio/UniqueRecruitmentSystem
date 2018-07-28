import * as React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import Modal from '../Modal';
import Submitted from '../Submitted';

class Time extends React.Component {

    state = {
        modal: '',
        clicked: [] as number[],
        confirmed: ''
    };

    handleClick = (action: string) => () => {
        this.setState({
            modal: action
        })
    };

    handleSelect = (t: number) => () => {
        if (this.state.clicked.includes(t)) {
            this.setState({
                clicked: this.state.clicked.filter(i => i !== t)
            })
        } else {
            this.setState({
                clicked: [...this.state.clicked, t]
            })
        }
    };

    handleConfirm = () => (type: string) => {
        this.setState({
            modal: '',
            confirmed: type
        })
    };

    handleDeny = () => {
        this.setState({
            modal: ''
        })
    };

    public render() {
        return (
            <>
                <div className='timeContainer'>
                    <div className='timeHeader'>
                        <h2 className='subtitle'>面试时间选择</h2>
                        <h3 className={classNames('description', { 'none': this.state.confirmed })}>请选择以下你有空的全部时间段，一旦确定无法更改。</h3>
                    </div>
                    {this.state.confirmed === '' && <>
                        {['9月13日', '9月14日', '9月15日'].map((i, j) =>
                            <div key={j} className='timeContent'>
                                <Button name={i}
                                        bgColor='primary'
                                        textColor='white'
                                        className='disabled'
                                />
                                {['上午', '下午', '晚上'].map((k, l) =>
                                    <Button name={k}
                                            key={l}
                                            bgColor={this.state.clicked.includes(j * 3 + l) ? 'primaryLight' : 'white'}
                                            textColor='primary'
                                            onClick={this.handleSelect(j * 3 + l)}
                                    />
                                )}
                            </div>
                        )}
                        <div className={classNames('submit', 'timeSubmit')}>
                            {this.state.modal &&
                            <Modal type={this.state.modal} onConfirm={this.handleConfirm()} onDeny={this.handleDeny} />}
                            <Button name='无法到场'
                                    bgColor='primaryLightLittleMore'
                                    textColor='white'
                                    onClick={this.handleClick('abandon')}
                            />
                            <Button name='提交' bgColor='secondary' textColor='white'
                                    onClick={this.handleClick('submit')} />
                        </div>
                    </>}
                    {
                        this.state.confirmed !== '' &&
                        <Submitted title='你的决定已提交' description={this.state.confirmed === 'abandon'
                            ? '我们非常抱歉，同时感到非常惋惜，希望下次招新能够与你相遇，再见！'
                            : '你已成功提交面试时间，请等待我们的短信通知！'
                        } />
                    }
                </div>
                <div
                    className={classNames('layer', { none: this.state.modal === '' }, this.state.modal === 'submit' ? 'layerSecondary' : 'layerPrimary')} />
            </>
        );
    }
}

export default Time;
