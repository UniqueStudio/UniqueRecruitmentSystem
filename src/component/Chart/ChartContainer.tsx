import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chart from './Chart';
import Modal from '../Modal';
import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import { GROUP, Recruitment, Time } from '../../lib/const';
import titleConverter from '../../lib/titleConverter';
import DateSelect from './DateSelect';
import timeStampToString from '../../lib/timeStampToString';

interface Props extends WithStyles {
    data: Recruitment;
    userGroup: string;
    canLaunch: boolean;
    submit: (begin: number, end: number, time1: { [group: string]: Time[] }, time2: Time[]) => void;
    toggleSnackbarOn: (info: string, color?: string) => void;
}

class ChartContainer extends PureComponent<Props> {

    defaultDate = {
        date: timeStampToString(Date.now()),
        morning: false,
        afternoon: false,
        evening: false
    };

    state = {
        modalOpen: '',
        begin: timeStampToString(this.props.data.begin),
        end: timeStampToString(this.props.data.end),
        time1: this.props.data.time1,
        time2: this.props.data.time2
    };

    setStateTime = (date: Time[], group?: string) => {
        this.setState(group ? {
            time1: {
                ...this.state.time1,
                [group]: date
            }
        } : {
            time2: date
        })
    };

    setDate = (id: number, group?: string) => (event: React.ChangeEvent) => {
        const copiedDate = [...group ? this.state.time1[group] : this.state.time2];
        copiedDate[id]['date'] = event.target['value'];
        this.setStateTime(copiedDate, group);
    };

    addDate = (group?: string) => () => {
        const date = [...(group ? this.state.time1[group] : this.state.time2) || [], { ...this.defaultDate }];
        this.setStateTime(date, group);
    };

    deleteDate = (id: number, group?: string) => () => {
        const copiedDate = [...group ? this.state.time1[group] : this.state.time2];
        copiedDate.splice(id, 1);
        this.setStateTime(copiedDate, group);
    };

    setTime = (id: number, group?: string) => (event: React.ChangeEvent) => {
        const time = event.target['value'];
        const copiedDate = [...group ? this.state.time1[group] : this.state.time2];
        copiedDate[id][time] = !copiedDate[id][time];
        this.setStateTime(copiedDate, group);
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value']
        })
    };

    toggleModalOpen = (title?: string) => () => {
        this.setState({
            modalOpen: title || ''
        })
    };

    handleConfirm = () => {
        const { begin, end, time1, time2 } = this.state;
        const { submit, toggleSnackbarOn } = this.props;
        if (!begin) {
            toggleSnackbarOn('请填写开始时间！');
            return;
        }
        if (!end) {
            toggleSnackbarOn('请填写结束时间！');
            return;
        }
        if (time1) {
            for (const i of Object.values(time1)) {
                if (i) {
                    for (const j of i) {
                        if (!(j.afternoon || j.morning || j.evening) || !j.date) {
                            toggleSnackbarOn('请选择正确的时间段！');
                            return;
                        }
                    }
                }
            }
        }
        if (time2) {
            for (const j of time2) {
                if (!(j.afternoon || j.morning || j.evening) || !j.date) {
                    toggleSnackbarOn('请选择正确的时间段！');
                    return;
                }
            }
        }
        submit(+new Date(begin) + (new Date()).getTimezoneOffset() * 60000,
            +new Date(end) + (new Date()).getTimezoneOffset() * 60000,
            time1,
            time2);
    };

    render() {
        const { data, classes, userGroup, canLaunch } = this.props;
        const { end, begin, time1, time2, modalOpen } = this.state;
        const chartData = data.data;
        const totalData = chartData.map(i => i.total || 0);
        const stepData = [{}, ...chartData].reduce((i, j) => ({ ...i, [j['group']]: j['steps'] }));
        const title = titleConverter(data.title);
        return (
            <div className={classes.chartContainer}>
                <Button onClick={this.toggleModalOpen(title)}>{title}</Button>
                <Chart
                    data={chartData}
                    totalData={totalData}
                    stepData={stepData}
                    title={`${title}各组报名人数`}
                    end={data.end}
                />
                <Modal open={modalOpen === title} onClose={this.toggleModalOpen()} title='招新详情'>
                    <div className={classes.detail}>
                        <div className={classes.commonTime}>
                            <TextField
                                label="开始时间"
                                type="date"
                                value={begin}
                                onChange={this.handleChange('begin')}
                                disabled={!canLaunch}
                            />
                            <TextField
                                label="结束时间"
                                type="date"
                                value={end}
                                onChange={this.handleChange('end')}
                                disabled={!canLaunch}
                            />
                        </div>
                        <ExpansionPanel className={classes.expansion}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>组面时间</ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    {GROUP.map((i, j) => {
                                        const group = i.toLowerCase();
                                        return <div key={j}>
                                            <Typography variant='caption' color='textSecondary'>{i}</Typography>
                                            {time1 && time1[group] ? time1[group].map((k, l) =>
                                                <DateSelect
                                                    key={l}
                                                    dateInfo={k}
                                                    setDate={this.setDate(l, group)}
                                                    setTime={this.setTime(l, group)}
                                                    addDate={this.addDate(group)}
                                                    deleteDate={this.deleteDate(l, group)}
                                                    isLast={l === time1[group].length - 1}
                                                    disabled={userGroup !== group}
                                                />) : userGroup === group
                                                ? <Button
                                                    onClick={this.addDate(group)}
                                                    variant='contained'
                                                    color='primary'
                                                >设置</Button>
                                                : '未设置'}
                                        </div>
                                    })}
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel className={classes.expansion}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>群面时间</ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    {time2 ? time2.map((k, l) =>
                                        <DateSelect
                                            key={l}
                                            dateInfo={k}
                                            setDate={this.setDate(l)}
                                            setTime={this.setTime(l)}
                                            addDate={this.addDate()}
                                            deleteDate={this.deleteDate(l)}
                                            isLast={l === time2.length - 1}
                                            disabled={!canLaunch}
                                        />) : canLaunch
                                        ? <Button
                                            onClick={this.addDate()}
                                            variant='contained'
                                            color='primary'
                                        >设置</Button>
                                        : '未设置'}
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <Button variant='contained' color='primary' onClick={this.handleConfirm}
                                disabled={!canLaunch}>确定</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(ChartContainer));
