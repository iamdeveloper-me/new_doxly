import React from 'react'
import ReactDOM from 'react-dom'

import SendSignaturePacketWizard from 'components/SendSignaturePacketWizard/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderSendSignaturePacketModal = (userId) => {
  ReactDOM.render(
    <Page>
      <SendSignaturePacketWizard userId={userId} />
    </Page>,
    document.getElementById('root')
  )
}
