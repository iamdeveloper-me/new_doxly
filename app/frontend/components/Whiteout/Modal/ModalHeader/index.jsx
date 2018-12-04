import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalHeader = ({ children }) => {
  return (
    <Modal.Header>
      <h2 style={styles.title}>{children}</h2>
    </Modal.Header>
  )
}

const styles = {
  title: {
    textAlign: 'center'
  }
}

export default ModalHeader
