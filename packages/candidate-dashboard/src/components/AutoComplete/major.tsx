import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { Departments } from 'config/departments';

import AutoComplete from './index';

export const MajorAutoComplete: FC<{ className?: string }> = ({ className }) => {
  const institute = useWatch({ name: 'institute' });
  const Majors = useMemo(
    () => Departments[institute as keyof typeof Departments] ?? Object.values(Departments).flat(),
    [institute],
  );
  return <AutoComplete name='major' label='专业' required className={className} options={Majors} />;
};
