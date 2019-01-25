import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getVerifyCode, GetVerifyCode } from 'Actions';

import Verify from 'Components/Verify';

interface OwnProps {
    onChange: (event: React.ChangeEvent) => void;
}

type DispatchType = Dispatch<GetVerifyCode>;

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnProps) => ({
    getVerifyCode: () => dispatch(getVerifyCode()),
    ...ownProps,
});

export default connect(null, mapDispatchToProps)(Verify);
