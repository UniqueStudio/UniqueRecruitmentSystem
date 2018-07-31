import * as React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import Modal from '../Modal';
import Submitted from '../Submitted';
import SnackBar from '../SnackBar';

interface Date {
    date: string;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
}

class Time extends React.Component {

    constructor(props: {}) {
        super(props);
        const params = window.location.pathname.split('/').splice(1);
        const cid = params[1];
        const formId = params[0];
        fetch(`http://39.108.175.151:5000/form/${formId}/${cid}`)
            .then(res => {
                try {
                    return res.json();
                } catch (err) {
                    throw new Error()
                }
            })
            .then(res => {
                if (res.type === 'success') {
                    sessionStorage.setItem('token', res.token);
                    this.setState({
                        time: res.time,
                        step: formId[formId.length - 1],
                        cid: cid
                    })
                } else throw res;
            })
            .catch(() => this.setState({
                snackBarOn: true,
                content: '获取表单出了问题，请尝试重新加载'
            }));
    }


    state = {
        modal: '',
        clicked: [] as number[],
        confirmed: '',
        content: '',
        snackBarOn: false,
        cid: '',
        step: '',
        time: [] as Date[]
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
        const time = this.state.time.map(i => ({ date: i.date }));
        this.state.clicked.map(i => {
            const int = Math.floor(i / 3);
            const res = i - int * 3;
            time[int][['morning', 'afternoon', 'evening'][res]] = true;
        });
        const token = sessionStorage.getItem('token');
        if (!token) {
            this.setState({
                snackBarOn: true,
                content: 'token不存在'
            });
            return;
        }
        fetch(`http://39.108.175.151:5000/candidates/${this.state.cid}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patch: this.state.modal === 'abandon'
                        ? { abandon: true }
                        : this.state.step === '1'
                            ? { time1: time }
                            : { time2: time }
                })
            }
        )
            .then(res => res.json())
            .then(res => {
                if (res.type === 'success') {
                    this.setState({
                        modal: '',
                        confirmed: type
                    })
                } else throw res;
            })
            .catch(() => this.setState({
                snackBarOn: true,
                content: '提交出现了问题，请尝试重新提交'
            }));
    };

    handleDeny = () => {
        this.setState({
            modal: ''
        });
    };

    handleClose = () => {
        this.setState({
            snackBarOn: false,
            content: ''
        })
    };

    public render() {
        const { time } = this.state;
        return time.length !== 0 && (
            <>
                <div className='timeContainer'>
                    <div className='timeHeader'>
                        <h2 className='subtitle'>面试时间选择</h2>
                        <h3 className={classNames('description', { 'none': this.state.confirmed })}>
                            请选择以下你有空的<em className='emphasize'>全部</em>时间段，一旦确定无法更改。
                        </h3>
                    </div>
                    {this.state.confirmed === '' && <>
                        {time.map((i, j) =>
                            <div key={j} className='timeContent'>
                                <Button name={`${i.date.split('-')[1]}月${i.date.split('-')[2]}日`}
                                        bgColor='primary'
                                        textColor='white'
                                        className='disabled'
                                />
                                {['上午', '下午', '晚上'].map((k, l) => {
                                    const disabled = !i[['morning', 'afternoon', 'evening'][l]];
                                    return <Button name={k} key={l}
                                                   bgColor={disabled ? 'primary' : this.state.clicked.includes(j * 3 + l) ? 'primaryLight' : 'white'}
                                                   textColor={disabled ? 'white' : 'primary'}
                                                   onClick={(disabled || this.state.modal) ? undefined : this.handleSelect(j * 3 + l)}
                                                   className={classNames({ disabled: disabled })}
                                    />
                                })}
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
                                    onClick={this.state.clicked.length ? this.handleClick('submit') : undefined}
                                    className={classNames({ 'disabled': this.state.clicked.length === 0 })}
                            />
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
                {this.state.snackBarOn && <SnackBar content={this.state.content} onClose={this.handleClose} />}
            </>
        );
    }
}

export default Time;
