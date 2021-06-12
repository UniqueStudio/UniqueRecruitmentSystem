import { i18n, Messages } from '@lingui/core';
import { detect, fromUrl, fromStorage, fromNavigator, fromHtmlTag } from '@lingui/detect-locale';

const DEFAULT_FALLBACK = () => 'zh';

export const defaultLocale = () =>
    !import.meta.env.SSR && detect(
        fromHtmlTag('lang'),
        fromUrl('lang'),
        fromStorage('lang'),
        fromNavigator(),
        DEFAULT_FALLBACK,
    ) || DEFAULT_FALLBACK();

export async function dynamicActivate(locale: string) {
    let messages: Messages;

    if (locale.startsWith('zh')) {
        locale = 'zh';
    }
    switch (locale) {
        case 'zh':
            ({ messages } = await import('@locales/zh/messages'));
            break;
        default:
            ({ messages } = await import('@locales/en/messages'));
            break;
    }

    i18n.load(locale, messages);
    i18n.activate(locale);
}
