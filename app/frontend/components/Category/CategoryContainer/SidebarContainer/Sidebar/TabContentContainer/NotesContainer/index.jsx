import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Error from 'components/Error/index.jsx'
import Note from './Note/index.jsx'
import NoteInput from './NoteInput/index.jsx'

export default class NotesContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom() {
    const notesList = this.refs.notesList
    const maxScrollTop = notesList.scrollHeight - notesList.clientHeight
    notesList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  render() {
    const { treeElement, isPublic, error } = this.props
    const { addNote, deleteNote } = this.props
    const notesList = this.props.notes.map((note, index) => (
      <Note
        key={index}
        note={note}
        treeElement={treeElement}
        deleteNote={deleteNote}
      />
    ))

    if (error) {
      return  <Error
                title={<FormattedMessage id='category.sidebar.notes.errors.unable_to_load_notes' />}
              />
    } else {
      return (
        <div style={styles.container}>
          <div className={"document-viewer-notes"} style={styles.notes} ref='notesList'>
            {notesList}
          </div>
          <NoteInput
            treeElement={treeElement}
            addNote={addNote}
            isPublic={isPublic}
          />
        </div>
      )
    }
  }

}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '4',
    backgroundColor: Colors.white,
    cursor: 'default',
    overflow: 'hidden'
  },
  notes: {
    overflow: 'auto',
    flex: '4'
  }
}

NotesContainer.propTypes = {
  // attributes
  error: PropTypes.bool,
  isPublic: PropTypes.bool.isRequired,
  notes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired
}
