import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Colors from 'helpers/Colors'
import Toggle from 'components/Toggle/index.jsx'

class Row extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: true
    }
    this.addRestriction = this.addRestriction.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  addRestriction() {
    this.props.addRestriction(this.props.restrictable.id, this.props.type)
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { children, indentation, restrictable, restricted, type } = this.props
    const { getRestrictableName } = this.props

    const empty = (
      <div style={styles.empty(indentation+1)}>
        0 members
      </div>
    ) // TODO: localize - for some reason it didn't work
    const hasToggle = type === 'Role' || type === 'DealEntity'
    const nestedContent = (
      type !== 'DealEntityUser' ?
        children.length > 0 ?
          children
        :
          empty
      :
        null
    )
    return (
      <div>
        <div style={_.assign({}, styles.row, restricted ? styles.restricted : {})}>
          <div style={styles.toggle}>{hasToggle ? <Toggle expanded={this.state.expanded} toggle={this.toggle} /> : null}</div>
          <div style={styles.name(indentation)}>
            <div style={styles.text}>{getRestrictableName(restrictable, type)}</div>
            { restricted ?
              null
            :
              <button style={styles.button} onClick={this.addRestriction}>
                <i className="fa fa-plus-circle" aria-hidden="true" style={styles.addIcon}></i>
              </button>
            }
          </div>
        </div>
        { this.state.expanded ? nestedContent : null }
      </div>
    )
  }
}

const styles = {
  addIcon: {
    display: 'block',
    color: Colors.button.blue,
    fontSize: '20px'
  },
  button: {
    flexShrink: '0'
  },
  empty: indentation => ({
    marginLeft: `${35+18*indentation}px`,
    color: Colors.gray.light,
    textAlign: 'left',
    fontSize: '12px',
    padding: '8px 8px 8px 0',
    borderBottom: `1px solid ${Colors.gray.lighter}`,
  }),
  name: indentation => ({
    flexGrow: '1',
    padding: '8px 8px 8px 0',
    marginLeft: `${18*indentation}px`,
    borderBottom: `1px solid ${Colors.gray.lighter}`,
    display: 'flex',
    alignItems: 'center'
  }),
  row: {
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center'
  },
  restricted: {
    background: Colors.gray.lightest,
    color: Colors.gray.normal
  },
  text: {
    flexGrow: '1'
  },
  toggle: {
    flexShrink: '0',
    padding: '8px',
    width: '35px'
  }
}

Row.propTypes = {
  indentation: PropTypes.number.isRequired,
  restrictable: PropTypes.object.isRequired,
  restricted: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,

  addRestriction: PropTypes.func.isRequired,
  getRestrictableName: PropTypes.func.isRequired
}

export default Row
