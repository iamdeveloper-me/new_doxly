import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentTypes from 'helpers/DocumentTypes'

import { SAVE_AS_TYPES } from 'components/DmsFilePicker/index.jsx'

export default class Document extends React.PureComponent {

  buildMetadataString() {
    return this.props.metadata.join(' | ')
  }

  render() {
    const { document, filePickerAction, isSelected, saveAsType } = this.props
    const { getDocument } = this.props
    const disabled = saveAsType === SAVE_AS_TYPES.new_document
    return (
      <div style={styles.documentContainer(isSelected, disabled)} onClick={disabled ? null : getDocument}>
        <div style={styles.iconContainer}><i style={styles.documentIcon(DocumentTypes.getDocumentType(document.extension))} className={`mdi mdi-${DocumentTypes.getDocumentIcon(document.extension)}`}></i></div>
        <div style={styles.documentInfo}>
          <div style={styles.documentName}>{document.name}</div>
          { filePickerAction === 'export' ?
            <div style={styles.metadata}>
              {this.buildMetadataString()}
            </div>
          :
            null
          }
        </div>
      </div>
    )
  }
}

const styles = {
  documentContainer: (isSelected, disabled) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '.4rem .8rem',
    flexShrink: 0,
    cursor: disabled ? 'default' : 'pointer',
    background: isSelected ? Colors.whiteout.milk : 'inherit',
    overflow: 'hidden',
    opacity: disabled ? .5 : 1
  }),
  iconContainer: {
    width: '3.5rem'
  },
  documentIcon: documentType => ({
    fontSize: '3.2rem',
    color: Colors.whiteout.documents[documentType]
  }),
  documentInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: '1.2rem',
    overflow: 'hidden'
  },
  metadata: {
    fontSize: '1rem',
    color: Colors.whiteout.darkGray,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: '0'
  },
  documentName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: '0'
  }
}


Document.propTypes = {
  document: PropTypes.object.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  metadata: PropTypes.array,
  saveAsType: PropTypes.string,

  getDocument: PropTypes.func.isRequired
}
