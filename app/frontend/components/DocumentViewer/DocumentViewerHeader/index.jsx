import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'react-bootstrap'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import FlatIconButton from 'components/Buttons/FlatIconButton/index.jsx'
import DocumentViewerHeaderVersion from './DocumentViewerHeaderVersion/index.jsx'
import { ProductContext, can } from 'components/ProductContext/index.jsx'

export default class DocumentViewerHeader extends React.PureComponent {

  isInCheckedVersions(element){
    return this.props.versions.indexOf(element.id) > -1
  }

  render() {
    const { versions, selectedVersionId, teamNotes, publicNotes, notesLoading, noteError, showNotes, treeElement } = this.props
    const { addNote, deleteNote, getNotes, hide, toggleShowNotes } = this.props

    return (
      <div style={styles.header}>
        <div style={styles.returnToChecklist}>
          <FlatIconButton
            icon="fa fa-long-arrow-left"
            style={styles.returnToChecklistButton}
            text={<FormattedMessage id="category.document_viewer.return_to_checklist" />}
            onClick={hide}
          />
        </div>
        <div style={styles.title}>
          <DocumentViewerHeaderVersion
            version={_.find(versions, { id: selectedVersionId })}
            publicNotes={publicNotes}
            teamNotes={teamNotes}
            notesLoading={notesLoading}
            noteError={noteError}
            addNote={addNote}
            deleteNote={deleteNote}
            getNotes={getNotes}
          />
        </div>
        <ProductContext.Consumer>
          {features => (
            treeElement && can(/C+R+/, _.get(features, 'notes', '')) ?
              <div style={styles.toggleNotes}>
                <Button bsSize="small" bsStyle={showNotes ? "primary" : "default"} onClick={toggleShowNotes}>
                  <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>&nbsp;
                  {showNotes ?
                    <FormattedMessage id="category.document_viewer.hide_notes" />
                  :
                    <FormattedMessage id="category.document_viewer.show_notes" />
                  }
                </Button>
              </div>
            :
              null
          )}
        </ProductContext.Consumer>
      </div>
    )
  }
}

const styles = {
  header: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px'
  },
  returnToChecklist: {
    width: '150px'
  },
  returnToChecklistButton: {
    fontSize: '14px'
  },
  title: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center'
  },
  toggleNotes: {
    width: '150px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  rightBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  word: {
    paddingRight: '4px'
  },
  menuItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px'
  },
  menuItem: {
    fontSize: '16px',
    color: Colors.gray.normal
  }
}

DocumentViewerHeader.propTypes = {
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedVersionId: PropTypes.number,
  showNotes: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object,
  versions: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  toggleShowNotes: PropTypes.func.isRequired
}
