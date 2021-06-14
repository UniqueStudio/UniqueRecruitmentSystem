import { Status } from '@constants/enums';
import { BaseGateway } from '@gateways/base.gateway';

export class RecruitmentsGateway extends BaseGateway {
    broadcastUpdate(rid: string) {
        this.server.sockets.emit('updateRecruitment', {
            status: Status.info,
            payload: rid,
        });
    }
}
