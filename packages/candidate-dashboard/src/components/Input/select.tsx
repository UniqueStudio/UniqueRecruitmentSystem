import { FormControl, FormHelperText, NativeSelect } from '@material-ui/core';
import { useController } from 'react-hook-form';

import type { InputProps } from './index';

export const SelectInput: React.FC<Omit<InputProps, 'type'>> = ({
  name,
  label,
  children,
  className,
  required = false,
}) => {
  const {
    field: { ref, ...props },
  } = useController({
    name,
  });
  return (
    <>
      <FormControl className={className} required={required}>
        <FormHelperText required={required}>{label}</FormHelperText>
        <NativeSelect {...props} inputRef={ref} variant='outlined' required={required}>
          {children}
        </NativeSelect>
      </FormControl>
    </>
  );
};
