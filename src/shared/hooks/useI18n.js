import { useCallback, useState } from 'react';

const useI18n = () => {
  // TODO: needs to add an AppContext to access locale
  const [locale] = useState('en');

  /** change locale */
  const changeLocale = useCallback(() => {
    console.log("change locale: ", locale);
  }, [locale]);

  /** load a translated message and return it */
  const getMessages = useCallback(async (locale) => {
    try {
      return await import(`../../translations/${locale}.json`);
    } catch (e) {
      console.log(e.meesage);
    }
  }, []);

  return { changeLocale, getMessages };
};

export default useI18n;
