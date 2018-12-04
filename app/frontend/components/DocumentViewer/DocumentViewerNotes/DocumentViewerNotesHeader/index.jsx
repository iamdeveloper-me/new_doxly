import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import TabBar from 'components/TabBar/index.jsx'

export default class DocumentViewerNotesHeader extends React.PureComponent {

  render() {
    const { publicNotes, selectedTab, teamNotes } = this.props
    const { setSelectedTab } = this.props

    return (
      <div style={styles.header}>
        <TabBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={[
            {
              key: 'team_notes',
              text: <FormattedMessage id="category.sidebar.tabs.team_notes" />,
              badge: teamNotes.length > 0 ? teamNotes.length : null
            },
            {
              key: 'public_notes',
              text: <FormattedMessage id="category.sidebar.tabs.public_notes" />,
              badge: publicNotes.length > 0 ? publicNotes.length : null
            },
          ]}
        />
      </div>
    )
  }
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '12px 12px 0 8px',
    color: Colors.gray.darkest,
    backgroundColor: Colors.background.blue,
    fontSize: '12px',
    borderBottom: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `0px 5px 10px 0px ${Colors.gray.lighter}`,
    position: 'relative',
    minHeight: '48px'
  }
}

DocumentViewerNotesHeader.propTypes = {
  // attributes
  publicNotes: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  teamNotes: PropTypes.array.isRequired,

  // functions
  setSelectedTab: PropTypes.func.isRequired
}