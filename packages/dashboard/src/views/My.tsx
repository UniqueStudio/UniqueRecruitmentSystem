import React, { PureComponent } from 'react';

import { InjectedNotistackProps } from 'notistack';

import Group from '../components/Group';
import User from '../components/User';
import { User as UserType } from '../config/types';

interface Props {
    userInfo: UserType;
    groupInfo: UserType[];
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];
    submitInfo: (info: { phone: string, mail: string }) => void;
}

class My extends PureComponent<Props> {

    render() {
        const { userInfo, groupInfo, submitInfo, enqueueSnackbar } = this.props;

        return (
            <>
                <User userInfo={userInfo} enqueueSnackbar={enqueueSnackbar} submitInfo={submitInfo} />
                <Group groupInfo={groupInfo} enqueueSnackbar={enqueueSnackbar} />
            </>
        );
    }
}

export default My;
