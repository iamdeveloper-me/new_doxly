import { FormattedMessage } from 'react-intl'
import React from 'react'

const SignatureGroupsEmptyState = () => (
  <div className='whiteout-ui' style={styles.container}>
    <i style={styles.icon} className="mdi mdi-account-multiple-plus"></i>
    <h1 style={styles.title}><FormattedMessage id="signature_management.signature_groups.empty_state" /></h1>
  </div>
)

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginTop: '3rem'
  },
  icon: {
    fontSize: '10rem'
  },
  title: {
    fontSize: '2.4rem',
    width: '60%',
    textAlign: 'center'
  }
}

export default SignatureGroupsEmptyState
