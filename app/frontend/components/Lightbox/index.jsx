import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class Lightbox extends React.PureComponent {

  render() {
    const { children, header, transparentBody } = this.props
    const headerHtml = (
      header ?
        <div style={styles.header}>
          {header}
        </div>
      :
        null
    )
    return (
      <div style={styles.overlay(transparentBody)}>
        <div style={styles.container}>
          {headerHtml}
          <div style={styles.body(transparentBody)}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  overlay: transparent => ({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: transparent ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.8)',
    zIndex: '1002'
  }),
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    flexShrink: 0,
    zIndex: 1,
    background: Colors.white,
    boxShadow: '0 4px 4px -2px rgba(0,0,0,0.3)',
    color: Colors.gray.darkest
  },
  body: transparent => ({
    display: 'flex',
    flexGrow: '1',
    height: '100%',
    background: transparent ? 'transparent' : Colors.gray.lightest,
    overflow: 'hidden'
  })
}

Lightbox.propTypes = {
  header: PropTypes.element,
  transparentBody: PropTypes.bool
}
