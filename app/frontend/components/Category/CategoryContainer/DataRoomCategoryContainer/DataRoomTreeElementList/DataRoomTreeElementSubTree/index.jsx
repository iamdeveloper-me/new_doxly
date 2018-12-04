import _ from 'lodash'
import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import DataRoomChecklistNumber from './DataRoomTreeElementHeaderContainer/DataRoomTreeElementHeader/DataRoomChecklistNumber/index.jsx'
import DataRoomTreeElementHeaderContainer from './DataRoomTreeElementHeaderContainer/index.jsx'
import DocumentContainer from './DocumentContainer/index.jsx'
import EditableTreeElement from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/EditableTreeElement/index.jsx'
import FolderContainer from './FolderContainer/index.jsx'
import Schema from 'helpers/Schema'

class DataRoomTreeElementSubTree extends React.Component {

  // Note: using `!=` instead of `!==` intentionally in this method
  // because `undefined && true` is `undefined` and `null && true` is `null`
  // but React needs `true` or `false` returned
  // `undefined !== null && true` would be true, but `null !== null && true` would be `false`
  // however `undefined != null && true` and `null != null && true` are both `false`

  // Commenting this out below until I can figure out how to properly account for expected changes to the lastChildren array.
  // This code is causing treeElementDividers not always re-render
  // shouldComponentUpdate(nextProps) {
  //   if (nextProps != this.props ) {
  //     if (JSON.stringify(nextProps.tree) != JSON.stringify(this.props.tree)) {
  //       return true
  //     } else if (this.props.parentTreeElement && nextProps.selectedTreeElement && !this.props.selectedTreeElement) {
  //       // first time a tree element was selected
  //       return nextProps.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1
  //     } else if (this.props.parentTreeElement && (nextProps.selectedTreeElement !== this.props.selectedTreeElement)) {
  //       // tree element already selected
  //       return (nextProps.selectedTreeElement != null && nextProps.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1) || (nextProps.selectedTreeElement != null && this.props.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1)
  //     } else {
  //       return true
  //     }
  //   }
  //   return false
  // }

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, indentation, intl, nameTextStyles, noteError, notesLoading, originalTree, parentNumber, parentTreeElement, publicNotes, selectedTreeElement, showUploads, teamNotes, tree } = this.props
    const { addNote, addTreeElement, deleteNote, deletePlacedUploadVersion, getNotes, moveTreeElement, updateEditableTreeElement, removeEditableTreeElement, selectTreeElement, createOrUpdateCompletionStatus, uploadVersion } = this.props
    const treeElements = tree.map((treeElement, index, array) => {
      let view = null
      const lastChildren = _.concat(this.props.lastChildren, index === array.length-1)
      if (!treeElement.id) {
        view =  <EditableTreeElement
                  key={null}
                  addTreeElement={addTreeElement}
                  moveTreeElement={moveTreeElement}
                  selectTreeElement={selectTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  indentation={indentation}
                  selectedTreeElement={selectedTreeElement}
                  showUploads={showUploads}
                  treeElement={treeElement}
                  treeElementHeaderContainer={DataRoomTreeElementHeaderContainer}
                  originalTree={originalTree}
                  parentNumber={parentNumber}
                  lastChildren={lastChildren}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  label={treeElement.type === 'Document' ?
                    intl.formatMessage({id: 'category.checklist.document_name'})
                  :
                    intl.formatMessage({id: 'category.checklist.folder_name'})
                  }
                  checklistNumberComponent={
                    <DataRoomChecklistNumber
                      indentation={indentation}
                      position={treeElement.position}
                      parentNumber={parentNumber}
                      numberingStyle={nameTextStyles}
                    />
                  }
                />
      } else if (treeElement.type === 'Folder') {
        view =  <FolderContainer
                  key={treeElement.id}
                  addTreeElement={addTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  indentation={indentation}
                  selectedTreeElement={selectedTreeElement}
                  selectTreeElement={selectTreeElement}
                  treeElement={treeElement}
                  parentNumber={parentNumber}
                  createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
                  showUploads={showUploads}
                  moveTreeElement={moveTreeElement}
                  parentTreeElement={parentTreeElement || null}
                  uploadVersion={uploadVersion}
                  originalTree={originalTree}
                  lastChildren={lastChildren}
                  publicNotes={publicNotes}
                  teamNotes={teamNotes}
                  notesLoading={notesLoading}
                  noteError={noteError}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  getNotes={getNotes}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  dmsType={dmsType}
                  currentDealEntityUser={currentDealEntityUser}
                  deletePlacedUploadVersion={deletePlacedUploadVersion}
                />
      } else {
        view =  <DocumentContainer
                  key={treeElement.id}
                  addTreeElement={addTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  indentation={indentation}
                  selectedTreeElement={selectedTreeElement}
                  selectTreeElement={selectTreeElement}
                  treeElement={treeElement}
                  parentNumber={parentNumber}
                  createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
                  showUploads={showUploads}
                  moveTreeElement={moveTreeElement}
                  parentTreeElement={parentTreeElement}
                  uploadVersion={uploadVersion}
                  originalTree={originalTree}
                  lastChildren={lastChildren}
                  publicNotes={publicNotes}
                  teamNotes={teamNotes}
                  notesLoading={notesLoading}
                  noteError={noteError}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  getNotes={getNotes}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  dmsType={dmsType}
                  currentDealEntityUser={currentDealEntityUser}
                  deletePlacedUploadVersion={deletePlacedUploadVersion}
                />
      }
      return (
        <div key={`tree_element_${treeElement.id}`}>
          {view}
        </div>
      )
    })

    return (
      <div style={styles.container(this.props.parentTreeElement)}>
        {treeElements}
      </div>
    )
  }

}

const styles = {
  container: parentTreeElement => ({
    overflow: parentTreeElement ? 'visible' : 'hidden',
    flex: '1'
  })
}
DataRoomTreeElementSubTree.defaultProps = {
  indentation: 0
}
DataRoomTreeElementSubTree.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  indentation: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentTreeElement: Schema.treeElement,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  nameTextStyles: PropTypes.object,
  parentNumber: PropTypes.string,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export default injectIntl(DataRoomTreeElementSubTree)
