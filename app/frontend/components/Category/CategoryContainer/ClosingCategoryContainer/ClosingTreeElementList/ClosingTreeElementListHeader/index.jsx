import { FormattedMessage } from 'react-intl'
import React from 'react'

import Colors from 'helpers/Colors'
import { ProductContext, can } from 'components/ProductContext/index.jsx'

export default class ClosingTreeElementListHeader extends React.PureComponent {

  render() {
    return (
      <ProductContext.Consumer>
        {features => {
          const collaboration = can(/R/, features.responsible_parties)
          return (
            <div style={styles.header}>
              <div style={collaboration ? styles.gridCollaboration : styles.gridClosing} className="flex-grid">
                <div style={styles.leftBox} className="flex-grid-left-box">
                  <div style={styles.togglePadding}></div>
                  <div>
                    <div style={styles.indentation}></div>
                    <div><FormattedMessage id="category.checklist.header.item" /></div>
                  </div>
                </div>
                {collaboration ? null : <div className="flex-grid-type"><FormattedMessage id="category.checklist.header.type" /></div>}
                <div className="flex-grid-doc"><FormattedMessage id="category.checklist.header.doc" /></div>
                {collaboration ? <div className="flex-grid-status"><FormattedMessage id="category.checklist.header.status" /></div> : null}
                {collaboration ? <div className="flex-grid-last-change"><FormattedMessage id="category.checklist.header.last_change" /></div> : null}
                {collaboration ? null : <div className="flex-grid-signature"><FormattedMessage id="category.checklist.header.signature" /></div>}
                <div className="flex-grid-details"><FormattedMessage id="category.checklist.header.details" /></div>
                {collaboration ? null : <div className="flex-grid-actions"></div>}
              </div>
            </div>
          )
        }}
      </ProductContext.Consumer>
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
  gridCollaboration: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '3fr 128px 128px 96px 1fr',
    borderBottom: `2px solid ${Colors.gray.normal}`,
    marginLeft: '10px'
  },
  gridClosing: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '3fr 48px 128px 64px 1fr 96px',
    borderBottom: `2px solid ${Colors.gray.normal}`,
    marginLeft: '10px'
  },
  leftBox: {
    display: 'flex'
  },
  togglePadding: {
    width: '128px',
    flexShrink: 0
  },
  indentation: {
    width: '30px',
    flexShrink: 0
  }
}
