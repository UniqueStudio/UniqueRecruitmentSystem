import React from "react";
import { ThemeProvider } from "@material-ui/styles";

import { UniqueTheme } from "../../style";
import { Variant } from "../../config/types"
import Times from "./Times";

interface ITimeRootProps {
  isMobile: boolean;
  toggleSnackbar: (content: string, variant: Variant) => void;
}


interface IContextProps {
  snackbar: (content: string, variant: Variant) => void;
}

export const ToggleSnackbar = React.createContext<IContextProps>({} as IContextProps)

export const NewTime = (props: ITimeRootProps): React.ReactElement => {
  return (
    <ThemeProvider theme={UniqueTheme}>
      <ToggleSnackbar.Provider value={{ snackbar: props.toggleSnackbar }}>
        <Times isMobile={props.isMobile} />
      </ToggleSnackbar.Provider>
    </ThemeProvider >
  );
};
