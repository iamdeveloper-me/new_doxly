import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ChecklistContainer from './../ChecklistContainer/index.jsx'
import DataRoomAddButtons from './DataRoomAddButtons/index.jsx'
import DataRoomFilter from './DataRoomFilter/index.jsx'
import DataRoomTreeElementList from './DataRoomTreeElementList/index.jsx'
import Schema from 'helpers/Schema'

export default class DataRoomCategoryContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  toggleFilter(filterInput) {
    let newFilter = _.cloneDeep(this.props.filter)

    const filter = newFilter["filters"]
    const index = filter.indexOf(filterInput)
    if (index != -1) {
      filter.splice(index, 1)
    } else {
      filter.push(filterInput)
    }
    const showAllKey = "show_all_documents"
    const showAllIndex = filter.indexOf(showAllKey)
    if (showAllIndex != -1 && filter.length > 1) {
      if (filterInput == showAllKey){
        newFilter.filters = [showAllKey]
      } else {
        filter.splice(showAllIndex, 1)
      }
    } else if (filter.length === 0) {
      filter.push(showAllKey)
    }

    this.props.setFilter(newFilter)
  }

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, draggingUpload, filter, loading, noteError, notesLoading, publicNotes, searchQuery, selectedTreeElement, teamNotes, tree, unplacedUploadsCount } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, getNotes, initiateUploads, insertEditableTreeElement, moveTreeElement, ongoingUploads, removeEditableTreeElement, search, selectTreeElement, showUploads, toggleUploads, updateEditableTreeElement, uploadVersion } = this.props

    return  (
      <ChecklistContainer
        treeElementList={
          <DataRoomTreeElementList
            addTreeElement={addTreeElement}
            updateEditableTreeElement={updateEditableTreeElement}
            removeEditableTreeElement={removeEditableTreeElement}
            filter={filter}
            tree={tree}
            searchQuery={searchQuery}
            selectedTreeElement={selectedTreeElement}
            selectTreeElement={selectTreeElement}
            showUploads={showUploads}
            moveTreeElement={moveTreeElement}
            createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
            uploadVersion={uploadVersion}
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
        addItems={
          <DataRoomAddButtons
            selectedTreeElement={selectedTreeElement}
            initiateUploads={initiateUploads}
            insertEditableTreeElement={insertEditableTreeElement}
          />
        }
        filterComponent={
          <DataRoomFilter
            filter={filter}
            toggleFilter={this.toggleFilter}
          />
        }
        loading={loading}
        search={search}
        searchQuery={searchQuery}
        selectTreeElement={selectTreeElement}
        showUploads={showUploads}
        toggleUploads={toggleUploads}
        unplacedUploadsCount={unplacedUploadsCount}
        draggingUpload={draggingUpload}
        moveTreeElement={moveTreeElement}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        ongoingUploads={ongoingUploads}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    )
  }

}

DataRoomCategoryContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  draggingUpload: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.array.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  initiateUploads: PropTypes.func.isRequired,
  insertEditableTreeElement: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  toggleUploads: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
