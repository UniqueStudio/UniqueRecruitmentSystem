import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import AutoComplete from './index';

import { Departments } from 'config/departments';

export const MajorAutoComplete: FC<{ className?: string }> = ({ className }) => {
    const institute = useWatch({ name: 'institute' }) as string;
    const Majors = useMemo(
        () => institute in Departments ? Departments[institute] : Object.values(Departments).flat(),
        [institute],
    );
    return <AutoComplete name='major' label='专业' required className={className} options={Majors} />;
};
