import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from './Folder/index.jsx'
import Schema from 'helpers/Schema'

export default class FolderContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: true
    }
    this.toggle = this.toggle.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    const parentTreeElementExists =  nextProps.parentTreeElement && this.props.parentTreeElement
    if (parentTreeElementExists) {
      // *** Not a top level folder ***
      // compare all props EXCEPT originalTree
      let propsChanged = !_.isEqual(_.omit(nextProps, 'originalTree'), _.omit(this.props, 'originalTree'))
      // Need to check if siblings are unchanged because we'd need to alter treeElementDividers if sibling treeElements had change.
      // Also checks for changes within its own subtree
      let siblingsChanged = !(_.isEqual(nextProps.parentTreeElement.children, this.props.parentTreeElement.children))
      // Likewise, need to check if ancestry has changed, because if it had changed, might have to change treeElementDividers
      let ancestryChanged = !(nextProps.treeElement.ancestry === this.props.treeElement.ancestry)
      return (propsChanged || siblingsChanged || ancestryChanged || this.state !== nextState)
    } else {
      // *** Top level folder ***
      // we can omit original tree and still compare the section's individual prop tree recursively, because of the children property on treeElement.
      let topLevelPropsChanged = !_.isEqual(_.omit(nextProps, 'originalTree'), _.omit(this.props, 'originalTree'))
      // Need to check if positionUnchanged Because if so, would have to alter TreeElementDividers maybe??
      let positionChanged = !(nextProps.treeElement.position === this.props.treeElement.position)
      return (topLevelPropsChanged || positionChanged || this.state !== nextState)
    }
  }

  componentWillReceiveProps(nextProps){
    const hasEditable = _.filter(nextProps.treeElement.children, { 'id': null })

    if (hasEditable.length > 0) {
      this.setState({ expanded: true })
    }
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    return (
      <Folder
        addTreeElement={this.props.addTreeElement}
        updateEditableTreeElement={this.props.updateEditableTreeElement}
        removeEditableTreeElement={this.props.removeEditableTreeElement}
        treeElement={this.props.treeElement}
        expanded={this.state.expanded}
        toggle={this.toggle}
        selectedTreeElement={this.props.selectedTreeElement}
        selectTreeElement={this.props.selectTreeElement}
        indentation={this.props.indentation}
        createOrUpdateCompletionStatus={this.props.createOrUpdateCompletionStatus}
        showUploads={this.props.showUploads}
        moveTreeElement={this.props.moveTreeElement}
        parentNumber={this.props.parentNumber}
        uploadVersion={this.props.uploadVersion}
        parentTreeElement={this.props.parentTreeElement}
        originalTree={this.props.originalTree}
        lastChildren={this.props.lastChildren}
        publicNotes={this.props.publicNotes}
        teamNotes={this.props.teamNotes}
        notesLoading={this.props.notesLoading}
        noteError={this.props.noteError}
        addNote={this.props.addNote}
        deleteNote={this.props.deleteNote}
        getNotes={this.props.getNotes}
        currentDealEntityUserIsOwner={this.props.currentDealEntityUserIsOwner}
        dmsType={this.props.dmsType}
        currentDealEntityUser={this.props.currentDealEntityUser}
        deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
      />
    )
  }

}

FolderContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  indentation: PropTypes.number.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
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
  updateEditableTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
