import { map, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, Dependencies, errHandler, USER } from '../index';
import { addImage, SEND_IMAGE, SendImage } from '../../action';
import { StoreState } from '../../reducer';

export const sendImageEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { sessionStorage, socket$ }) =>
    socket$.pipe(
        switchMap((socket: any) => {
            if (socket) {
                return action$.pipe(
                    ofType(SEND_IMAGE),
                    map((action: SendImage) => {
                        const { image } = action;
                        const name = state$.value.user.info.username;
                        const avatar = state$.value.user.info.avatar;
                        const time = +new Date();
                        return { image, name, avatar, time };
                    }),
                    tap(obj => {
                        const token = sessionStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, USER);
                        }
                        const { name, avatar, time, image } = obj;
                        socket.emit('sendMessage', name, avatar, time, image, true);
                    }),
                    map(obj => {
                        const { name, avatar, time, image } = obj;
                        return addImage(name, avatar, time, image, true);
                    })
                )
            }
            return EMPTY;
        })
    );

