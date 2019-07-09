import React, { PureComponent } from 'react';

import classNames from 'classnames';
import { URL } from '../../config/const';
import Button from '../Button';
import Modal from '../Modal';
import Submitted from '../Submitted';

interface Date {
    date: number;
    morning: number;
    afternoon: number;
    evening: number;
}

const MokeDates: Date[] = [
    {
        date: 2,
        morning: 1,
        afternoon: 1,
        evening: 1,
    },
    {
        date: 2,
        morning: 1,
        afternoon: 1,
        evening: 1,
    },
    {
        date: 2,
        morning: 1,
        afternoon: 1,
        evening: 1,
    },
    {
        date: 2,
        morning: 1,
        afternoon: 1,
        evening: 1,
    },
]


interface Props {
    isMobile: boolean;
    toggleSnackbar: (content: string) => void;
}

const getDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
};

class Time extends PureComponent<Props> {

    state = {
        modal: '',
        clicked: [] as number[],
        confirmed: '',
        step: '',
        time: [] as Date[]
    };

    async componentDidMount() {
        const params = window.location.pathname.split('/').splice(1);
        const cid = params[1];
        const formId = params[0];
        await this.getForm(cid, formId);
    }

    getForm = async (cid: string, formId: string) => {
        this.setState({
            time: MokeDates,
            step: "2",
        });
    };

    submitForm = async (time: object[], type: string, token: string) => {
        const { toggleSnackbar } = this.props;
        const { modal, step } = this.state;
        const params = window.location.pathname.split('/').splice(1);
        const cid = params[1];
        const formId = params[0];
        try {
            const response = await fetch(`${URL}/candidate/${cid}/form/${formId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(modal === 'abandon'
                    ? { abandon: true }
                    : step === '1'
                        ? { groupInterview: time }
                        : { teamInterview: time }
                )
            });
            const result = await response.json();
            if (result.type === 'success') {
                this.setState({
                    modal: '',
                    confirmed: type
                });
            } else {
                return toggleSnackbar(result.message);
            }
        } catch (err) {
            return toggleSnackbar('提交出现了问题，请尝试重新提交');
        }
    };

    handleClick = (action: string) => () => {
        this.setState({
            modal: action
        });
    };

    handleSelect = (t: number) => () => {
        if (this.state.clicked.includes(t)) {
            this.setState({
                clicked: this.state.clicked.filter((i) => i !== t)
            });
        } else {
            this.setState({
                clicked: [...this.state.clicked, t]
            });
        }
    };

    handleConfirm = (type: string) => async () => {
        const { toggleSnackbar } = this.props;
        const time = this.state.time.map((i) => ({ date: i.date, morning: 0, afternoon: 0, evening: 0 }));
        this.state.clicked.map((i) => {
            const int = Math.floor(i / 3);
            const res = i - int * 3;
            time[int][['morning', 'afternoon', 'evening'][res]] = 1;
        });
        const token = sessionStorage.getItem('token');
        if (!token) {
            return toggleSnackbar('token不存在');
        }
        await this.submitForm(time, type, token);
    };

    handleDeny = () => {
        this.setState({
            modal: ''
        });
    };

    render() {
        const { time, confirmed, modal, clicked } = this.state;
        const { isMobile } = this.props;
        const Buttons = (date: Date, j: number) => ['上午', '下午', '晚上'].map((k, l) => {
            const disabled = !date[['morning', 'afternoon', 'evening'][l]];
            return <Button
                name={k}
                key={l}
                bgColor={disabled ? 'grey' : clicked.includes(j * 3 + l) ? 'primaryLight' : 'white'}
                textColor={disabled ? 'white' : 'primary'}
                onClick={disabled || modal ? undefined : this.handleSelect(j * 3 + l)}
                className={classNames({ disabled })}
            />;
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
                            {time.map((date, index) =>
                                <div key={index} className='timeContent'>
                                    <Button name={getDate(date.date)}
                                        bgColor='primary'
                                        textColor='white'
                                        className='disabled'
                                    />
                                    {isMobile ? <div className='timeButtons'>
                                        {Buttons(date, index)}
                                    </div> : Buttons(date, index)}
                                </div>
                            )}
                            <div className={classNames('submit', 'timeSubmit')}>
                                {modal && <Modal
                                    type={modal}
                                    onConfirm={this.handleConfirm(modal)}
                                    onDeny={this.handleDeny}
                                />}
                                <Button
                                    name='无法到场'
                                    bgColor='primaryLightLittleMore'
                                    textColor='white'
                                    onClick={this.handleClick('abandon')}
                                />
                                <Button
                                    name='提交'
                                    bgColor='secondary'
                                    textColor='white'
                                    onClick={clicked.length ? this.handleClick('submit') : undefined}
                                    className={classNames({ 'disabled': !clicked.length })}
                                />
                            </div>
                        </>}
                        {confirmed !== '' && <Submitted
                            title='你的决定已提交'
                            description={confirmed === 'abandon'
                                ? '我们非常惋惜，希望下次招新能够与你相遇，再见！'
                                : '你已成功提交面试时间，请等待我们的短信通知！'
                            }
                        />}
                    </div>
                </div>
                <div className={classNames('layer', { none: modal === '' }, modal === 'submit' ? 'layerSecondary' : 'layerPrimary')} />
            </>
        );
    }
}

export default Time;
