import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Verify from '../../component/Verify';

import { getVerifyCode, GetVerifyCode } from '../../action';

interface OwnProps {
    onChange: (event: React.ChangeEvent) => void;
}

type DispatchType = Dispatch<GetVerifyCode>;

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnProps) => ({
    getVerifyCode: () => dispatch(getVerifyCode()),
    ...ownProps,
});

export default connect(null, mapDispatchToProps)(Verify);
