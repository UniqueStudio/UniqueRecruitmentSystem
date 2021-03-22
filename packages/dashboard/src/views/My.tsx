import React, { FC, memo } from 'react';

import Group from '../components/Group';
import User from '../components/User';

const My: FC = memo(() => (
    <>
        <User />
        <Group />
    </>
));

export default My;
