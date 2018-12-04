import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import IconCheckbox from 'components/IconCheckbox/index.jsx'

export default class MarkComplete extends React.PureComponent {
  constructor(props) {
    super(props)
    this.toggleCompletionStatus = _.debounce(this.toggleCompletionStatus.bind(this), 200)
  }

  toggleCompletionStatus() {
    let completionStatus
    completionStatus = this.completionStatus()
    completionStatus.is_complete = !completionStatus.is_complete
    this.props.createOrUpdateCompletionStatus(this.props.treeElement, completionStatus)
    this.forceUpdate()
  }

  completionStatus() {
    return _.clone(this.props.treeElement.completion_statuses[0]) || {is_complete: false}
  }

  render() {
    const { categoryType } = this.props
    const isComplete = this.completionStatus().is_complete

    return (
      <button
        style={styles.container(isComplete)}
        onClick={this.toggleCompletionStatus}
      >
        <IconCheckbox
          isChecked={isComplete}
          checkedIcon={Assets.getPath('reviewed.svg')}
          uncheckedIcon={Assets.getPath('not-reviewed.svg')}
          updateAttribute={null}
          width='18px'
        />
        <div style={styles.label}>
          {isComplete ?
            <FormattedMessage id={`category.sidebar.header.${categoryType === 'DiligenceCategory' ? 'reviewed' : 'complete'}`} />
          :
            <FormattedMessage id={`category.sidebar.header.mark_${categoryType === 'DiligenceCategory' ? 'reviewed' : 'complete'}`} />
          }
        </div>
      </button>
    )
  }

}

const styles = {
  container: isChecked => ({
    padding: '2px',
    fontSize: '12px',
    fontWeight: 'bold',
    border: isChecked ? 'none' : `1px solid ${Colors.reviewStatus.needsReview}`,
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '160px',
    width: '0px',
    marginRight: '4px',
    background: isChecked ? Colors.reviewStatus.reviewed : 'none',
    color: isChecked ? Colors.white : Colors.reviewStatus.needsReview
  }),
  label: {
    flexGrow: '1'
  }
}

MarkComplete.propTypes = {
  // attributes
  categoryType: PropTypes.string.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  createOrUpdateCompletionStatus: PropTypes.func.isRequired
}
