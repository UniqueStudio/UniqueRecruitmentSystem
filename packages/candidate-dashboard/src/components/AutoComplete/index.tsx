import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useController } from 'react-hook-form';

export interface AutoCompleteProps<Option = string> {
  name: string;
  className?: string;
  label: string;
  options: Option[];
  required?: boolean;
}

/**
 * An MUI Autocomplete wrapper component.
 * With `autoHighlight` and `freeSolo` enable, and manage input value it self.
 * @remark The inputValue will be writen back to value onClose.
 */
function AutoComplete<Option = string>({
  name,
  label,
  options,
  required,
  className,
}: AutoCompleteProps<Option>): JSX.Element {
  const {
    field: { onBlur, onChange, value },
  } = useController({
    name,
    defaultValue: '',
    rules: { required },
  });

  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Autocomplete<Option, false, false, true>
      value={value}
      inputValue={inputValue}
      onChange={(_, value) => void onChange(value)}
      onInputChange={(_, value) => void setInputValue(value)}
      onBlur={() => {
        if (inputValue !== value) {
          onChange(inputValue);
        }
        onBlur();
      }}
      className={className}
      options={options}
      autoHighlight
      freeSolo
      renderInput={(params) => <TextField {...params} required={required} label={label} variant='outlined' />}
    />
  );
}

export { MajorAutoComplete } from './major';

export default AutoComplete;
