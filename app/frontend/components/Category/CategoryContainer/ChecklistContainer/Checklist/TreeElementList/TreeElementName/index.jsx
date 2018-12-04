import { FormattedMessage } from 'react-intl'
import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import EditableText from 'components/EditableText/index.jsx'

class TreeElementName extends React.PureComponent {

  constructor(props) {
    super(props)
    this.updateTreeElementName = this.updateTreeElementName.bind(this)
  }

  updateTreeElementName(value) {
    let updatedTreeElement = _.cloneDeep(this.props.treeElement)
    updatedTreeElement.name = value
    this.props.updateTreeElement(updatedTreeElement)
  }

  render() {
    const { intl, isReserved, nameTextStyles, treeElement } = this.props
    const { updateTreeElement } = this.props

    const reservedName = <FormattedMessage id='category.checklist.reserved' />
    const name = updateTreeElement ? (
      <EditableText
        label={intl.formatMessage({id: 'category.sidebar.header.item_name'})}
        value={treeElement.name}
        placeholder={intl.formatMessage({id: 'category.sidebar.header.item_name'})}
        handleSubmit={this.updateTreeElementName}
      />
    ) : (
      <div>{treeElement.name}</div>
    )

    return (
      <div style={styles.name(isReserved)}>
        {this.props.checklistNumberComponent}
        <div style={nameTextStyles}>
          {isReserved ? reservedName : name}
        </div>
      </div>
    )
  }
}

const styles = {
  name: reserved => ({
    flex: '2',
    color: reserved ? Colors.gray.normal : Colors.gray.darker,
    fontStyle: reserved ? 'italic' : 'normal',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '8px 8px 8px 0'
  })
}

TreeElementName.defaultProps = {
  updateTreeElement: null
}

TreeElementName.propTypes = {
  isReserved: PropTypes.bool.isRequired,
  nameTextStyles: PropTypes.object,
  treeElement: PropTypes.object,
  checklistNumberComponent: PropTypes.element,

  updateTreeElement: PropTypes.func
}

export default injectIntl(TreeElementName)
