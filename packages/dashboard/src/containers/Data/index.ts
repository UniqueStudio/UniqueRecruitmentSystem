import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
    allocateAllStart,
    AllocateAllStart,
    allocateOneStart,
    AllocateOneStart,
    getRecruitmentsStart,
    GetRecruitmentsStart,
    setRecruitment,
    SetRecruitment,
} from '../../actions';
import { StoreState } from '../../reducers';

import Data from '../../views/Data';

const mapStateToProps =
    ({ recruitment: { recruitments, viewing }, user: { info: { group: userGroup, isAdmin, isCaptain } }, candidate: { candidates } }: StoreState) => ({
        recruitment: recruitments.find((recruitment) => recruitment.title === viewing),
        canLaunch: isCaptain || isAdmin,
        userGroup,
        candidates
    });

type DispatchType = Dispatch<GetRecruitmentsStart | SetRecruitment | AllocateOneStart | AllocateAllStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => dispatch(getRecruitmentsStart()),
    setRecruitment: (data: SetRecruitment['data']) => dispatch(setRecruitment(data)),
    allocateOne: (cid: string, time: number, type: 'group' | 'team') => dispatch(allocateOneStart(cid, time, type)),
    allocateAll: (type: 'group' | 'team') => dispatch(allocateAllStart(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Data);
