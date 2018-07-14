import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import withRoot from "../style/withRoot";
import styles from "../style/index";
import Chart from '../component/Chart/Chart';
import ChartContainer from '../component/Chart/ChartContainer';
import ChartNew from '../component/Chart/ChartNew'

class Data extends React.Component<WithStyles> {
    render() {
        return (
            <>
                {['2018秋招', '2019春招', '2019秋招', '2020春招', '2020秋招'].map(i =>
                    <ChartContainer key={i}>
                        <Chart time={i} />
                    </ChartContainer>
                )}
                <ChartNew />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Data));
