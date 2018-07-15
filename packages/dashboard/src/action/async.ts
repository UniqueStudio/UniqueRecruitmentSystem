import { Dispatch } from 'redux';
import { setCandidates, setGroup, toggleLoading } from './index';

export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
    dispatch(toggleLoading());
    dispatch(setGroup(group));
    return fetch(`http://localhost:5000/candidates/${group}`)
        .then(res => res.json())
        .then(res => {
            dispatch(setCandidates(res));
        })
};