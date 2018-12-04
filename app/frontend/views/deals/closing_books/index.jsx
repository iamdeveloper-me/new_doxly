import React from 'react'
import ReactDOM from 'react-dom'

import ClosingBooks from 'components/ClosingBooks/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderClosingBooksPage = () => {
  ReactDOM.render(
    <Page>
      <ClosingBooks />
    </Page>,
    document.getElementById('root')
  )
}
