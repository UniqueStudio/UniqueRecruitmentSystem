import { Dialog, DialogTitle, Theme, useMediaQuery, DialogProps, DialogContent } from '@material-ui/core';
import { Application, InterviewType, Step } from '@uniqs/config';
import React, { FC } from 'react';

import { Allocations } from './Allocations';
import { Selections } from './Selections';
import { Slots } from './Slots';

import { getSlots } from '@apis/rest';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { useAppSelector } from '@stores/index';

interface Props extends DialogProps {
    application?: Partial<Application>;
    onClose: () => void;
}

export const InterviewDialog: FC<Props> = ({ application, ...rest }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const interviews = useAppSelector(({ recruitment }) => recruitment.interviews);
    useAsyncEffect(async () => {
        if (!application?.id) {
            return;
        }
        const { id, step } = application;
        if (step === Step.组面时间选择) {
            await getSlots(id, InterviewType.group);
        } else if (step === Step.群面时间选择) {
            await getSlots(id, InterviewType.team);
        }
    }, [application]);
    return (
        <Dialog fullScreen={isMobile} fullWidth maxWidth='lg' {...rest}>
            <DialogTitle>面试信息</DialogTitle>
            <DialogContent>
                {application?.step === Step.组面时间选择 && <Slots slots={interviews} type={InterviewType.group} />}
                {application?.step === Step.群面时间选择 && <Slots slots={interviews} type={InterviewType.team} />}
                {application ? <Selections application={application} /> : null}
                {application ? <Allocations application={application} /> : null}
            </DialogContent>
        </Dialog>
    );
};
