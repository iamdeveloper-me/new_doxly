import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentBadge from 'components/Version/DocumentBadge/index.jsx'

export default class ClosingDocumentBadge extends React.PureComponent {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.stopPropagation()
  }

  render() {
    const { currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, publicNotes, teamNotes, treeElement, version } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props

    let badgeStyle
    let formattedMessage
    if (treeElement && treeElement.type === 'Task') {
      badgeStyle = styles.task
      formattedMessage = <FormattedMessage id={`category.tree_element.attachment.version.status.${version ? 'doc_attached' : 'no_doc'}`} />
    } else if (version) {
      badgeStyle = styles[version.status]
      formattedMessage =
        <FormattedMessage
          id={`category.tree_element.attachment.version.status.${version.status || 'na'}`}
          values={{version: version.position}}
        />
    } else {
      badgeStyle = styles.notStarted
      formattedMessage =
        <FormattedMessage id='category.tree_element.attachment.version.status.not_started' />
    }
    return (
      <DocumentBadge
        version={treeElement.attachment ? version : null}
        categoryType='ClosingCategory'
        treeElement={treeElement}
        statusStyle={_.assign({}, badgeStyle, this.props.statusStyle)}
        formattedMessage={formattedMessage}
        handleClick={this.handleClick}
        documentViewerAlreadyShown={documentViewerAlreadyShown}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        dmsType={dmsType}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    )
  }

}

const styles = {
  task: {
    color: Colors.version.statuses.task,
    borderColor: Colors.version.statuses.task
  },
  notStarted: {
    color: Colors.version.statuses.not_started,
    borderColor: Colors.version.statuses.not_started
  },
  draft: {
    color: Colors.version.statuses.draft,
    borderColor: Colors.version.statuses.draft
  },
  final: {
    color: Colors.version.statuses.final,
    borderColor: Colors.version.statuses.final
  },
  executed: {
    color: Colors.white,
    borderColor: Colors.version.statuses.executed,
    background: Colors.version.statuses.executed
  }

}

ClosingDocumentBadge.defaultProps = {
  documentViewerAlreadyShown: false
}

ClosingDocumentBadge.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  statusStyle: PropTypes.object,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object,

  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func
}
