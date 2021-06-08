import React, { FC, memo } from 'react';

import { Group } from '@components/Group';
import { Member } from '@components/Member';
import { TabLayout } from '@layouts/TabLayout';

const My: FC = memo(() => (
    <>
        <TabLayout
            items={[
                { label: '个人信息', value: 'me', component: <Member /> },
                { label: '组员信息', value: 'group', component: <Group /> },
            ]}
        />
    </>
));

export default My;
