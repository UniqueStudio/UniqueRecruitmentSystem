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

interface Props {
    isMobile: boolean
}

const URL = 'http://39.108.175.151:5000';

class Time extends React.Component<Props> {

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

    componentDidMount() {
        const params = window.location.pathname.split('/').splice(1);
        const cid = params[1];
        const formId = params[0];
        this.getForm(cid, formId);
    }

    getForm = async (cid: string, formId: string) => {
        try {
            const response = await fetch(`${URL}/form/${formId}/${cid}`);
            const result = await response.json();
            if (result.type === 'success') {
                sessionStorage.setItem('token', result.token);
                this.setState({
                    time: result.time,
                    step: formId[formId.length - 1],
                    cid: cid
                })
            } else {
                this.setState({
                    snackBarOn: true,
                    content: '获取表单出了问题，请尝试重新加载'
                })
            }
        } catch (err) {
            this.setState({
                snackBarOn: true,
                content: '获取表单出了问题，请尝试重新加载'
            })
        }
    };

    submitForm = async (time: object[], type: string, token: string) => {
        try {
            const response = await fetch(`${URL}/candidates/${this.state.cid}`, {
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
            });
            const result = await response.json();
            if (result.type === 'success') {
                this.setState({
                    modal: '',
                    confirmed: type
                })
            } else {
                this.setState({
                    snackBarOn: true,
                    content: result.message
                })
            }
        } catch (err) {
            this.setState({
                snackBarOn: true,
                content: '提交出现了问题，请尝试重新提交'
            })
        }
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
        this.submitForm(time, type, token)
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
        const { time, confirmed } = this.state;
        const { isMobile } = this.props;
        const Buttons = (i: object, j: number) => ['上午', '下午', '晚上'].map((k, l) => {
            const disabled = !i[['morning', 'afternoon', 'evening'][l]];
            return <Button name={k} key={l}
                           bgColor={disabled ? 'grey' : this.state.clicked.includes(j * 3 + l) ? 'primaryLight' : 'white'}
                           textColor={disabled ? 'white' : 'primary'}
                           onClick={(disabled || this.state.modal) ? undefined : this.handleSelect(j * 3 + l)}
                           className={classNames({ disabled: disabled })}
            />
        });

        return time.length !== 0 && (
            <>
                <div className='timeContainer'>
                    <div className='time'>
                        <div className='timeHeader'>
                            <h2 className='subtitle'>面试时间选择</h2>
                            {isMobile ? <>
                                <h3 className={classNames('description', { 'none': confirmed })}>
                                    请选择以下你有空的<em className='emphasize'>全部</em>时间段，
                                </h3>
                                <h3 className={classNames('description', { 'none': confirmed })}>
                                    一旦确定无法更改。
                                </h3>
                            </> : <h3 className={classNames('description', { 'none': confirmed })}>
                                请选择以下你有空的<em className='emphasize'>全部</em>时间段，一旦确定无法更改。
                            </h3>}
                        </div>
                        {confirmed === '' && <>
                            {time.map((i, j) =>
                                <div key={j} className='timeContent'>
                                    <Button name={`${i.date.split('-')[1]}月${i.date.split('-')[2]}日`}
                                            bgColor='primary'
                                            textColor='white'
                                            className='disabled'
                                    />
                                    {isMobile ? <div className='timeButtons'>
                                        {Buttons(i, j)}
                                    </div> : Buttons(i, j)}
                                </div>
                            )}
                            <div className={classNames('submit', 'timeSubmit')}>
                                {this.state.modal &&
                                <Modal type={this.state.modal} onConfirm={this.handleConfirm()}
                                       onDeny={this.handleDeny} />}
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
                                ? '我们非常惋惜，希望下次招新能够与你相遇，再见！'
                                : '你已成功提交面试时间，请等待我们的短信通知！'
                            } />
                        }
                    </div>
                </div>
                <div
                    className={classNames('layer', { none: this.state.modal === '' }, this.state.modal === 'submit' ? 'layerSecondary' : 'layerPrimary')} />
                {this.state.snackBarOn && <SnackBar content={this.state.content} onClose={this.handleClose} />}
            </>
        );
    }
}

export default Time;
