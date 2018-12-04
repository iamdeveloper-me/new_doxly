import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import Restriction from './Restriction/index.jsx'

export default class Restrictions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstToggleExpanded: true,
      secondToggleExpanded: true
    }
    this.setFirstToggle = this.setFirstToggle.bind(this)
    this.setSecondToggle = this.setSecondToggle.bind(this)
  }

  setFirstToggle() {
    this.setState({ firstToggleExpanded: !this.state.firstToggleExpanded })
  }

  setSecondToggle() {
    this.setState({ secondToggleExpanded: !this.state.secondToggleExpanded })
  }

  getRestrictions(restrictable, type) {
    if (restrictable) {
      switch(type) {
        case 'Role':
          return restrictable.deal_entities
        case 'DealEntity':
          return restrictable.deal_entity_users
        default:
          return []
      }
    }
  }

  getUniqueIds(ids) {
    let uniqueIds = []
    ids.map((id, i) => {
      if (ids.indexOf(id) !== i) {
        uniqueIds.push(id)
      }
    })
    return uniqueIds
  }

  isUnique(restriction, type) {
    const dealEntityRoles = _.flatten(_.map(this.props.roles, 'deal_entities'))
    const dealEntityIds = _.map(dealEntityRoles, 'id')
    const dealEntityUserRoles = _.flatten(_.map(dealEntityRoles, 'deal_entity_users'))
    const userIds = dealEntityUserRoles.map((dealEntityUser) => dealEntityUser.entity_user.user.id)

    switch(type) {
      case 'Role':
        return false
      case 'DealEntity':
        return _.includes(this.getUniqueIds(dealEntityIds), restriction.id)
      case 'DealEntityUser':
        return _.includes(this.getUniqueIds(userIds), this.props.getRestrictable(restriction).entity_user.user.id)
    }
  }

  render() {
    const { restrictable, restriction, treeElementRestrictions, type } = this.props
    const { deleteRestriction, getRestrictable, getRestrictableName } = this.props
    const { firstToggleExpanded, secondToggleExpanded } = this.state
    const dealEntityRestrictableIds = _.map(_.filter(treeElementRestrictions, { 'restrictable_type': 'DealEntity' }), 'restrictable_id')
    const dealEntityUserRestrictableIds = _.map(_.filter(treeElementRestrictions, { 'restrictable_type': 'DealEntityUser' }), 'restrictable_id')

    return (
      <div>
        <Restriction
          indentation={1}
          restriction={restriction}
          name={getRestrictableName(getRestrictable(restriction), restriction.restrictable_type)}
          deleteRestriction={deleteRestriction}
          type={type}
          showRestriction={true}
          showMessage={this.isUnique(restriction, type)}
          expanded={firstToggleExpanded}
          setToggle={this.setFirstToggle}
        />
          <div>
            {
              this.getRestrictions(restrictable, type).map((restriction, index) => {
                const restrictableType = type === 'Role' ? 'DealEntity' : 'DealEntityUser'
                const restrictedIds = type === 'Role' ? dealEntityRestrictableIds : dealEntityUserRestrictableIds
                const isIndividualsDealEntity = restrictableType === 'DealEntity' && restriction.entity.type === 'Individual'

                if (_.includes(restrictedIds, restriction.id)) {
                  const restrictedObject = _.find(treeElementRestrictions, { restrictable_id: restriction.id, restrictable_type: restrictableType })
                  return (
                    <div key={`restriction-group-${Math.random()}`}>
                      {!isIndividualsDealEntity ?
                        <Restriction
                          key={restrictedObject.id || `restriction-index-${index}`}
                          indentation={2}
                          restriction={restrictedObject}
                          name={getRestrictableName(getRestrictable(restrictedObject), restrictedObject.restrictable_type)}
                          deleteRestriction={deleteRestriction}
                          individualsDealEntity={isIndividualsDealEntity}
                          type={restrictableType}
                          showRestriction={firstToggleExpanded}
                          expanded={secondToggleExpanded}
                          setToggle={this.setSecondToggle}
                          showMessage={this.isUnique(restrictedObject, restrictableType)}
                        />
                      :
                        null
                      }
                      <div>
                        {
                          this.getRestrictions(getRestrictable(restrictedObject), restrictedObject.restrictable_type).map((restriction, index) => {
                            if (_.includes(dealEntityUserRestrictableIds, restriction.id)) {
                              const dealEntityUserRestriction = _.find(treeElementRestrictions, { restrictable_id: restriction.id, restrictable_type: 'DealEntityUser' })
                              return (
                                <Restriction
                                  key={dealEntityUserRestriction.id || `restriction-index-${index}`}
                                  indentation={isIndividualsDealEntity ? 2 : 3}
                                  restriction={dealEntityUserRestriction}
                                  name={getRestrictableName(getRestrictable(dealEntityUserRestriction), dealEntityUserRestriction.restrictable_type)}
                                  deleteRestriction={deleteRestriction}
                                  type={'DealEntityUser'}
                                  showRestriction={isIndividualsDealEntity ? firstToggleExpanded : (firstToggleExpanded && secondToggleExpanded)}
                                  showMessage={this.isUnique(dealEntityUserRestriction, 'DealEntityUser')}
                                />
                              )
                            }
                          })
                        }
                      </div>
                    </div>
                  )
                }
              })
            }
          </div>
      </div>
    )
  }
}

Restrictions.propTypes = {
  restrictable: PropTypes.object.isRequired,
  restriction: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
  treeElementRestrictions: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,

  deleteRestriction: PropTypes.func.isRequired,
  getRestrictable: PropTypes.func.isRequired,
  getRestrictableName: PropTypes.func.isRequired
}
