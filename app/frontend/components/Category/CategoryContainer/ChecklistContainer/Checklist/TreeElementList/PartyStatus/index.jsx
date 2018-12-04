import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Assets from 'helpers/Assets'

export default class Status extends React.PureComponent {

  render() {
    const { activeParty, treeElement } = this.props
    const taskIsComplete = treeElement.type === 'Task' && treeElement.completion_statuses[0] && treeElement.completion_statuses[0].is_complete
    const documentIsFinal = treeElement.type === 'Document' && treeElement.attachment && treeElement.attachment.latest_version && (treeElement.attachment.latest_version.status === 'final' || treeElement.attachment.latest_version.status === 'executed')

    let status
    if (documentIsFinal || taskIsComplete) {
      status = <div style={styles.iconContainer}>
                 <img src={Assets.getPath('reviewed.svg')} />
                 <div style={styles.label}>Complete</div>
               </div>
    } else if (activeParty) {
      status = <div style={styles.status(activeParty.deal_entity.id)}>
                 {activeParty.deal_entity.entity.name}
               </div>
    } else {
      status
    }

    return (
      <div style={styles.container}>
        {status}
      </div>
    )
  }

}

const styles = {
  container: {
    width: '100%',
    paddingRight: '8px'
  },
  status: dealEntityId => ({
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: '12px',
    background: getBadgeColor(dealEntityId),
    textAlign: 'center'
  }),
  iconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    color: Colors.reviewStatus.reviewed,
    paddingLeft: '4px',
    fontSize: '14px'
  }
}

const getBadgeColor = (dealEntityId) => {
  return Colors.responsibleParty[dealEntityId % 20]
}

Status.propTypes = {
  activeParty: PropTypes.object,
  treeElement: PropTypes.object.isRequired
}
