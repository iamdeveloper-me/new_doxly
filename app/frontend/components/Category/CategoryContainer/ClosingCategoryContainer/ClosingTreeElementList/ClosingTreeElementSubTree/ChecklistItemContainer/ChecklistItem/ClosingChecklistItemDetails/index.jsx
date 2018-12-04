import _ from 'lodash'
import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import EditableText from 'components/EditableText/index.jsx'

class ClosingChecklistItemDetails extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.updateTreeElementDetails = this.updateTreeElementDetails.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  updateTreeElementDetails(value) {
    let updatedTreeElement = _.cloneDeep(this.props.treeElement)
    updatedTreeElement.details = value
    this.props.updateTreeElement(updatedTreeElement)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  render() {
    const { intl, treeElement } = this.props
    const { updateTreeElement } = this.props
    const details = updateTreeElement ? (
      <EditableText
        style={styles.details(treeElement.details, this.state.hover)}
        label={intl.formatMessage({id: 'category.checklist.details'})}
        value={treeElement.details}
        placeholder={intl.formatMessage({id: 'category.checklist.click_to_add_details'})}
        handleSubmit={this.updateTreeElementDetails}
      />
    ) : (
      <div>{treeElement.details}</div>
    )

    return (
      <div
        className="whiteout-ui"
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        {details}
      </div>
    )
  }

}

const styles = {
  details: (details, hover) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '12px',
    color: Colors.blueGray.normal,
    opacity: details || hover ? '1' : '0.25'
  })
}

ClosingChecklistItemDetails.propTypes = {
  intl: intlShape.isRequired,
  treeElement: PropTypes.object.isRequired,

  updateTreeElement: PropTypes.func.isRequired
}

export default injectIntl(ClosingChecklistItemDetails)