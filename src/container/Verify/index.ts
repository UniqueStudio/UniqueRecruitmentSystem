import { connect } from 'react-redux';
import Verify from '../../component/Verify';
import { Dispatch } from 'redux';
import { getVerifyCode } from '../../action/async';

interface OwnProps {
    onChange: (event: React.ChangeEvent) => void;
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => ({
    getVerifyCode: () => getVerifyCode()(dispatch)
});

export default connect(null, mapDispatchToProps)(Verify);