import { ACMClient } from 'acm-client';

import { Acm } from '@config/consts';
import { logger } from '@utils/logger';

logger.info(JSON.stringify(Acm));

export const loadConfig = async () => {
    logger.info(JSON.stringify(Acm));
    const acm = new ACMClient({
        ...Acm,
        requestTimeout: 6000, // Request timeout, 6s by default
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await acm.ready();
    acm.subscribe({
        dataId: Acm.dataId,
        group: Acm.group,
    }, (newConfig: string) => {
        logger.info(newConfig);
        global.acmConfig = JSON.parse(newConfig);
    });

    global.acmConfig = JSON.parse(await acm.getConfig(Acm.dataId, Acm.group));
};
