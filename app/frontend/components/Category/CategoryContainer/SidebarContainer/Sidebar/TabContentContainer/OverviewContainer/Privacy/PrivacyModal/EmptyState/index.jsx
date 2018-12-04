import { FormattedMessage } from 'react-intl'
import React from 'react'

import Colors from 'helpers/Colors'

const EmptyState = () => {
  return (
    <div style={styles.container}>
      <div style={styles.text}>
        <div style={styles.title}><FormattedMessage id='category.sidebar.privacy.privacy_modal.empty_state.no_restrictions_set' /></div>
        <div style={styles.details}><FormattedMessage id='category.sidebar.privacy.privacy_modal.empty_state.details' /></div>
        <div style={styles.instructions}><FormattedMessage id='category.sidebar.privacy.privacy_modal.empty_state.instructions' /></div>
      </div>
      <div style={styles.arrowContainer}><div style={styles.arrow}></div></div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  text: {
    maxWidth: '300px',
    fontSize: '13px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: Colors.button.blue
  },
  instructions: {
    marginTop: '16px'
  },
  arrowContainer: {
    position: 'relative',
    height: '160px',
    width: '70px',
    margin: '16px 44px 16px 8px',
    borderBottom: `4px solid ${Colors.button.blue}`,
    borderRight: `4px solid ${Colors.button.blue}`
  },
  arrow: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: `16px solid ${Colors.button.blue}`
  }
}

export default EmptyState
