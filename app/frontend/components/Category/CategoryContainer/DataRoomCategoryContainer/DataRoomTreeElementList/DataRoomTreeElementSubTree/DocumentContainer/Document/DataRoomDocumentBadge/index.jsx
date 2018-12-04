import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import DocumentBadge from 'components/Version/DocumentBadge/index.jsx'

import Colors from 'helpers/Colors'

export default class DataRoomDocumentBadge extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <DocumentBadge
        dmsType={this.props.dmsType}
        version={this.props.version}
        statusStyle={_.assign({}, styles.view, this.props.statusStyle)}
        formattedMessage={this.props.formattedMessage}
        treeElement={this.props.treeElement}
        categoryType='DiligenceCategory'
        documentViewerAlreadyShown={this.props.documentViewerAlreadyShown}
        publicNotes={this.props.publicNotes}
        teamNotes={this.props.teamNotes}
        notesLoading={this.props.notesLoading}
        noteError={this.props.noteError}
        addNote={this.props.addNote}
        deleteNote={this.props.deleteNote}
        getNotes={this.props.getNotes}
        currentDealEntityUser={this.props.currentDealEntityUser}
        deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
      />
    )
  }

}

const styles = {
  view: {
    color: Colors.gray.normal
  }
}

DataRoomDocumentBadge.defaultProps = {
  documentViewerAlreadyShown: false,
  version: null
}

DataRoomDocumentBadge.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  formattedMessage: PropTypes.element.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  statusStyle: PropTypes.object,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,
  version: PropTypes.object,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}
