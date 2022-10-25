import React, { useState } from "react";
import { IntlProvider } from "react-intl";
// import { useAppReducer } from "../../contexts/AppContext";
// import useI18n from "../../hooks/useI18n";

const IntlWrapper = ({ children }) => {
  const [messages, setMessages] = useState({});
  // const [{ locale }] = useAppReducer();
  const [locale, setLocale] = useState('en');
  // const { getMessages } = useI18n();

  // useEffect(() => {
  //   getMessages(locale).then((data) => setMessages(data));
  // }, [getMessages, locale]);

  // if (!messages) return null;

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default IntlWrapper;