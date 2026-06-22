import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  const localeFromRequest = await requestLocale;
  const cookieStore = await cookies();
  const locale = localeFromRequest || cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});