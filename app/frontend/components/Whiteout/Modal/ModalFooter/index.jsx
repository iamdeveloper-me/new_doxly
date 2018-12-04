import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalFooter = ({ children, style }) => {
  return (
    <Modal.Footer>
      <div style={_.assign({}, styles.footer, style)}>
        {children}
      </div>
    </Modal.Footer>
  )
}

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 16px 16px 16px'
  }
}

ModalFooter.defaultProps = {
  style: {}
}

ModalFooter.propTypes = {
  style: PropTypes.object
}

export default ModalFooter
