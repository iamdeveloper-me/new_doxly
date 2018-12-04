import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalBody = ({ children, modalStyle }) => {
  return (
    <Modal.Body bsClass={modalStyle}>
      <div>{children}</div>
    </Modal.Body>
  )
}

ModalBody.defaultProps = {
  modalStyle: 'modal-body'
}

ModalBody.propTypes = {
  modalStyle: PropTypes.string
}

export default ModalBody
