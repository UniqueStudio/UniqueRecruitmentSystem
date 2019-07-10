import React from "react";
import { Typography, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            textAlign: "center",
            marginTop: theme.spacing(1),
        },
        timeTitle: {
            userSelect: "none",
            whiteSpace: "nowrap",
            fontSize: "3.3rem",
            marginTop: theme.spacing(2),
        },
        subTitle: {
            fontSize: "2.5rem",
            fontWeight: "bold",
            paddingBottom: theme.spacing(1)
        },
        description: {
            fontSize: "1.4rem",
            fontWeight: "bold",
            color: theme.palette.primary.light
        },
        emphasize: {
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: "1.5rem",
        }
    })
)

export default (): React.ReactElement => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Typography
                variant={"h2"}
                className={classes.subTitle}
                color={"primary"}
            >
                {"面试时间选择"}
            </Typography>
            <Typography
                variant={"h3"}
                color={"primary"}
                className={classes.description}
            >
                {"请选择以下你有空的"}
                <Typography
                    variant={"h3"}
                    color={"secondary"}
                    display={"inline"}
                    className={classes.emphasize}
                >
                    {"全部"}
                </Typography>
                {"时间段，一旦确定无法更改。"}
            </Typography>
        </div>
    )
}