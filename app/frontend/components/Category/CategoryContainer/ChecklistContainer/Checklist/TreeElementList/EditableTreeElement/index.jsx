import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Assets from 'helpers/Assets'
import InlineEdit from 'components/InlineEdit/index.jsx'
import Schema from 'helpers/Schema'

export default class EditableTreeElement extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.treeElement.name,
      saving: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateTree = this.updateTree.bind(this)
    this.updateTree = _.debounce(this.updateTree,100)
  }

  handleChange(value) {
    this.setState({
      value: value
    }, this.updateTree)
  }

  getIconPath(){
    if (this.props.treeElement.type === "Document") {
      return Assets.getPath('file.svg')
    } else if (this.props.treeElement.type === "Folder") {
      return Assets.getPath('folder-closed.svg')
    } else {
      return ""
    }
  }

  updateTree(callback = null) {
    this.props.updateEditableTreeElement(_.assign(this.props.treeElement, { name: this.state.value }), callback, false)
  }

  handleSubmit(value, usingEnter) {
    if (!this.state.value) {
      // cancel
      this.props.removeEditableTreeElement()
    } else {
      // save
      this.setState({ saving: true })
      this.updateTree(() => this.props.addTreeElement(this.props.treeElement, usingEnter, this.props.removeEditableTreeElement))
    }
  }

  render() {
    const { checklistNumberComponent, currentDealEntityUserIsOwner, indentation, label, lastChildren, selectedTreeElement, showUploads, treeElement } = this.props
    const { addTreeElement, moveTreeElement, selectTreeElement } = this.props
    const name = (
      <div style={styles.name}>
        <div style={styles.checklistNumberComponent}>
          {checklistNumberComponent}
        </div>
        <InlineEdit
          label={label}
          initialValue={treeElement.name}
          placeholder=''
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        { this.state.saving ?
          <div style={styles.saving}>
            <img src={Assets.getPath('loading-spin.svg')} style={styles.spinner} />
            <div><FormattedMessage id='common_words.saving' /></div>
          </div>
        :
          null
        }
      </div>
    )

    return (
      <this.props.treeElementHeaderContainer
        expanded={false}
        nameComponent={name}
        indentation={indentation}
        treeElement={treeElement}
        originalTree={this.props.originalTree}
        selectedTreeElement={selectedTreeElement}
        addTreeElement={addTreeElement}
        moveTreeElement={moveTreeElement}
        selectTreeElement={selectTreeElement}
        lastChildren={lastChildren}
        showUploads={showUploads}
        currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
        iconPath={this.getIconPath()}
      />
    )
  }

}

const styles = {
  name: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1
  },
  saving: {
    color: Colors.blue.dark,
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '4px',
    minWidth: '40px',
    flexShrink: '0'
  },
  spinner: {
    height: '20px',
    margin: '0 10px'
  },
  checklistNumberComponent: {
    paddingRight: '10px'
  }
}

EditableTreeElement.propTypes = {
  checklistNumberComponent: PropTypes.element.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  lastChildren: PropTypes.array.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  selectedTreeElement: PropTypes.object,
  showUploads: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  addTreeElement: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired
}
