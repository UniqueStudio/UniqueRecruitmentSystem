import { t } from '@lingui/macro';
import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { Departments } from '@uniqs/config';

import AutoComplete from './index';

export const MajorAutoComplete: FC<{ className?: string }> = ({ className }) => {
    const institute = useWatch({ name: 'institute' }) as string;
    const Majors = useMemo(
        () => institute in Departments ? Departments[institute] : Object.values(Departments).flat(),
        [institute],
    );
    return <AutoComplete name='major' label={t`专业`} required className={className} options={Majors} />;
};
