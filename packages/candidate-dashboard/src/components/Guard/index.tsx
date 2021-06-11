import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { useAppSelector } from '@stores/index';

export const Guard: FC = ({ children }) => {
    const token = useAppSelector(({ candidate }) => candidate.token);
    return token ? <>{children}</> : <Redirect to='/auth' />;
};
