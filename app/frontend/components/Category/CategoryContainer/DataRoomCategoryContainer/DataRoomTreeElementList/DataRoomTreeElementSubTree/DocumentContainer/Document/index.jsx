import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import DataRoomDocumentBadge from './DataRoomDocumentBadge/index.jsx'
import DataRoomTreeElementHeaderContainer from 'components/Category/CategoryContainer/DataRoomCategoryContainer/DataRoomTreeElementList/DataRoomTreeElementSubTree/DataRoomTreeElementHeaderContainer/index.jsx'
import ReviewedStatus from './ReviewedStatus/index.jsx'
import Schema from 'helpers/Schema'
import UploadStatus from './UploadStatus/index.jsx'

export default class Document extends React.PureComponent {

  render() {
    const treeElement = this.props.treeElement
    const status = treeElement.attachment ?
        <ReviewedStatus
          treeElement={treeElement}
          status={treeElement.completion_statuses[0]}
          createOrUpdateCompletionStatus={this.props.createOrUpdateCompletionStatus}
        />
      :
        <UploadStatus
          uploadVersion={this.props.uploadVersion}
          treeElement={treeElement}
        />

    const documentBadge = treeElement.attachment ?
        <DataRoomDocumentBadge
          formattedMessage={
            <FormattedMessage id='category.tree_element.attachment.version.status.dataRoom' />
          }
          treeElement={treeElement}
          publicNotes={this.props.publicNotes}
          teamNotes={this.props.teamNotes}
          notesLoading={this.props.notesLoading}
          noteError={this.props.noteError}
          addNote={this.props.addNote}
          deleteNote={this.props.deleteNote}
          getNotes={this.props.getNotes}
          dmsType={this.props.dmsType}
          currentDealEntityUser={this.props.currentDealEntityUser}
          deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
        />
      :
       null
    return (
      <div>
        <DataRoomTreeElementHeaderContainer
          treeElement={treeElement}
          selectedTreeElement={this.props.selectedTreeElement}
          selectTreeElement={this.props.selectTreeElement}
          indentation={this.props.indentation}
          iconPath={Assets.getPath('file.svg')}
          parentNumber={this.props.parentNumber}
          status={status}
          viewStatus={documentBadge}
          showUploads={this.props.showUploads}
          moveTreeElement={this.props.moveTreeElement}
          parentTreeElement={this.props.parentTreeElement}
          originalTree={this.props.originalTree}
          lastChildren={this.props.lastChildren}
          addTreeElement={this.props.addTreeElement}
          currentDealEntityUserIsOwner={this.props.currentDealEntityUserIsOwner}
          expanded={false}
        />
      </div>
    )
  }

}

Document.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  indentation: PropTypes.number.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentNumber: PropTypes.string.isRequired,
  parentTreeElement: Schema.treeElement,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: Schema.treeElement.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}
