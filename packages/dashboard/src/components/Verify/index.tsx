import { Button, TextField } from '@material-ui/core';
import React, { ChangeEventHandler, FC, memo, useEffect, useState } from 'react';

import { getVerifyCode } from '@apis/rest';
import useStyles from '@styles/verify';

interface Props {
    code: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Verify: FC<Props> = memo(({ onChange, code }) => {
    const classes = useStyles();
    const [time, setTime] = useState(0);
    const [handle, setHandle] = useState(NaN);

    useEffect(() => () => window.clearInterval(handle), [handle]);

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
        void getVerifyCode();
        setTime(60);
        setHandle(window.setInterval(tick, 1000));
    };
    return (
        <div className={classes.content}>
            <Button onClick={getCode} disabled={time > 0}>
                {time > 0 ? `${time}秒后重新获取` : '获取验证码'}
            </Button>
            <TextField
                variant='standard'
                label='输入验证码'
                className={classes.input}
                onChange={onChange}
                value={code}
            />
        </div>
    );
});
