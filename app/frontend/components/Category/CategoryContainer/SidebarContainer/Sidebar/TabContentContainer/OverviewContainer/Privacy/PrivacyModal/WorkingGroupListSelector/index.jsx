import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import onClickOutside from 'react-onclickoutside'

import Colors from 'helpers/Colors'
import Row from './Row/index.jsx'
import { Tooltipster } from 'components/Whiteout/Tooltipster/index.jsx'

class WorkingGroupListSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggleIsOpen = this.toggleIsOpen.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  toggleIsOpen() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleClickOutside() {
    this.setState({ isOpen: false })
  }

  render() {
    const { restrictions, roles } = this.props
    const { addRestriction, getRestrictableName } = this.props

    const workingGroupList = (
      <Tooltipster
        open={this.state.isOpen}
        triggerElement={
          <button style={styles.button} onClick={this.toggleIsOpen}>
            <FormattedMessage id='category.sidebar.privacy.privacy_modal.add_to_list' />
            <i className="fa fa-plus-circle" aria-hidden="true" style={styles.addIcon}></i>
          </button>
        }
        content={
          <div style={styles.container} className="do-not-hide-sidebar">
            {roles.map(role => (
              <div key={`role_${role.id}`}>
                <Row
                  type="Role"
                  indentation={0}
                  restrictable={role}
                  restricted={_.find(restrictions, { restrictable_id: role.id, restrictable_type: 'Role', inherit: false }) ? true : false}
                  addRestriction={addRestriction}
                  getRestrictableName={getRestrictableName}
                >
                  {
                    _.filter(role.deal_entities, { is_owner: false }).map((deal_entity) => {
                      if (deal_entity.entity.type === 'Individual') {
                        return (
                          <div key={`deal_entity_${deal_entity.id}`}>
                            {
                              deal_entity.deal_entity_users.map(deal_entity_user => (
                                <Row
                                  key={`deal_entity_user_${deal_entity_user.id}`}
                                  type="DealEntityUser"
                                  indentation={1}
                                  restrictable={deal_entity_user}
                                  restricted={_.find(restrictions, { restrictable_id: deal_entity_user.id, restrictable_type: 'DealEntityUser', inherit: false }) ? true : false}
                                  addRestriction={addRestriction}
                                  getRestrictableName={getRestrictableName}
                                />
                              ))
                            }
                          </div>
                        )
                      } else {
                        return (
                          <div key={`deal_entity_${deal_entity.id}`}>
                            <Row
                              type="DealEntity"
                              indentation={1}
                              restrictable={deal_entity}
                              restricted={_.find(restrictions, { restrictable_id: deal_entity.id, restrictable_type: 'DealEntity', inherit: false }) ? true : false}
                              addRestriction={addRestriction}
                              getRestrictableName={getRestrictableName}
                            >
                              {
                                deal_entity.deal_entity_users.map(deal_entity_user => (
                                  <Row
                                    key={`deal_entity_user_${deal_entity_user.id}`}
                                    type="DealEntityUser"
                                    indentation={2}
                                    restrictable={deal_entity_user}
                                    restricted={_.find(restrictions, { restrictable_id: deal_entity_user.id, restrictable_type: 'DealEntityUser', inherit: false }) ? true : false}
                                    addRestriction={addRestriction}
                                    getRestrictableName={getRestrictableName}
                                  ></Row>
                                ))
                              }
                            </Row>
                          </div>
                        )
                      }
                    })
                  }
                </Row>
              </div>
            ))}
          </div>
        }
        interactive={true}
        repositionsOnScroll={true}
        side='bottom'
        theme='tooltipster-doxly-whiteout'
        onClickOutside={() => this.toggleIsOpen}
      />
    )

    return workingGroupList
  }
}

const styles = {
  addIcon: {
    fontSize: '24px',
    display: 'block',
    margin: '0 4px'
  },
  button: {
    flexShrink: '0',
    color: Colors.button.blue,
    display: 'flex',
    fontSize: '13px',
    alignItems: 'center',
  },
  container: {
    height: '400px',
    width: '350px',
    border: `1px solid ${Colors.gray.lighter}`,
    overflow: 'auto',
    fontSize: '14px',
    color: Colors.gray.dark
  }
}

WorkingGroupListSelector.propTypes = {
  restrictions: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,

  addRestriction: PropTypes.func.isRequired,
  getRestrictableName: PropTypes.func.isRequired
}

export default onClickOutside(WorkingGroupListSelector)
