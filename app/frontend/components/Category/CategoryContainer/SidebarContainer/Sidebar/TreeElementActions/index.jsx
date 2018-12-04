import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import {
  Dropdown,
  DropdownColumn,
  DropdownFooter,
  DropdownHeader,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'
import MarkComplete from './MarkComplete/index.jsx'
import TypeDropdown from './TypeDropdown/index.jsx'

export default class TreeElementActions extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.getChildIds = this.getChildIds.bind(this)
  }

  onDelete() {
    const { deleteTreeElement, treeElement } = this.props
    deleteTreeElement(treeElement)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  getChildIds(treeElement) {
    // returns an array of all the tree element ids of all the tree elements under this tree element
    return [treeElement.id, ..._.flatten(treeElement.children.map(child => this.getChildIds(child)))]
  }

  render() {
    const { categoryType, ongoingUploads, treeElement  } = this.props
    const { createOrUpdateCompletionStatus, updateTreeElement } = this.props
    const deleteIcon = this.state.hover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'
    const showStatusButton = treeElement.type === 'Task' || (categoryType === 'DiligenceCategory' && treeElement.type === 'Document' && treeElement.attachment)
    const childIds = this.getChildIds(treeElement)
    const hasOngoingUploads = _.filter(ongoingUploads, ongoingUpload => _.includes(childIds, ongoingUpload.parentTreeElementId) && !ongoingUpload.error && !ongoingUpload.canceled).length > 0
    const typeDropdown = categoryType === 'ClosingCategory' ?
                           <TypeDropdown
                             treeElement={treeElement}
                             updateTreeElement={updateTreeElement}
                            />
                          :
                            null

    return (
      <div style={styles.container}>
        <div style={styles.dropdown}>
          {treeElement.type != 'Section' ? typeDropdown : null}
        </div>
        <div style={styles.right}>
          {showStatusButton ?
            <MarkComplete
              categoryType={categoryType}
              treeElement={treeElement}
              createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
            />
          :
            null
          }
          <div className='whiteout-ui'>
            <Dropdown
              right={true}
              caret={true}
              trigger={
                <img
                  style={styles.delete}
                  src={Assets.getPath(deleteIcon)}
                  onMouseEnter={this.onMouseEnterHandler}
                  onMouseLeave={this.onMouseLeaveHandler}
                />
              }
              content={
                <div>
                  <DropdownHeader>
                    <p><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.end_uploads_and_delete' : 'category.sidebar.header.delete_tree_element_header'} /></p>
                  </DropdownHeader>
                  <DropdownRow>
                    <DropdownColumn>
                      <p className="gray"><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.uploads_pending' : 'category.sidebar.header.delete_tree_element_content'} /></p>
                    </DropdownColumn>
                  </DropdownRow>
                  <DropdownFooter>
                    <Button size='small' type='secondary' text='Cancel' />
                    <Button size='small' type='removal' text='Delete' icon='delete' onClick={this.onDelete} />
                  </DropdownFooter>
                </div>
              }
            />
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  dropdown: {
    flexGrow: '1'
  },
  icon: {
    marginLeft: '4px',
    fontSize: '10px'
  },
  right: {
    flexGrow: '1',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  delete: {
    cursor: 'pointer'
  }
}

TreeElementActions.propTypes = {
  // attributes
  categoryType: PropTypes.string.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired
}
