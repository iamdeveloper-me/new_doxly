import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Input from 'components/Whiteout/Input/index.jsx'

export default class FileForm extends React.PureComponent {

  render() {
    const { newComment, newDocumentName, saveAs, saveAsType } = this.props
    const { setNewComment, setNewDocumentName } = this.props
    const fileNameInput = (
      saveAsType === 'new_document' ?
        <div style={styles.input}>
          <div style={styles.label}>
            <FormattedMessage id='file_picker.name' />
          </div>
          <div style={styles.input}>
            <Input
              type='text'
              size='large'
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
            />
          </div>
        </div>
      :
       null
    )

    const commentInput = (
      setNewComment ?
        <div style={styles.input}>
          <div style={styles.label}>
            <FormattedMessage id='file_picker.comment' />
          </div>
          <div style={styles.input}>
            <Input
              type='text'
              size='large'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
        </div>
      :
        null
    )

    return (
      <div style={styles.fileForm}>
        <div style={styles.saveAs}>
          {saveAs}
        </div>
        <div style={styles.inputsContainer}>
          {fileNameInput}
          {commentInput}
        </div>

      </div>
    )
  }
}

const styles = {
  fileForm: {
    display: 'flex'
  },
  input: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '.8rem'
  },
  saveAs: {
    flexBasis: '20%',
    display: 'flex',
    flexShrink: 0
  },
  label: {
    marginBottom: '.8rem',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  inputsContainer: {
    flexBasis: '80%'
  }
}


FileForm.propTypes = {
  newComment: PropTypes.string,
  newDocumentName: PropTypes.string.isRequired,
  saveAs: PropTypes.element.isRequired,
  saveAsType: PropTypes.string.isRequired,

  setNewComment: PropTypes.func,
  setNewDocumentName: PropTypes.func
}
