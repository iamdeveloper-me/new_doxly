import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import AddButton from 'components/Buttons/AddButton/index.jsx'
import Assets from 'helpers/Assets'
import ChildrenPrivacyModal from './ChildrenPrivacyModal/index.jsx'
import PrivacyModal from './PrivacyModal/index.jsx'
import Colors from 'helpers/Colors'

class Privacy extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showAccessModal: false,
      showPrivacyModal: false,
      showChildrenPrivacyModal: false,
      changesMade: false,
      originalRestrictions: this.props.treeElement.tree_element_restrictions
    }
    this.openPrivacyModal = this.openPrivacyModal.bind(this)
    this.hidePrivacyModal = this.hidePrivacyModal.bind(this)
    this.openChildrenPrivacyModal = this.openChildrenPrivacyModal.bind(this)
    this.hideChildrenPrivacyModal = this.hideChildrenPrivacyModal.bind(this)
    this.showPreviousModal = this.showPreviousModal.bind(this)
    this.getRestrictable = this.getRestrictable.bind(this)
    this.getRestrictableName = this.getRestrictableName.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.treeElement.id != prevProps.treeElement.id){
      this.setState({
        originalRestrictions: this.props.treeElement.tree_element_restrictions
      })
    }
    this.setState({
      changesMade: !this.checkIfChangesMade()
    })
  }

  // without this method, deleting and then adding the exact same restriction will force you to save, not close
  checkIfChangesMade(){

    // clone the restriction objects.
    let cloneOriginal = _.cloneDeep(this.state.originalRestrictions)
    let cloneCurrent = _.cloneDeep(this.props.treeElement.tree_element_restrictions)

    // set all ids to null in the cloned arrays so that they don't disrupt the comparison
    cloneOriginal.forEach(function(element) {
      element.id = null
    })
    cloneCurrent.forEach(function(element) {
      element.id = null
    })
    let sortedOriginal = _.sortBy(cloneOriginal, 'restrictable_id')
    let sortedCurrent = _.sortBy(cloneCurrent, 'restrictable_id')
    return _.isEqual(sortedOriginal, sortedCurrent)
  }

  openPrivacyModal() {
    this.setState({ showPrivacyModal: true })
  }

  hidePrivacyModal() {
    this.setState({
      showPrivacyModal: false,
      originalRestrictions: this.props.treeElement.tree_element_restrictions
    })
  }

  openChildrenPrivacyModal() {
    this.setState({
      showPrivacyModal: false,
      showChildrenPrivacyModal: true
    })
  }

  hideChildrenPrivacyModal() {
    this.setState({ showChildrenPrivacyModal: false })
  }

  showPreviousModal() {
    this.hideChildrenPrivacyModal()
    this.openPrivacyModal()
  }

  getRestrictable(restriction) {
    const roles = this.props.roles
    let restrictable = null
    switch(restriction.restrictable_type) {
      case 'Role':
        // find role
        restrictable = _.find(roles, { id: restriction.restrictable_id })
        break

      case 'DealEntity':
        // look through the deal entities in each role
        _.each(roles, role => {
          let result = _.find(role.deal_entities, { id: restriction.restrictable_id })
          if (result) {
            restrictable = result
            return false // breaks out of loop
          }
        })
        break

      case 'DealEntityUser':
        // look through the deal entity users in each deal entity in each user
        _.each(roles, role => {
          let result = null
          _.each(role.deal_entities, deal_entity => {
            result = _.find(deal_entity.deal_entity_users, { id: restriction.restrictable_id })
            if (result) {
              restrictable = result
              return false // breaks out of loop
            }
          })
          if (result) {
            return false // breaks out of loop
          }
        })
        break

      default:
        break
    }
    return restrictable
  }

  getRestrictableName(restrictable, restrictable_type) {
    if (restrictable) {
      switch(restrictable_type) {
        case 'Role':
          return restrictable.name
        case 'DealEntity':
          return restrictable.entity.name
        case 'DealEntityUser':
          return restrictable.entity_user.user.name
        default:
          return this.props.intl.formatMessage({id: 'category.sidebar.privacy.not_found'})
      }
    } else {
      return this.props.intl.formatMessage({id: 'category.sidebar.privacy.not_found'})
    }
  }

  render() {
    const { categoryType, roles, treeElement } = this.props
    const { addRestriction, deleteRestriction, propagateRestrictionsToChildren, updateRestriction } = this.props
    const treeElementRestrictions = treeElement.tree_element_restrictions
    const filteredRestrictions = _.filter(treeElementRestrictions, { restrictable_type: 'DealEntityUser' })
    const restrictions = filteredRestrictions.map(restriction => this.getRestrictableName(this.getRestrictable(restriction), restriction.restrictable_type))

    let modal = null
    if (this.state.showPrivacyModal) {
      modal = (
        <PrivacyModal
          changesMade={this.state.changesMade}
          treeElement={treeElement}
          showModal={this.state.showPrivacyModal}
          hidePrivacyModal={this.hidePrivacyModal}
          showChildrenPrivacyModal={this.openChildrenPrivacyModal}
          roles={roles}
          treeElementRestrictions={treeElementRestrictions}
          addRestriction={addRestriction}
          updateRestriction={updateRestriction}
          deleteRestriction={deleteRestriction}
          getRestrictable={this.getRestrictable}
          getRestrictableName={this.getRestrictableName}
        />
      )
    } else if (this.state.showChildrenPrivacyModal) {
      modal = (
        <ChildrenPrivacyModal
          categoryType={categoryType}
          showChildrenPrivacyModal={this.state.showChildrenPrivacyModal}
          hideChildrenPrivacyModal={this.hideChildrenPrivacyModal}
          showPreviousModal={this.showPreviousModal}
          treeElement={treeElement}
          propagateRestrictionsToChildren={propagateRestrictionsToChildren}
        />
      )
    } else {
      modal
    }


    return (
      <div>
        <div style={styles.container}>
          <div>
            <div style={styles.header}>
              <div style={styles.title}>
                <FormattedMessage id='category.sidebar.privacy.title' />
              </div>
              <AddButton
                addElement={this.openPrivacyModal}
                text={<FormattedMessage id='category.sidebar.privacy.edit_privacy' />}
              />
            </div>
          </div>
          <div>
            {
              treeElement.tree_element_restrictions.length > 0 ?
                <div style={styles.restricted}>
                  <div style={styles.icon}><img src={Assets.getPath('ic-lock-close-40-px.svg')} /></div>
                  <div>
                    <div style={styles.restrictedTitle}><FormattedMessage id='category.sidebar.privacy.restricted' /></div>
                    <div style={styles.restrictedDescription}><FormattedMessage id='category.sidebar.privacy.restricted_description' /></div>
                    <div style={styles.restrictionsList}>
                      <span>
                        {restrictions.length > 0 ? _.take(restrictions, 8).join(', ') : <FormattedMessage id='category.sidebar.privacy.restricted_empty_state' />}
                      </span>
                      {restrictions.length > 8 ?
                        <span>
                          <span>, </span>
                          <a onClick={this.openPrivacyModal}><FormattedMessage id='category.sidebar.privacy.and_x_others' values={{otherCount: restrictions.length-8}} /></a>
                        </span>
                      :
                        null
                      }
                    </div>
                  </div>
                </div>
              :
                <FormattedMessage id='category.sidebar.privacy.not_restricted' />
            }
          </div>
        </div>
        {modal}
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'relative',
    backgroundColor: Colors.white,
    margin: '4px 0',
    padding: '20px',
    borderBottom: `1px solid ${Colors.gray.lighter}`,
    color: Colors.gray.darkest,
    fontSize: '12px',
    minHeight: '124px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px',
  },
  title: {
    textTransform: 'uppercase'
  },
  content: {
    display: 'flex'
  },
  restrictedTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: Colors.gray.darker
  },
  restrictedDescription: {
    color: Colors.gray.dark
  },
  restricted: {
    display: 'flex'
  },
  icon: {
    width: '32px',
    flexShrink: '0',
    marginRight: '8px'
  },
  restrictionsList: {
    fontStyle: 'italic',
    marginTop: '8px'
  }
}

Privacy.propTypes = {
  categoryType: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  roles: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addRestriction: PropTypes.func.isRequired,
  deleteRestriction: PropTypes.func.isRequired,
  propagateRestrictionsToChildren: PropTypes.func.isRequired,
  updateRestriction: PropTypes.func.isRequired
}

export default injectIntl(Privacy)
