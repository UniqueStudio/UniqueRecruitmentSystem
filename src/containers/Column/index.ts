import { connect } from 'react-redux';

import { StoreState } from 'Reducers';

import Column from 'Components/Column';

import { Candidate, Step } from 'Config/types';

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
