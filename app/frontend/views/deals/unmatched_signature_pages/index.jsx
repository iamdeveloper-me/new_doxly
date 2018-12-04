import React from 'react'
import ReactDOM from 'react-dom'

import UnmatchedSignaturePages from 'components/UnmatchedSignaturePages/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderUnmatchedSignaturePagesSidebar = () => {
  ReactDOM.render(
    <Page>
      <UnmatchedSignaturePages />
    </Page>,
    document.getElementById('unmatched-root')
  )
}
