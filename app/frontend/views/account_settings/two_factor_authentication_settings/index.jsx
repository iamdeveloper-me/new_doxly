import React from 'react'
import ReactDOM from 'react-dom'

import Page from 'views/Page.jsx'
import TwoFactorAuthenticationContainer from './TwoFactorAuthenticationContainer/index.jsx'

App.React.AccountSettings.renderTwoFactorAuthenticationSettings = required => {
  ReactDOM.render(
    <Page>
      <TwoFactorAuthenticationContainer
        forcedSetUp={required || false}
      />
    </Page>,
    document.getElementById('root')
  )
}
