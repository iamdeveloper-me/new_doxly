import React from 'react'
import ReactDOM from 'react-dom'

import Category from 'components/Category/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderCategoryPage = () => {
  ReactDOM.render(
    <Page>
      <Category />
    </Page>,
    document.getElementById('root')
  )
}
