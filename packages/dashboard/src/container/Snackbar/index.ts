import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { toggleSnackbarOff, ToggleSnackbarOff } from '../../action';
import Snackbar from '../../component/Snackbar';

interface OwnProps {
    place: string;
}

const mapStateToProps = ({ components }: StoreState, ownProps: OwnProps) => ({
    on: components.snackbar.on,
    info: components.snackbar.info,
    color: components.snackbar.color,
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleSnackbarOff>) => ({
    toggleOff: () => dispatch(toggleSnackbarOff())
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);