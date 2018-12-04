import { FormattedMessage } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'

import Colors from 'helpers/Colors'
import Toggle from 'components/Toggle/index.jsx'

export default class Restriction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false
    }
  }

  render() {
    const { expanded, indentation, name, restriction, showRestriction, showMessage, type } = this.props
    const { deleteRestriction, setToggle } = this.props
    const hasToggle = type === 'Role' || type === 'DealEntity'
    const message = type === 'DealEntity' ? 'This entity belongs to multiple roles.' : 'This user belongs to multiple organizations.'

    return (
      <div>
        {showRestriction ?
          <div
            style={styles.restriction}
            onMouseEnter={() => this.setState({ isHovering: true })}
            onMouseLeave={() => this.setState({ isHovering: false })}
          >
            <div style={styles.toggle}>
              {hasToggle ? <Toggle expanded={expanded} toggle={setToggle} /> : null}
            </div>
            <div style={styles.name(indentation)}>
              {name}
              {showMessage ? <div style={styles.message}>{message}</div> : null}
            </div>
            {this.state.isHovering && ("id" in restriction) ?
              <button style={styles.button} onClick={() => deleteRestriction(restriction)}>
                <FormattedMessage id='category.sidebar.privacy.privacy_modal.remove_from_list' />
                <i className="fa fa-times-circle" aria-hidden="true" style={styles.deleteIcon}></i>
              </button>
            :
              null
            }
          </div>
        :
          null
        }
      </div>
    )
  }
}

const styles = {
  button: {
    flexShrink: '0',
    color: Colors.pink.normal,
    display: 'flex',
    fontSize: '13px',
    alignItems: 'center'
  },
  deleteIcon: {
    fontSize: '20px',
    display: 'block',
    margin: '0 4px'
  },
  name: indentation => ({
    flexGrow: '1',
    padding: '12px 12px 12px 0',
    marginLeft: `${18*indentation}px`,
    overflow: 'hidden'
  }),
  message: {
    fontSize: '12px',
    color: Colors.permission.message
  },
  restriction: {
    background: Colors.white,
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.gray.lighter}`,
  },
  toggle: {
    flexShrink: '0',
    padding: '8px',
    width: '35px'
  }
}

Restriction.propTypes = {
  expanded: PropTypes.bool,
  indentation: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  restriction: PropTypes.object.isRequired,
  showRestriction: PropTypes.bool,
  showMessage: PropTypes.bool,
  type: PropTypes.string.isRequired,

  deleteRestriction: PropTypes.func.isRequired,
  setToggle: PropTypes.func
}
