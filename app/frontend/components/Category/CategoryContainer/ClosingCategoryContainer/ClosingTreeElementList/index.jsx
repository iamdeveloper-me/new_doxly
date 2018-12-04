import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingTreeElementListHeader from './ClosingTreeElementListHeader/index.jsx'
import ClosingTreeElementSubtree from './ClosingTreeElementSubTree/index.jsx'
import TreeElementDividerContainer from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/TreeElementDividerContainer/index.jsx'
import TreeElementDivider from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/TreeElementDividerContainer/TreeElementDivider/index.jsx'
import TreeElementList from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/index.jsx'

export default class ClosingTreeElementList extends React.PureComponent {

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, tree } = this.props
    const { addTreeElement, createOrUpdateCompletionStatus, deletePlacedUploadVersion, deleteTreeElement, moveTreeElement, ongoingUploads, sendVersionToDms, updateTreeElement, updateVersion, uploadVersion } = this.props

    return (
      <TreeElementList
        header={<ClosingTreeElementListHeader />}
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
            <ClosingTreeElementSubtree
              addTreeElement={this.props.addTreeElement}
              updateEditableTreeElement={this.props.updateEditableTreeElement}
              removeEditableTreeElement={this.props.removeEditableTreeElement}
              originalTree={this.props.tree}
              tree={this.props.tree}
              indentation={0}
              searchQuery={this.props.searchQuery}
              selectedTreeElement={this.props.selectedTreeElement}
              selectTreeElement={this.props.selectTreeElement}
              showUploads={this.props.showUploads}
              moveTreeElement={this.props.moveTreeElement}
              parentTreeElement={null}
              setActiveParty={this.props.setActiveParty}
              lastChildren={[true]}
              publicNotes={this.props.publicNotes}
              teamNotes={this.props.teamNotes}
              notesLoading={this.props.notesLoading}
              noteError={this.props.noteError}
              addNote={this.props.addNote}
              deleteNote={this.props.deleteNote}
              getNotes={this.props.getNotes}
              currentDealEntityUser={currentDealEntityUser}
              currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
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
          </div>
        }
        tree={this.props.tree}
        filter={this.props.filter}
        searchQuery={this.props.searchQuery}
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

ClosingTreeElementList.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  filter: PropTypes.object.isRequired,
  hasVotingThreshold: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedTreeElement: PropTypes.object,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
