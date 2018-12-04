import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  FormControl
} from 'react-bootstrap'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Colors from 'helpers/Colors'

class NoteInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  onAdd(value, isPublic) {
    if (value !== '') {
      const note = { text: value, is_public: isPublic }
      this.props.addNote(note, this.props.treeElement)
    }
    this.setState({ value: '' })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter'){
      this.onAdd(this.state.value, this.props.isPublic)
    }
  }

  render() {
    const { intl, isPublic } = this.props

    return (
      <div style={styles.container}>
        <FormControl
          type='text'
          bsSize='sm'
          placeholder={intl.formatMessage({id: 'category.sidebar.notes.new_note'})}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <div style={styles.buttonContainer}>
          <Button
            bsStyle='primary'
            bsSize='sm'
            onClick={() => this.onAdd(this.state.value, isPublic)}
          >
            <FormattedMessage id='buttons.add' />
          </Button>
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    padding: '4px 12px',
    borderTop: `1px solid ${Colors.gray.light}`,
    position: 'relative',
    bottom: '0',
    width: '100%'
  },
  buttonContainer: {
    paddingLeft: '12px'
  }
}

NoteInput.propTypes = {
  // attributes
  intl: intlShape.isRequired,
  isPublic: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  addNote: PropTypes.func.isRequired
}

export default injectIntl(NoteInput)
