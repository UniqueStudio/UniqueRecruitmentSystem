import React from "react";
import { ThemeProvider } from "@material-ui/styles";

import { UniqueTheme } from "../../style";
import Header from "./Header";

interface ITimeProps {

}

export const NewTime = (props: ITimeProps): React.ReactElement => {
    return (
        <>
            <ThemeProvider theme={UniqueTheme}>
                <Header />
            </ThemeProvider>
        </>
    )
}