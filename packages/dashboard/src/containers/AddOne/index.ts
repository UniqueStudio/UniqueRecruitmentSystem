import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar, launchRecruitment } from '../../actions';

import AddOne from '../../components/AddOne';

import { StoreState } from '../../reducers';

interface OwnProps {
    shouldClear: boolean;
}

const mapStateToProps = (
    {
        user: {
            info: { isAdmin, isCaptain },
        },
    }: StoreState,
    ownProps: OwnProps,
) => ({
    disabled: !(isCaptain || isAdmin),
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            enqueueSnackbar,
            launchRecruitment,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(AddOne);
