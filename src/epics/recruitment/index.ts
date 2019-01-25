import { getRecruitmentsEpic } from './getRecruitments';
import { launchRecruitmentsEpic } from './launchRecruitment';
import { setRecruitmentEpic } from './setRecruitment';
import { setViewingEpic } from './setViewing';

export default [getRecruitmentsEpic, launchRecruitmentsEpic, setRecruitmentEpic, setViewingEpic];
