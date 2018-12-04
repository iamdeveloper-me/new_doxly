import React from 'react'
import ReactDOM from 'react-dom'

import SignatureGroups from 'components/SignatureGroups/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderSignatureGroupsPage = () => {
  ReactDOM.render(
    <Page>
      <SignatureGroups />
    </Page>,
    document.getElementById('signature-blocks')
  )
}
