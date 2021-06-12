import { i18n } from '@lingui/core';
import { Trans, t } from '@lingui/macro';
import React from 'react';

export default () => (
    <div>
        {t`test`}
        {i18n._('test')}
        <Trans>test</Trans>
        <Trans id='test'></Trans>
        {t`测试`}
        {i18n._('测试')}
        <Trans>测试</Trans>
        <Trans id='测试'></Trans>
        {t`\u0074\u0065\u0073\u0074`}
        {i18n._('\u0074\u0065\u0073\u0074')}
        <Trans>\u0074\u0065\u0073\u0074</Trans>
        <Trans id='\u0074\u0065\u0073\u0074'></Trans>
        <Trans>{'\u0074\u0065\u0073\u0074'}</Trans>
        <Trans id={'\u0074\u0065\u0073\u0074'}></Trans>
    </div>
);
