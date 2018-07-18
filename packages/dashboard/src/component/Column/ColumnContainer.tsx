import * as React from "react";
// import IconButton from '@material-ui/core/IconButton';
import { WithStyles, withStyles } from '@material-ui/core/styles';
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
//
// import Detail from '../Candidate/CandidateDetail';
// import Comments from '../../container/Candidate/CandidateComments';
// import Modal from '../Modal';
import withRoot from "../../style/withRoot";
import styles from "../../style";
import Column from "../../container/Column/Column";

import { STEP } from '../../lib/const';

interface Props extends WithStyles {
    candidates: object;
    pathname: string;
    modalItem: {
        modalOn: boolean;
        title: string;
        step: number;
        cid: string;
        comments: object[];
        direction: string;
    }
    changeGroup: (group: string) => void;
    closeModal: () => void;
}

class Container extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        props.changeGroup('web');
    }

    render() {
        const { classes, pathname, candidates/*, modalItem, closeModal*/ } = this.props;
        //const { modalOn, direction, title, step, cid, comments } = modalItem;
        const steps = pathname === '/view' ? STEP : STEP.slice(4);
        return (
            <>
                <div className={classes.columnContainer}>
                    {steps.map(i => <Column title={i} key={i} candidates={candidates[STEP.indexOf(i)] || {}} />)}
                    {/*this div with a full-width-space is used to show right margin of the last element*/}
                    <div style={{ visibility: 'hidden' }}>{'　'}</div>
                </div>
                {/*<Modal open={modalOn}*/}
                {/*onClose={closeModal}*/}
                {/*direction={direction}*/}
                {/*title={title}*/}
                {/*>*/}
                {/*<div className={classes.modalContent}>*/}
                {/*<IconButton className={classes.leftButton} onClick={() => {*/}
                {/*this.props.onPrev();*/}
                {/*}}>*/}
                {/*<ExpandMoreIcon />*/}
                {/*</IconButton>*/}
                {/*<div className={classes.modalMain}>*/}
                {/*<Detail name={name} />*/}
                {/*<Comments step={step} cid={cid} comments={comments} />*/}
                {/*</div>*/}
                {/*<IconButton className={classes.rightButton} onClick={() => {*/}
                {/*this.props.onNext();*/}
                {/*}}>*/}
                {/*<ExpandMoreIcon />*/}
                {/*</IconButton>*/}
                {/*</div>*/}
                {/*</Modal>*/}
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Container));
