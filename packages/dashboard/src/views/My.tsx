import React, { FC, memo } from 'react';

import Group from '../containers/Group';
import User from '../containers/User';

const My: FC = memo(() => (
    <>
        <User />
        <Group />
    </>
));

export default My;
