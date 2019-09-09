import { ACMClient } from 'acm-client';
import { logger } from '../utils/logger';
import { Acm } from './consts';

interface QuestionURI {
    web: string;
    pm: string;
    game: string;
    android: string;
    ai: string;
    ios: string;
    lab: string;
    design: string;
}

export let Questions = {} as QuestionURI;

export const loadConfig = async () => {
    logger.info(JSON.stringify(Acm));
    const acm = new ACMClient({
        ...Acm,
        requestTimeout: 6000, // Request timeout, 6s by default
    });
    await acm.ready();
    acm.subscribe({
        dataId: Acm.dataId,
        group: Acm.group,
    }, (newConfig: QuestionURI) => {
        logger.info(JSON.stringify(newConfig));
        Questions = newConfig;
    });

    Questions = await acm.getConfig(Acm.dataId, Acm.group) as QuestionURI;
    logger.info(JSON.stringify(Questions));
};
