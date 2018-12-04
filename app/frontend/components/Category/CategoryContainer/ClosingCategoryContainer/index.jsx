import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ChecklistContainer from './../ChecklistContainer/index.jsx'
import ClosingAddButtons from './ClosingAddButtons/index.jsx'
import ClosingCategoryFilter from './ClosingCategoryFilter/index.jsx'
import ClosingTreeElementList from './ClosingTreeElementList/index.jsx'
import Colors from 'helpers/Colors'
import FlatIconButton from 'components/Buttons/FlatIconButton/index.jsx'

export default class ClosingCategoryContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  toggleFilter(type, filterInput) {
    let newFilter = _.cloneDeep(this.props.filter)

    const filter = newFilter[type]
    const index = filter.indexOf(filterInput)
    if (index != -1) {
      filter.splice(index, 1)
    } else {
      filter.push(filterInput)
    }
    const showAllKey = `show_all_${type}`
    const showAllIndex = filter.indexOf(showAllKey)
    if (showAllIndex != -1 && filter.length > 1) {
      if (filterInput === showAllKey) {
        newFilter[type] = [showAllKey]
      } else {
        filter.splice(showAllIndex, 1)
      }
    } else if (filter.length === 0) {
      filter.push(showAllKey)
    }

    this.props.setFilter(newFilter)
  }

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, draggingUpload, filter, hasVotingThreshold, loading, noteError, notesLoading, ongoingUploads, publicNotes, searchQuery, selectedTreeElement, showUploads, teamNotes, tree, unplacedUploadsCount } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, exportChecklistInWord, deleteTreeElement, getNotes, initiateUploads, insertEditableTreeElement, moveTreeElement, removeEditableTreeElement, search, selectTreeElement, sendVersionToDms, setActiveParty, toggleUploads, updateEditableTreeElement, updateTreeElement, updateVersion, uploadVersion } = this.props
    const exportChecklistButton = <FlatIconButton icon={"mdi mdi-file-download mdi-24px"} style={styles.exportChecklistButton} onClick={exportChecklistInWord} iconStyle={styles.exportStyle} />

    return  (
      <ChecklistContainer
        treeElementList={
          <ClosingTreeElementList
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
            setActiveParty={setActiveParty}
            publicNotes={publicNotes}
            teamNotes={teamNotes}
            notesLoading={notesLoading}
            noteError={noteError}
            addNote={addNote}
            deleteNote={deleteNote}
            getNotes={getNotes}
            currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
            currentDealEntityUser={currentDealEntityUser}
            deletePlacedUploadVersion={deletePlacedUploadVersion}
            dmsType={dmsType}
            createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
            updateTreeElement={updateTreeElement}
            updateVersion={updateVersion}
            deleteTreeElement={deleteTreeElement}
            uploadVersion={uploadVersion}
            sendVersionToDms={sendVersionToDms}
            ongoingUploads={ongoingUploads}
            hasVotingThreshold={hasVotingThreshold}
          />
        }
        addItems={
          <ClosingAddButtons
            selectedTreeElement={selectedTreeElement}
            initiateUploads={initiateUploads}
            insertEditableTreeElement={insertEditableTreeElement}
          />
        }
        filterComponent={
          <ClosingCategoryFilter
            filter={filter}
            currentDealEntityUser={currentDealEntityUser}
            deletePlacedUploadVersion={deletePlacedUploadVersion}
            toggleFilter={this.toggleFilter}
          />
        }
        exportChecklistButton={exportChecklistButton}
        filter={filter}
        loading={loading}
        search={search}
        searchQuery={searchQuery}
        selectTreeElement={selectTreeElement}
        showUploads={showUploads}
        toggleUploads={toggleUploads}
        unplacedUploadsCount={unplacedUploadsCount}
        draggingUpload={draggingUpload}
        moveTreeElement={moveTreeElement}
        ongoingUploads={ongoingUploads}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    )
  }
}

const styles = {
  exportChecklistButton: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: '8px',
    width: '32px',
    height: '32px',
    backgroundColor: Colors.white,
    borderRadius: '2px',
    border: `solid 1px ${Colors.button.lightGrayBlue}`
  },
  exportStyle: {
    fontSize: '12px',
    color: Colors.text.darkBlue
  }
}

ClosingCategoryContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  draggingUpload: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  hasVotingThreshold: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedTreeElement: PropTypes.object,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.array.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  exportChecklistInWord: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  initiateUploads: PropTypes.func.isRequired,
  insertEditableTreeElement: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  toggleUploads: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
