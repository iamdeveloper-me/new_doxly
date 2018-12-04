import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import TabBar from 'components/TabBar/index.jsx'

export default class WhiteoutTabLayout extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: props.tabs[0].key
    }
    this.setSelectedTab = this.setSelectedTab.bind(this)
  }

  setSelectedTab(value) {
    this.setState({ selectedTab: value})
  }

  render() {
    const { tabs } = this.props
    const { selectedTab } = this.state
    const selectedTabObject = _.find(tabs, { 'key': selectedTab })

    return (
      <div style={styles.container}>
        <div style={styles.tabs}>
          <TabBar
            selectedTab={selectedTab}
            setSelectedTab={this.setSelectedTab}
            tabs={tabs}
          />
        </div>
        <div style={styles.body}>
          {selectedTabObject.content}
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  tabs: {
    flexShrink: 0,
    textAlign: 'left',
    fontWeight: '500'
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    overflow: 'hidden',
    borderTop: `1px solid ${Colors.gray.lighter}`
  }
}

WhiteoutTabLayout.propTypes = {
  tabs: PropTypes.array.isRequired
}
