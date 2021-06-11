import { i18n, Messages } from '@lingui/core';
import { detect, fromUrl, fromStorage, fromNavigator, fromHtmlTag, fromCookie } from '@lingui/detect-locale';

const DEFAULT_FALLBACK = () => 'zh';

export const defaultLocale = () =>
    detect(
        fromHtmlTag('lang'),
        fromCookie('NEXT_LOCALE'),
        fromUrl('lang'),
        fromStorage('lang'),
        fromNavigator(),
        DEFAULT_FALLBACK,
    ) || DEFAULT_FALLBACK();

export async function dynamicActivate(locale: string) {
    const { messages } = (await import(`@lingui/loader!./${locale}/messages.po`)) as { messages: Messages };
    i18n.load(locale, messages);
    i18n.activate(locale);
}
