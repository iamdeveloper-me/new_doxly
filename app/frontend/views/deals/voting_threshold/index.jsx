import React from 'react'
import ReactDOM from 'react-dom'

import VotingThreshold from 'components/VotingThreshold/index.jsx'
import Page from 'views/Page.jsx'

App.React.renderVotingThresholdPage = () => {
  ReactDOM.render(
    <Page>
      <VotingThreshold />
    </Page>,
    document.getElementById('root')
  )
}
