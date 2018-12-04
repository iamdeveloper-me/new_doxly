import _ from 'lodash'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'
import Transition from 'react-inline-transition-group'

import Colors from 'helpers/Colors'


class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside(e) {
    if ($(e.target).closest('.do-not-hide-sidebar').length === 0) {
      this.props.hide()
    }
  }

  render() {
    const { children, shown } = this.props
    const { hide } = this.props
    return (
      <Transition
        childrenStyles={{
          base: styles.base,
          appear: styles.appear,
          enter: styles.appear,
          leave: styles.leave
        }}
      >
      { shown ?
        <div style={styles.container}>
          <div style={styles.tab} onClick={hide}>
            <i className="mdi mdi-chevron-right"></i>
          </div>
          <div style={styles.content}>
            {children}
          </div>
        </div>
      :
        null
      }
      </Transition>
    )
  }
}
const styles = {
  container: {
    borderLeft: `.1rem solid ${Colors.whiteout.status.gray}`,
    top: '10.1rem',
    zIndex: '2000',
    bottom: '0',
    width: '40rem',
    position: 'fixed',
    boxShadow: `.2rem 0 1rem 0 ${Colors.whiteout.status.gray}`
  },
  base: {
    right: '-40rem'
  },
  appear: {
    transition: 'all 500ms',
    right: '0'
  },
  leave: {
    transition: 'all 500ms',
    right: '-40rem'
  },
  content: {
    background: Colors.whiteout.crystal,
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column'
  },
  tab: {
    position: 'absolute',
    top: '.8rem',
    left: '-1.6rem',
    width: '1.6rem',
    height: '4.8rem',
    background: Colors.whiteout.crystal,
    color: Colors.button.blue,
    fontSize: '2.0rem',
    display: 'flex',
    alignItems: 'center',
    borderTop: `.1rem solid ${Colors.whiteout.status.gray}`,
    borderRight: `.1rem solid ${Colors.whiteout.crystal}`,
    borderBottom:`.1rem solid ${Colors.whiteout.status.gray}`,
    borderLeft:`.1rem solid ${Colors.whiteout.status.gray}`,
    borderRadius: '.2rem 0 0 .2rem',
    boxShadow: `.2rem 0 1rem 0 ${Colors.whiteout.status.gray}`,
    cursor: 'pointer'
  }
}

Sidebar.propTypes = {
  hide: PropTypes.func.isRequired
}

export default onClickOutside(Sidebar)
