import React from 'react'

// i18n
import { IntlProvider } from 'react-intl'
import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import localeData from 'i18n/localeData'

export default class Page extends React.PureComponent {

  render() {

    /* LOCALIZATION */
    addLocaleData([...en])

    // Define user's language. Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these different by checking all of them
    let language = (navigator.languages && navigator.languages[0]) ||
                         navigator.language ||
                         navigator.userLanguage

    // Split locales with a region code
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

    // Try full locale, try locale without region code, fallback to 'en'
    let messages = localeData[languageWithoutRegionCode] || localeData[language]
    if (!messages) {
      messages = localeData.en
      language = 'en'
    }

    return (
      <IntlProvider locale={language} messages={messages}>
        {this.props.children}
      </IntlProvider>
    )
  }

}

window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (typeof Rollbar !== 'undefined') {
    Rollbar.error("Window Error", `${msg.toString()} : ${error.toString()}`)
  }
  const showConsoleErrors = $('body').attr('env-development') === "true"
  return showConsoleErrors
}
