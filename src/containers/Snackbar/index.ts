import { connect } from 'react-redux';

import Snackbar from '../../components/Snackbar';

import { StoreState } from '../../reducers';

const mapStateToProps = ({ component: { fabOn } }: StoreState) => ({
    fabOn,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export type Props = StateProps;
export default connect<StateProps, {}, {}, StoreState>(mapStateToProps)(Snackbar);
