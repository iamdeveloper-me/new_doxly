import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import { DmsFilePicker } from 'components/DmsFilePicker/index.jsx'
import { DmsUploadButton } from './DmsUploadButton/index.jsx'
import {
  Dropdown,
  DropdownColumn,
  DropdownFooter,
  DropdownHeader,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

export default class ClosingChecklistItemActions extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      deleteTooltipShown: false,
      uploadingInProgress: false,
      dmsFilePickerAction: '',
      dmsFilePickerIsOpen: false
    }
    this.openFilePicker = this.openFilePicker.bind(this)
    this.showDeleteTooltip = this.showDeleteTooltip.bind(this)
    this.hideDeleteTooltip = this.hideDeleteTooltip.bind(this)
    this.deleteTreeElement = this.deleteTreeElement.bind(this)
    this.dropNewVersion = this.dropNewVersion.bind(this)
    this.getChildIds = this.getChildIds.bind(this)
    this.openDmsFilePicker = this.openDmsFilePicker.bind(this)
    this.closeDmsFilePicker = this.closeDmsFilePicker.bind(this)
  }

  openFilePicker() {
    this.newVersionDropzone.open()
  }

  openDmsFilePicker(dmsFilePickerAction) {
    this.setState({
      dmsFilePickerIsOpen: true,
      dmsFilePickerAction: dmsFilePickerAction
    })
  }

  closeDmsFilePicker() {
    this.setState({
      dmsFilePickerIsOpen: false,
      dmsFilePickerAction: ''
    })
  }

  showDeleteTooltip() {
    this.setState({ deleteTooltipShown: true })
  }

  hideDeleteTooltip() {
    this.setState({ deleteTooltipShown: false })
  }

  deleteTreeElement() {
    this.setState({ deleteTooltipShown: false })
    this.props.deleteTreeElement(this.props.treeElement)
  }

  dropNewVersion(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length > 0) {
      this.setState({ uploadingInProgress: true })
      this.props.uploadVersion(this.props.treeElement, {
        file: acceptedFiles[0],
        callback: () => this.setState({ uploadingInProgress: false }),
        errorCallback: () => this.setState({ uploadingInProgress: false })
      })
      // made the below condition an else if, not an else, because in IE11, dropNewVersion was called randomly without any arguments passed in.
    } else if (rejectedFiles.length > 0) {
      App.FlashMessages.addMessage('error', this.props.intl.formatMessage({ id: 'category.sidebar.document.attachment.errors.unable_to_upload_file' }))
    }
  }

  getChildIds(treeElement) {
    // returns an array of all the tree element ids of all the tree elements under this tree element
    return [treeElement.id, ..._.flatten(treeElement.children.map(child => this.getChildIds(child)))]
  }

  render() {
    const { currentDealEntityUserIsOwner, dmsType, ongoingUploads, treeElement, version } = this.props
    const { sendVersionToDms, uploadVersion } = this.props
    const childIds = this.getChildIds(treeElement)
    const hasOngoingUploads = _.filter(ongoingUploads, ongoingUpload => _.includes(childIds, ongoingUpload.parentTreeElementId) && !ongoingUpload.error && !ongoingUpload.canceled).length > 0
    const uploadButton = (
      dmsType && currentDealEntityUserIsOwner ?
        <DmsUploadButton
          dmsType={dmsType}
          uploadNewVersion={this.openFilePicker}
          uploadVersion={uploadVersion}
          treeElement={treeElement}
          version={version}
          sendVersionToDms={sendVersionToDms}
          openDmsFilePicker={this.openDmsFilePicker}
        />
      :
        <div style={styles.iconButton} onClick={this.openFilePicker}>
          <i className='mdi mdi-upload'></i>
        </div>
    )

    return (
      <div className="whiteout-ui" style={styles.container}>
        {this.state.dmsFilePickerIsOpen ?
          <DmsFilePicker
            version={version}
            dmsType={dmsType}
            treeElement={treeElement}
            sendVersionToDms={sendVersionToDms}
            uploadVersion={uploadVersion}
            closeFilePicker={this.closeDmsFilePicker}
            filePickerAction={this.state.dmsFilePickerAction}
          />
        :
          null
        }
        {this.state.uploadingInProgress ?
          <div style={styles.iconButton}>
            <img
              src={Assets.getPath('loading-spin.svg')}
              style={styles.img}
            />
          </div>
        :
          <Dropzone
            onDrop={this.dropNewVersion}
            disableClick={true}
            ref={dropzone => { this.newVersionDropzone = dropzone }}
            style={styles.dropzone}
          >
            {uploadButton}
          </Dropzone>
        }
        <Tooltipster
          open={this.state.deleteTooltipShown}
          triggerElement={
            <div style={styles.iconButton} onClick={this.showDeleteTooltip}>
              <i style={styles.delete} className='mdi mdi-delete'></i>
            </div>
          }
          content={
            <TooltipsterBody>
              <TooltipsterHeader>
                <p><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.end_uploads_and_delete' : 'category.sidebar.header.delete_tree_element_header'} /></p>
              </TooltipsterHeader>
              <TooltipsterText>
                <p className="gray"><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.uploads_pending' : 'category.sidebar.header.delete_tree_element_content'} /></p>
              </TooltipsterText>
              <TooltipsterButtons>
                <Button size='small' type='secondary' text='Cancel' onClick={this.hideDeleteTooltip} />
                <Button size='small' type='removal' text='Delete' icon='delete' onClick={this.deleteTreeElement} />
              </TooltipsterButtons>
            </TooltipsterBody>
          }
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          onClickOutside={this.hideDeleteTooltip}
        />
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  },
  iconButton: {
    fontSize: '1.8rem',
    color: Colors.whiteout.blue,
    height: '3.0rem',
    width: '3.0rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.4rem'
  },
  delete: {
    color: Colors.whiteout.carmine
  },
  dropzone: {
    border: 'none'
  },
  img: {
    height: '2.0rem'
  }
}

ClosingChecklistItemActions.propTypes = {
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  treeElement: PropTypes.object.isRequired,
  version: PropTypes.object,

  deleteTreeElement: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
