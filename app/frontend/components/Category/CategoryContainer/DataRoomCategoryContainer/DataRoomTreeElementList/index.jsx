import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import DataRoomTreeElementListHeader from './DataRoomTreeElementListHeader/index.jsx'
import DataRoomTreeElementSubTree from './DataRoomTreeElementSubTree/index.jsx'
import TreeElementDividerContainer from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/TreeElementDividerContainer/index.jsx'
import TreeElementDivider from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/TreeElementDividerContainer/TreeElementDivider/index.jsx'
import Schema from 'helpers/Schema'
import TreeElementList from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/index.jsx'


export default class DataRoomTreeElementList extends React.PureComponent {

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, filter, noteError, notesLoading, publicNotes, selectedTreeElement, searchQuery, showUploads, teamNotes, tree } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, getNotes, moveTreeElement, removeEditableTreeElement, selectTreeElement, updateEditableTreeElement, uploadVersion } = this.props
    return (
      <TreeElementList
        header={<DataRoomTreeElementListHeader />}
        subtree={
          <div style={styles.scrollable}>
            <TreeElementDividerContainer
              dividers={[
                <TreeElementDivider
                  key={`first_dropzone`}
                  addTreeElement={addTreeElement}
                  moveTreeElement={moveTreeElement}
                  indentation={0}
                  parentTreeElement={null}
                  treeElementBefore={null}
                  treeElementAfter={_.first(tree)}
                  first={true}
                />
              ]}
            />
            <DataRoomTreeElementSubTree
              addTreeElement={addTreeElement}
              updateEditableTreeElement={updateEditableTreeElement}
              removeEditableTreeElement={removeEditableTreeElement}
              originalTree={this.props.tree}
              tree={tree}
              indentation={0}
              searchQuery={searchQuery}
              selectedTreeElement={selectedTreeElement}
              selectTreeElement={selectTreeElement}
              createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
              showUploads={showUploads}
              moveTreeElement={moveTreeElement}
              uploadVersion={uploadVersion}
              parentTreeElement={null}
              lastChildren={[true]}
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
          </div>
        }
        tree={tree}
        filter={filter}
        searchQuery={searchQuery}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    )
  }
}

const styles = {
  scrollable: {
    overflow: 'auto'
  }
}

DataRoomTreeElementList.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  filter: PropTypes.object.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.array.isRequired,

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
