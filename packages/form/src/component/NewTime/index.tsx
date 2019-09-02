import React from "react";
import { ThemeProvider } from "@material-ui/styles";

import { UniqueTheme } from "../../style";
import Times from "./Times";

interface ITimeRootProps {
  isMobile: boolean;
  toggleSnackbar: (content: string) => void;
}

export const NewTime = (props: ITimeRootProps): React.ReactElement => {
  return (
    <ThemeProvider theme={UniqueTheme}>
      <Times isMobile={props.isMobile} />
    </ThemeProvider>
  );
};
