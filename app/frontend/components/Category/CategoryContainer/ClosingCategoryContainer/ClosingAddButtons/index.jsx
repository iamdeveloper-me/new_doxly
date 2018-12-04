import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'

export default class ClosingAddButtons extends React.PureComponent {

  constructor(props) {
    super(props)
    this.bulkUpload = this.bulkUpload.bind(this)
    this.dropBulkUpload = this.dropBulkUpload.bind(this)
  }

  bulkUpload() {
    this.bulkUploadDropzone.open()
  }

  dropBulkUpload(acceptedFiles, rejectedFiles) {
    if (this.props.selectedTreeElement) {
      this.props.initiateUploads(this.props.selectedTreeElement.id, acceptedFiles)
      _.each(rejectedFiles, file => ErrorHandling.setErrors(this.props.intl.formatMessage({ id: 'category.sidebar.document.errors.upload_to_upload' })))
    }
  }

  render() {
    const { selectedTreeElement } = this.props
    const { initiateUploads } = this.props

    return (
      <div className="whiteout-ui" style={styles.container}>
        <Dropzone
          onDrop={this.dropBulkUpload}
          ref={dropzone => { this.bulkUploadDropzone = dropzone }}
          disableClick={true}
          style={styles.invisibleDropzone}
        ></Dropzone>
        <Dropdown
          trigger={
            <Button
              size="small"
              type="primary"
              icon='plus'
              text={<FormattedMessage id="category.checklist.toolbar.add" />}
            />
          }
          right={true}
          content={
            <DropdownRow>
              <DropdownColumn>
                <DropdownItem>
                  <div style={styles.uploadOption} onClick={()=>this.props.insertEditableTreeElement()}>
                    <FormattedMessage id='category.checklist.toolbar.add_item' />
                    <div className="note gray" style={styles.subtext}>
                      {
                        selectedTreeElement !== null ?
                          <FormattedMessage id='category.checklist.toolbar.add_item_subtext' />
                        :
                          <FormattedMessage id='category.checklist.toolbar.add_item_subtext_no_item_selected' />
                      }
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  disabled={selectedTreeElement === null}
                  onClick={this.bulkUpload}
                >
                  <div style={styles.uploadOption}>
                    <FormattedMessage id='category.checklist.toolbar.add_multiple_items' />
                    <div className="note gray" style={styles.subtext}>
                      <FormattedMessage id='category.checklist.toolbar.add_multiple_items_subtext' />
                    </div>
                  </div>
                </DropdownItem>
              </DropdownColumn>
            </DropdownRow>
          }
        />
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex'
  },
  uploadOption: {
    display: 'flex',
    flexDirection: 'column'
  },
  subtext: {
    marginTop: '.4rem',
  },
  invisibleDropzone: {
    height: '0',
    width: '0',
    border: 'none'
  }
}

ClosingAddButtons.defaultProps = {
  selectedTreeElement: null
}

ClosingAddButtons.propTypes = {
  selectedTreeElement: PropTypes.object,

  insertEditableTreeElement: PropTypes.func.isRequired
}
