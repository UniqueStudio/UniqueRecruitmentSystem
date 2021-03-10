import React, { ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

type AutoCompleteChange = ChangeEvent<Record<string, unknown>>;
export interface AutoCompleteProps<Option = string> {
  className?: string;
  label: string;
  options: Option[];
  value?: string;
  onChange?: (e: AutoCompleteChange, value: string | Option | null) => void;
  required?: boolean;
}

/**
 * An MUI Autocomplete wrapper component.
 * With `autoHighlight` and `freeSolo` enable, and manage input value it self.
 * @remark The inputValue will be writen back to value onClose.
 */
function AutoComplete<Option = string>({
  label,
  options,
  value,
  onChange,
  required,
  className,
}: AutoCompleteProps<Option>): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete<Option, false, false, true>
      className={className}
      options={options}
      autoHighlight
      freeSolo
      value={value}
      inputValue={inputValue}
      onChange={(event, value, reason) => {
        if (reason === 'select-option') {
          setInputValue((value ?? '') as string);
        }

        onChange && onChange(event, value);
      }}
      onInputChange={(_, v) => void setInputValue(v)}
      renderInput={(params) => <TextField {...params} required={required} label={label} variant='outlined' />}
    />
  );
}

AutoComplete.defaultProps = {
  value: '',
  required: true,
};

export default AutoComplete;
