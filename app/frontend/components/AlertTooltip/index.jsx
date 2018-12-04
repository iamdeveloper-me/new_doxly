import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import { Tooltip } from 'react-tippy'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import 'babel-polyfill'
import 'react-tippy/dist/tippy.css'
import Colors from 'helpers/Colors'

class AlertTooltip extends React.Component {
  constructor(props) {
    super(props)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  onClickOutside() {
    this.props.setShowTooltip()
  }

  render() {
    const { canDelete, onDelete, header, interactive, icon, intl, position, removeButton, showTooltip, text } = this.props

    return (
      <Tooltip
        position={position}
        trigger='click'
        interactive={interactive}
        arrow='true'
        theme='light'
        open={showTooltip}
        onRequestClose={this.onClickOutside}
        html={
          <div id={`tooltip-${Math.random()}`} style={styles.tooltip} className='do-not-hide-sidebar'>
            <div style={styles.content}>
              <div style={styles.header}>{header}</div>
              <div style={styles.text}>{text}</div>
            </div>
            {canDelete ?
              <div style={styles.buttons}>
                <div style={styles.button}>
                  <Button style={styles.deleteButton} bsSize='small' onClick={() => onDelete()}>
                    {removeButton ?
                      intl.formatMessage({id: 'buttons.remove'})
                    :
                      intl.formatMessage({id: 'buttons.delete'})
                    }
                  </Button>
                </div>
                <div style={styles.button}>
                  <Button bsSize='small' onClick={() => this.props.setShowTooltip()}>
                    {intl.formatMessage({id: 'buttons.cancel'})}
                  </Button>
                </div>
              </div>
            :
              null
            }
          </div>
        }
      >
        {icon}
      </Tooltip>
    )
  }

}

const styles = {
  tooltip: {
    maxWidth: '175px',
    padding: '8px'
  },
  content: {
    textAlign: 'left',
    fontSize: '12px',
    color: Colors.gray.darkest
  },
  header: {
    fontWeight: 'bold'
  },
  text: {
    paddingTop: '8px',
  },
  buttons: {
    margin: '16px 16px 0px 16px'
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
  deleteButton: {
    color: Colors.white,
    backgroundColor: Colors.pink.normal,
    border: 'none'
  }
}

AlertTooltip.defaultProps = {
  canDelete: true,
  interactive: true,
  position: 'bottom',
  removeButton: false
}

AlertTooltip.propTypes = {
  canDelete: PropTypes.bool,
  header: PropTypes.string,
  icon: PropTypes.element.isRequired,
  interactive: PropTypes.bool,
  intl: intlShape.isRequired,
  position: PropTypes.string,
  removeButton: PropTypes.bool,
  showTooltip: PropTypes.bool.isRequired,
  text: PropTypes.string,

  onDelete: PropTypes.func,
  setShowTooltip: PropTypes.func.isRequired
}

export default injectIntl(AlertTooltip)
