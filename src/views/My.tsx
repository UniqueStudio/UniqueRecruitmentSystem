import React, { PureComponent } from 'react';

import { OptionsObject } from 'notistack';

import Group from '../components/Group';
import User from '../components/User';
import { User as UserType } from '../config/types';

interface Props {
    userInfo: UserType;
    groupInfo: UserType[];
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    submitInfo: (info: { phone: string, mail: string, password?: string }) => void;
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
