import { connect } from 'react-redux';

import { StoreState } from '../../reducers';

import Data from '../../views/Data';

const mapStateToProps =
    ({ recruitment: { recruitments, viewing }, user: { info: { group: userGroup } }, candidate: { candidates } }: StoreState) => ({
        recruitment: recruitments.find(({ title }) => title === viewing),
        userGroup,
        candidates,
    });

type StateProps = ReturnType<typeof mapStateToProps>;

export type Props = StateProps;
export default connect<StateProps, {}, {}, StoreState>(mapStateToProps)(Data);
