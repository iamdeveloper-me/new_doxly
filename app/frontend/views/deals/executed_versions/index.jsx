import React from 'react'
import ReactDOM from 'react-dom'

import ExecutedVersions from 'components/ExecutedVersions/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderExecutedVersionsModal = () => {
  ReactDOM.render(
    <Page>
      <ExecutedVersions />
    </Page>,
    document.getElementById('root')
  )
}
