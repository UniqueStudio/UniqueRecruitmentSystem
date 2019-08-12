import React, { useReducer, useContext } from "react";
import { MokeDates } from "./old";
import { List, ListItem, Chip, Grid, makeStyles, Theme, createStyles, } from "@material-ui/core";
import Header from "./Header";

import { SelectDate } from "./old";
import { reducer, ClickedArray, initialState } from "./reducer";

interface IStyleProps {
    color?: "white" | undefined
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%"
        },
        chipWrapper: {
            textAlign: "center",
            fontWeight: "bold",
            marginTop: theme.spacing(1)
        },
        dateChip: {
            color: "white",
            width: "40%"
        },
        chip: (props: IStyleProps) => ({
            color: props.color,
            width: "80%"
        })
    })
)

interface ITimesProps {
    isMobile: boolean
}

type Dispatch = React.Dispatch<number>
interface IContextProps {
    dispatch: Dispatch
    clicked: ClickedArray
}

const TimeDispatch = React.createContext<IContextProps>({} as IContextProps)
export default (props: ITimesProps): React.ReactElement => {
    // const formID = window.location.pathname
    // const [dates, getDates] = useResource((formID: string) => {
    //     url: `/form/${formID}`
    //     method: "GET"
    // })
    // // fetching data
    // useEffect(() => getDates(formID), [])
    const dates = MokeDates
    // //TODO: use custom loading component
    // if (dates.isLoading) return (<div>Loading</div>)
    const [state, dispatch] = useReducer(reducer, initialState)
    const classes = useStyles({ color: "white" })
    return (
        <TimeDispatch.Provider value={{
            dispatch: dispatch,
            clicked: state.clicked
        }}>
            <List
                className={classes.root}
                subheader={<Header />}>
                {dates.map((item, line) => (
                    <OneDay
                        date={item}
                        line={line}
                        isMobile={props.isMobile}
                        clicked={state.clicked}
                    />
                ))}
            </List>
        </TimeDispatch.Provider>
    )
}

interface IOneDayProps {
    line: number
    date: SelectDate
    isMobile: boolean
    clicked: ClickedArray
}
const getDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const OneDay = (props: IOneDayProps): React.ReactElement => {
    const classes = useStyles({ color: "white" })
    return (
        <ListItem>
            <Grid container direction={"row"} >
                <Grid
                    item
                    xs={props.isMobile ? 12 : 4}
                    className={classes.chipWrapper}>
                    <Chip
                        color={"primary"}
                        label={getDate(props.date.date)}
                        className={classes.dateChip}
                        clickable={false}
                    />
                </Grid>
                {['上午', '下午', '晚上'].map((time, column) =>
                    <Grid
                        item
                        xs={props.isMobile ? 4 : 2}
                        className={classes.chipWrapper}
                    >
                        <TimeChip
                            label={time}
                            disabled={!props.date[['morning', 'afternoon', 'evening'][column]]}
                            index={props.line * 3 + column}
                        />
                    </Grid>
                )}
            </Grid>
        </ListItem>
    )
}

interface IChipProps {
    label: string
    disabled?: boolean
    index: number
}

const TimeChip = (props: IChipProps): React.ReactElement => {
    const { dispatch, clicked } = useContext(TimeDispatch)
    const handleClick = () => {
        dispatch(props.index)
    }
    if (props.disabled) {
        const classes = useStyles({ color: "white" })
        return (
            <Chip
                color={"default"}
                variant={"default"}
                label={props.label}
                clickable={false}
                className={classes.chip}
            />
        )
    } else {
        const classes = useStyles({})
        return (
            <Chip
                color={"primary"}
                variant={clicked[props.index] ? "default" : "outlined"}
                label={props.label}
                clickable={true}
                className={classes.chip}
                onClick={handleClick}
            />
        )
    }
}
