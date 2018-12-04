import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import DataRoomTreeElementHeaderContainer from 'components/Category/CategoryContainer/DataRoomCategoryContainer/DataRoomTreeElementList/DataRoomTreeElementSubTree/DataRoomTreeElementHeaderContainer/index.jsx'
import DataRoomTreeElementSubTree from 'components/Category/CategoryContainer/DataRoomCategoryContainer/DataRoomTreeElementList/DataRoomTreeElementSubTree/index.jsx'
import Schema from 'helpers/Schema'
import Status from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/Status/index.jsx'
import Toggle from 'components/Toggle/index.jsx'

class Folder extends React.PureComponent {

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, expanded, indentation, intl, lastChildren, noteError, notesLoading, originalTree, parentTreeElement, parentNumber, publicNotes, selectTreeElement, selectedTreeElement, showUploads, teamNotes, toggle, treeElement, uploadVersion } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, getNotes, moveTreeElement, updateEditableTreeElement, removeEditableTreeElement } = this.props
    const isFirstLevel = parentNumber === ''
    const passdownParentNumber = isFirstLevel ? `${treeElement.position}` : parentNumber + '.' + treeElement.position
    const nameTextStyles = isFirstLevel ?
      { fontSize: '15px', fontWeight: '500' }
    :
      {}
    const descendant_documents_count = treeElement.folder_completion_numbers.descendant_documents_count
    const documents_with_attachment_count = treeElement.folder_completion_numbers.documents_with_attachment_count
    const completed_documents_count = treeElement.folder_completion_numbers.completed_documents_count
    const status = descendant_documents_count > 0 ?
      intl.formatMessage({id: 'category.tree_element.completion_status.folder_count'}, {completed_documents_count: completed_documents_count.toString(), documents_with_attachment_count: documents_with_attachment_count.toString()})
    :
      intl.formatMessage({id: 'category.tree_element.completion_status.no_documents'})
    return (
      <div style={styles.folder(isFirstLevel)}>
        <DataRoomTreeElementHeaderContainer
          nameTextStyles={nameTextStyles}
          expanded={expanded}
          toggleComponent={<Toggle toggle={toggle} expanded={expanded} />}
          treeElement={treeElement}
          selectedTreeElement={selectedTreeElement}
          selectTreeElement={selectTreeElement}
          indentation={indentation}
          iconPath={Assets.getPath('folder-closed.svg')}
          parentNumber={parentNumber}
          status={<Status status={status} />}
          showUploads={showUploads}
          moveTreeElement={moveTreeElement}
          parentTreeElement={parentTreeElement}
          originalTree={originalTree}
          lastChildren={lastChildren}
          addTreeElement={addTreeElement}
          publicNotes={publicNotes}
          teamNotes={teamNotes}
          notesLoading={notesLoading}
          noteError={noteError}
          addNote={addNote}
          deleteNote={deleteNote}
          getNotes={getNotes}
          currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
        />
        <div>
          {this.props.expanded ?
            <DataRoomTreeElementSubTree
              addTreeElement={addTreeElement}
              updateEditableTreeElement={updateEditableTreeElement}
              removeEditableTreeElement={removeEditableTreeElement}
              tree={treeElement.children}
              indentation={indentation+1}
              selectedTreeElement={selectedTreeElement}
              selectTreeElement={selectTreeElement}
              parentNumber={passdownParentNumber}
              showUploads={showUploads}
              createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
              parentTreeElement={treeElement}
              moveTreeElement={moveTreeElement}
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
          :
            null
          }
        </div>
      </div>
    )
  }

}

const styles = {
  folder: isFirstLevel => ({
    marginBottom: getBottomMargin(isFirstLevel)
  })
}

const getBottomMargin = (isFirstLevel) => {
  if (isFirstLevel) {
    return '10px'
  } else {
    return '0'
  }
}

Folder.defaultProps = {
  parentNumber: ''
}

Folder.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentNumber: PropTypes.string,
  parentTreeElement: Schema.treeElement,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: Schema.treeElement.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export default injectIntl(Folder)
