import PropTypes from 'prop-types'
import React from 'react'
import { Modal as BootstrapModal } from 'react-bootstrap'

import ModalBody from './ModalBody/index.jsx'
import ModalFooter from './ModalFooter/index.jsx'
import ModalHeader from './ModalHeader/index.jsx'

const sizes = [null, '700', '900'] // order from small to largest

const Modal = ({ content, hideModal, showModal, size, style }) => {

  const sizeClass = size ? `modal-${size}` : null

  return (
    <BootstrapModal dialogClassName={sizeClass} show={showModal} onHide={hideModal} backdrop='static' keyboard={false}>
      <div className="whiteout-ui" style={style}>
        {content}
      </div>
    </BootstrapModal>
  )
}

Modal.defaultProps = {
  style: {}
}

Modal.propTypes = {
  content: PropTypes.element.isRequired,
  showModal: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(sizes),
  style: PropTypes.object,

  hideModal: PropTypes.func.isRequired
}

export { Modal, ModalBody, ModalFooter, ModalHeader }
