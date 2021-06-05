import { ThemeProvider } from '@material-ui/styles';
import React from 'react';

import { Variant } from '../../config/types';
import { UniqueTheme } from '../../style';
import Times from './Times';

interface TimeRootProps {
  isMobile: boolean;
  toggleSnackbar: (content: string, variant: Variant) => void;
}

interface ContextProps {
  snackbar: (content: string, variant: Variant) => void;
}

export const ToggleSnackbar = React.createContext<ContextProps>({} as ContextProps);

export const NewTime = (props: TimeRootProps): React.ReactElement => {
  return (
    <ThemeProvider theme={UniqueTheme}>
      <ToggleSnackbar.Provider value={{ snackbar: props.toggleSnackbar }}>
        <Times isMobile={props.isMobile} />
      </ToggleSnackbar.Provider>
    </ThemeProvider >
  );
};
