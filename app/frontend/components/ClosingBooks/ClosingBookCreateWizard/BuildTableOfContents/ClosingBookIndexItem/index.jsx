import PropTypes from 'prop-types'
import React from 'react'

export default class ClosingBookIndexItem extends React.PureComponent {

  render() {
    const { actions, dragHandle, name, position, style, tabNumber } = this.props

    const containerStyle = _.assign({}, styles.container, style)

    return (
      <div style={containerStyle}>
        <div style={styles.dragHandle}>{dragHandle}</div>
        <div style={styles.position}>{position}</div>
        <div style={styles.name}>{name}</div>
        <div style={styles.tabNumber}>{tabNumber}</div>
        <div style={styles.actions}>{actions}</div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.4em 0'
  },
  actions: {
    width: '9.6rem',
    flexGrow: '0',
    flexShrink: '0',
    paddingRight: '2.4rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  dragHandle: {
    width: '9.6rem',
    flexGrow: '0',
    flexShrink: '0'
  },
  position: {
    width: '5.6rem',
    flexGrow: '0',
    flexShrink: '0',
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  name: {
    flexGrow: '1',
    overflow: 'hidden'
  },
  tabNumber: {
    width: '7.2rem',
    flexGrow: '0',
    flexShrink: '0',
    textAlign: 'right'
  }
}

ClosingBookIndexItem.defaultProps = {
  actions: null,
  dragHandle: null,
  name: null,
  position: null,
  style: null,
  tabNumber: null
}

ClosingBookIndexItem.propTypes = {
  actions: PropTypes.element,
  dragHandle: PropTypes.element,
  name: PropTypes.element,
  position: PropTypes.element,
  style: PropTypes.object,
  tabNumber: PropTypes.element
}
