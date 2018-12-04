import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentViewerNotesHeader from './DocumentViewerNotesHeader/index.jsx'
import Error from 'components/Error/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import NotesContainer from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/NotesContainer/index.jsx'

export default class DocumentViewerNotes extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'team_notes',
    }
    this.setSelectedTab = this.setSelectedTab.bind(this)
  }

  componentDidMount() {
    this.props.getNotes(this.props.treeElement)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedVersionId !== this.props.selectedVersionId) {
      this.props.getNotes(this.props.treeElement)
    }
  }

  setSelectedTab(value) {
    this.setState({ selectedTab: value })
  }

  render() {
    const { treeElement } = this.props
    let body = null

    if (this.props.noteError) {
      body =  <Error
                title={<FormattedMessage id='category.sidebar.notes.errors.unable_to_load_notes' />}
              />
    } else if (this.props.notesLoading) {
      body =  <LoadingSpinner showLoadingBox={false} />
    } else if (this.state.selectedTab === 'team_notes') {
      body =  <NotesContainer
                treeElement={treeElement}
                isPublic={false}
                notes={this.props.teamNotes}
                addNote={this.props.addNote}
                deleteNote={this.props.deleteNote}
              />
    } else if (this.state.selectedTab === 'public_notes') {
      body =  <NotesContainer
                treeElement={treeElement}
                isPublic={true}
                notes={this.props.publicNotes}
                addNote={this.props.addNote}
                deleteNote={this.props.deleteNote}
              />
    }

    return (
      <div style={styles.notes}>
        <div style={styles.header}>
          <DocumentViewerNotesHeader
            {...this.state}
            {...this.props}
            setSelectedTab={this.setSelectedTab}
          />
        </div>
        <div className={"document-viewer-notes-container"} style={styles.body}>
          {body}
        </div>
      </div>
    )
  }
}

const styles = {
  notes: {
    flexBasis: '20%',
    borderLeft: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `-10px 0 10px -10px ${Colors.gray.lighter}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: Colors.white
  },
  header: {
    flexShrink: 0
  },
  body: {
    overflow: 'auto',
    height: '100%'
  }
}

DocumentViewerNotes.propTypes = {
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  selectedVersionId: PropTypes.number,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}
