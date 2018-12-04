import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class RoleEntities extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(dealEntityId) {
    const { responsibleParties, responsibleParty, treeElement } = this.props
    const entities = _.map(responsibleParties, 'deal_entity')
    const entityIncluded = _.find(entities, ['id', dealEntityId])

    if (!entityIncluded) {
      if (responsibleParty) {
        this.props.updateParty(_.assign({}, responsibleParty, {deal_entity_id: dealEntityId, deal_entity_user_id: null, is_active: responsibleParty.is_active, text: null}), treeElement)
      } else {
        this.props.addParty(dealEntityId, treeElement)
      }
    }
    this.props.toggleRolesDropdown()
  }

  render() {
    return (
      <div>
        <div style={styles.role}>
          {this.props.role}
        </div>
        {
          this.props.entities.map((deal_entity, index) => (
            <div
              key={index}
              style={styles.dealEntity}
              onClick={() => this.onClick(deal_entity.id)}
              onMouseLeave={this.onMouseLeaveHandler}
            >
              <div style={styles.badge(deal_entity.id)}>
                {deal_entity.entity.name}
              </div>
            </div>
          ))
        }
      </div>
    )
  }

}

const styles = {
  dealEntity: {
    padding: '2px 8px',
    cursor: 'pointer',
    fontStyle: 'normal'
  },
  role: {
    padding: '2px 4px'
  },
  badge: dealEntityId => ({
    background: getPartyColor(dealEntityId),
    borderRadius: '4px',
    padding: '2px 4px',
    color: Colors.white,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  })
}

const getPartyColor = dealEntityId => Colors.responsibleParty[dealEntityId % 20]

RoleEntities.propTypes = {
  entities: PropTypes.array.isRequired,
  responsibleParties: PropTypes.array.isRequired,
  responsibleParty: PropTypes.object,
  role: PropTypes.string.isRequired,

  addParty: PropTypes.func.isRequired,
  toggleRolesDropdown: PropTypes.func.isRequired,
  updateParty: PropTypes.func.isRequired
}
