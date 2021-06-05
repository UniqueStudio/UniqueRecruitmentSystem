import React, { FC, memo, useEffect, useState } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { Props } from '../../containers/Verify';

import useStyles from '../../styles/verify';

const Verify: FC<Props> = memo(({ onChange, code, getVerifyCode }) => {
    const classes = useStyles();
    const [time, setTime] = useState(0);
    const [handle, setHandle] = useState(NaN);

    useEffect(
        () => () => {
            window.clearInterval(handle);
        },
        [handle],
    );

    const tick = () => {
        setTime((prevTime) => {
            if (prevTime === 0) {
                window.clearInterval(handle);
                setHandle(NaN);
                return 0;
            }
            return prevTime - 1;
        });
    };

    const getCode = () => {
        getVerifyCode();
        setTime(60);
        setHandle(window.setInterval(tick, 1000));
    };
    return (
        <div className={classNames(classes.content, classes.item)}>
            <Button color='primary' onClick={getCode} disabled={time > 0}>
                {time > 0 ? `${time}秒后重新获取` : '获取验证码'}
            </Button>
            <TextField
                label='输入验证码'
                className={classNames(classes.item, classes.input)}
                onChange={onChange}
                value={code}
            />
        </div>
    );
});

export default Verify;
