import { FormattedMessage } from 'react-intl'
import React from 'react'

import Colors from 'helpers/Colors'

export default class DataRoomTreeElementListHeader extends React.PureComponent {

  render() {
    return (
      <div style={styles.header}>
        <div style={styles.grid} className="flex-grid">
          <div style={styles.leftBox} className="flex-grid-left-box">
            <div style={styles.togglePadding}></div>
            <div>
              <div style={styles.indentation}></div>
              <div><FormattedMessage id="category.checklist.header.folder_or_document" /></div>
            </div>
          </div>
          <div className="flex-grid-doc"><FormattedMessage id="category.checklist.header.doc" /></div>
          <div className="flex-grid-review-status"><FormattedMessage id="category.checklist.header.review_status" /></div>
        </div>
      </div>
    )
  }
}


const styles = {
  header: {
    width: '100%',
    backgroundColor: Colors.gray.lightest,
    display: 'flex',
    color: Colors.gray.darker,
    fontSize: '12px',
    minHeight: '20px'
  },
  grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '48% 14% 40%',
    borderBottom: `2px solid ${Colors.gray.normal}`
  },
  leftBox: {
    display: 'flex'
  },
  togglePadding: {
    width: '40px',
    flexShrink: 0
  },
  indentation: {
    width: '30px',
    flexShrink: 0
  }
}
