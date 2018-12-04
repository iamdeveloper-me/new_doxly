import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import Lightbox from 'components/Lightbox/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'components/Whiteout/Modal/index.jsx'
import FileForm from './FileForm/index.jsx'
import { FILE_PICKER_ACTIONS } from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/OverviewContainer/Documents/DmsUploadButtonDropdown/index.jsx'
import ResourceList from './ResourceList/index.jsx'
import Sidebar from './Sidebar/index.jsx'

export default class FilePicker extends React.PureComponent {

  render() {
    const { backButtonIsActive, breadcrumbs, currentlySelectedDocumentEnvId, currentlySelectedSidebarKey, dmsLogoPath, filePickerAction, loading, newComment, newDocumentName, resourceComponents, resourceProperties, resourceType, saveAs, saveAsType, searchContainer, sidebarItems } = this.props
    const { closeFilePicker, onBack, onSave, saveEnabled, setNewComment, setNewDocumentName } = this.props
    const header = (filePickerAction === FILE_PICKER_ACTIONS.import ?
      <div style={styles.header}>
        <FormattedMessage id='file_picker.choose_file_to_add_to_doxly' />
      </div>
    :
      <div style={styles.header}>
        <FormattedMessage id='file_picker.save_to' />
        <img style={styles.imageStyle} src={Assets.getPath(dmsLogoPath)} />
      </div>
    )
    return (
      <Modal
        size='900'
        showModal={true}
        hideModal={() => {}}
        content={
          <div>
            <ModalHeader>
            {header}
            </ModalHeader>
            <ModalBody modalStyle={''}>
              <div style={styles.modalBody(filePickerAction === FILE_PICKER_ACTIONS.import)}>
                {filePickerAction === FILE_PICKER_ACTIONS.export ?
                  <div style={styles.fileFormContainer}>
                    <FileForm
                      newDocumentName={newDocumentName}
                      saveAs={saveAs}
                      saveAsType={saveAsType}
                      setNewDocumentName={setNewDocumentName}
                      newComment={newComment}
                      setNewComment={setNewComment}
                    />
                  </div>
                :
                  null
                }
                <div style={styles.browser}>
                  <div style={styles.topBox}>
                    <div style={styles.breadcrumbsAndBack}>
                      <div onClick={backButtonIsActive => backButtonIsActive ? onBack() : null} style={styles.backButton(backButtonIsActive)}>
                        <i className={`mdi mdi-arrow-left mdi-24px`}></i>
                      </div>
                      <div style={styles.middleLine}>
                      </div>
                      {breadcrumbs}
                    </div>
                    <div style={styles.searchContainer}>
                      {searchContainer}
                    </div>
                  </div>
                  <div style={styles.bottomBox}>
                    <div style={styles.sidebar}>
                      <Sidebar
                        currentlySelectedSidebarKey={currentlySelectedSidebarKey}
                        sidebarItems={sidebarItems}
                      />
                    </div>
                    <div style={styles.resourceList}>
                      <ResourceList
                        resourceType={resourceType}
                        resourceComponents={resourceComponents}
                      />
                    </div>
                    {resourceProperties ?
                      <div style={styles.resourceProperties}>
                        {resourceProperties}
                      </div>
                    :
                      null
                    }
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div style={styles.bottomButtons}>
                <Button
                  onClick={closeFilePicker}
                  text={<FormattedMessage id='buttons.cancel' />}
                  type='secondary'
                />
                <Button
                  onClick={onSave}
                  text={<FormattedMessage id='buttons.save' />}
                  type='primary'
                  disabled={!saveEnabled()}
                />
              </div>
              {loading ?
                <Lightbox transparentBody={true}>
                  <LoadingSpinner />
                </Lightbox>
              :
                null
              }
            </ModalFooter>
          </div>
        }
      />
    )
  }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2.4rem',
    padding: '.8rem'
  },
  imageStyle: {
    height: '2.3rem',
    marginLeft: '.6rem'
  },
  modalBody: isImport => ({
    height: isImport ? '50rem' : '60rem',
    padding: '2rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    color: Colors.whiteout.text.primary
  }),
  fileFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2rem',
    flexShrink: 0
  },
  browser: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  topBox:{
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '.8rem',
    flexShrink: 0
  },
  bottomBox: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden'
  },
  searchContainer: {
    flexBasis: '39%', // otherwise will be not right justified correctly.
    marginLeft: '2rem',
    height: '3rem' // set explicitly because of stupid 1.2 rem margin-bottom on all whiteout control class elements. Need to fix long-term for whole app.
  },
  sidebar: {
    flexBasis: '20%',
    display: 'flex',
    flexShrink: 0
  },
  resourceList: {
    display: 'flex',
    flexGrow: 1,
    marginLeft: '.8rem',
    minWidth: 0,
    overflow: 'hidden'
  },
  resourceProperties: {
    marginLeft: '.8rem',
    display: 'flex',
    flexBasis: '32%',
    flexShrink: '0',
    overflow: 'hidden'
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    margin: '0 .8rem'
  },
  breadcrumbsAndBack: {
    display: 'flex'
  },
  backButton: isActive => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.whiteout.blue,
    cursor: isActive ? 'pointer' : 'default',
    opacity: isActive ? '1' : '0.6'
  }),
  middleLine: {
    borderRight: `.1rem solid ${Colors.whiteout.mediumGray}`,
    margin: '0 1rem'
  }
}

FilePicker.propTypes = {
  backButtonIsActive: PropTypes.bool.isRequired,
  breadcrumbs: PropTypes.element.isRequired,
  currentlySelectedSidebarKey: PropTypes.string.isRequired,
  dmsLogoPath: PropTypes.string.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  newComment: PropTypes.string,
  newDocumentName: PropTypes.string,
  resourceComponents: PropTypes.array.isRequired,
  resourceProperties: PropTypes.element,
  resourceTypes: PropTypes.string.isRequired,
  saveAs: PropTypes.element.isRequired,
  saveAsType: PropTypes.string,
  searchContainer: PropTypes.element.isRequired,
  sidebarItems: PropTypes.array.isRequired,

  closeFilePicker: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saveEnabled: PropTypes.func.isRequired,
  setNewComment: PropTypes.func,
  setNewDocumentName: PropTypes.func
}
