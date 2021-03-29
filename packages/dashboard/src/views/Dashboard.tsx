import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { RecruitmentDetail } from '@components/Recruitment/Detail';

const Dashboard: FC = observer(() => {
    return <RecruitmentDetail />;
});

export default Dashboard;
