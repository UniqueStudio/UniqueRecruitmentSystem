import React, { FC, useContext } from "react";
import { IconButton } from "@material-ui/core";
import { Brightness4 } from "@material-ui/icons";
import { ThemeContext } from "../../styles/withRoot";

// writing this as a stand alone componment since AppBar is using
// memo and it won't rerender when props not changing, which will
// lead theme unchanged.
export const DarkModeSwitcher: FC = () => {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    return (
        <IconButton color='inherit' onClick={() => setDarkMode(!darkMode)}>
            <Brightness4 />
        </IconButton>
    );
}
