import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import Schema from 'helpers/Schema'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'

export default class ReviewedStatus extends React.PureComponent {

  constructor(props) {
    super(props)
    this.toggleCompletionStatus = _.debounce(this.toggleCompletionStatus.bind(this), 200)
  }

  toggleCompletionStatus(e) {
    e.stopPropagation()
    const status = this.props.status
    let completionStatus = _.cloneDeep(status)
    if (completionStatus.is_complete === undefined) {
      completionStatus.is_complete = true
    } else {
      completionStatus.is_complete = !completionStatus.is_complete
      this.setState({
        completionStatus: completionStatus
      })
    }
    this.props.createOrUpdateCompletionStatus(this.props.treeElement, completionStatus)
  }

  render() {
    let statusText
    let statusImage
    if (this.props.status && this.props.status.is_complete) {
      statusText =  <div style={styles.reviewed}>
                      <FormattedMessage id='category.tree_element.completion_status.reviewed' />
                    </div>
      statusImage = 'reviewed.svg'
    } else {
      statusText =  <div style={styles.markAsReviewed}>
                      <FormattedMessage id='category.tree_element.completion_status.mark_as_reviewed' />
                    </div>
      statusImage = 'not-reviewed.svg'
    }

    return (
      <div style={styles.container}>
        <img src={Assets.getPath(statusImage)} onClick={this.toggleCompletionStatus}/>
        {statusText}
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
  markAsReviewed: {
    color: Colors.reviewStatus.needs_review,
    fontSize: '12px',
    paddingLeft: '8px'
  },
  reviewed: {
    color: Colors.reviewStatus.reviewed,
    fontSize: '12px',
    paddingLeft: '8px',
    fontWeight: '800'
  }
}

ReviewedStatus.defaultProps = {
  status: {}
}

ReviewedStatus.propTypes = {
  // attributes
  status: Schema.completionStatus,
  treeElement: Schema.treeElement.isRequired,

  // functions
  createOrUpdateCompletionStatus: PropTypes.func.isRequired

}
