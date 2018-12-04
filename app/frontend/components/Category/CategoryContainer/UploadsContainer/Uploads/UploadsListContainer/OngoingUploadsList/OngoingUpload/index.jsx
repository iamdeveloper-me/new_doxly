import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Dropdown,
  DropdownHeader,
  DropdownRow,
  DropdownColumn
} from 'components/Whiteout/Dropdown/index.jsx'

export default class OngoingUpload extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.toggleHover = this.toggleHover.bind(this)
  }

  toggleHover(value = !this.state.hover) {
    this.setState({ hover: value })
  }

  render() { 
    const { ongoingUpload, cancelOngoingUpload } = this.props

    let status = null
    if (ongoingUpload.complete) {
      status = <div style={styles.complete}><i className='mdi mdi-check mdi-18px'></i></div>
    } else if (ongoingUpload.canceled) {
      status = <div style={styles.canceled}>Canceled</div>
    } else if (ongoingUpload.error) {
      status = (
        <div style={styles.error}>
          <Dropdown
            right={true}
            caret={true}
            trigger={
              <div><FormattedMessage id='category.sidebar.uploads.ongoing_uploads.upload_error' /> <i style={styles.help} className="mdi mdi-help-circle-outline"></i></div>
            }
            content={
              <div>
                <DropdownHeader>
                  <p><FormattedMessage id='category.sidebar.uploads.ongoing_uploads.unable_to_complete_upload' /></p>
                </DropdownHeader>
                <DropdownRow>
                  <DropdownColumn>
                    <p className="gray"><FormattedMessage id='category.sidebar.uploads.ongoing_uploads.please_try_again' /></p>
                  </DropdownColumn>
                </DropdownRow>
              </div>
            }
          />
        </div>
      )
    } else if (this.state.hover) {
      status = <div><Button size='mini' type='secondary' icon='delete' text='Cancel' onClick={() => cancelOngoingUpload(ongoingUpload)} /></div>
    } else {
      status = <div style={_.assign({}, styles.circle, ongoingUpload.in_progress ? styles.uploading : {})}></div>
    }

    return (
      <div style={styles.container} onMouseEnter={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}>
        <div>{ongoingUpload.file.name}</div>
        <div style={styles.status}>{status}</div>
      </div>
    )
  }
}

const styles = {
  container: {
    padding: '1.6rem',
    minHeight: '5.6rem', // 3.2rem padding + 2.4rem button height for cancel button 
    borderBottom: `0.1rem solid ${Colors.gray.lighter}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circle: {
    borderTop: `0.2rem solid ${Colors.gray.lighter}`,
    border: `0.2rem solid ${Colors.gray.lighter}`,
    borderRadius: '50%',
    height: '1.8rem',
    width: '1.8rem'
  },
  uploading: {
    borderTop: `0.2rem solid ${Colors.blue.dark}`,
    animation: 'spin 1s linear infinite'
  },
  complete: {
    color: Colors.whiteout.alert.complete
  },
  canceled: {
    color: Colors.whiteout.text.light
  },
  error: {
    color: Colors.whiteout.alert.error,
    display: 'flex',
    cursor: 'pointer'
  },
  status: {
    paddingLeft: '1.6rem'
  },
  help: {
    color: Colors.whiteout.blue
  }
}

OngoingUpload.propTypes = {
  ongoingUpload: PropTypes.object.isRequired,

  cancelOngoingUpload: PropTypes.func.isRequired
}