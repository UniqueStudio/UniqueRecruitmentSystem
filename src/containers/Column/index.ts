import { connect } from 'react-redux';

import { StoreState } from '../../reducers';

import Column from '../../components/Column';

import { Candidate, Step } from '../../config/types';

interface OwnProps {
    step: Step;
    candidates: Candidate[];
    dropIndex: number;
    isTeamInterview: boolean;
    toggleDetail: (index: number) => () => void;
}

const mapStateToProps = ({ candidate: { selected } }: StoreState, ownProps: OwnProps) => ({
    selected,
    ...ownProps
});

export default connect(mapStateToProps)(Column);
