import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Modal
} from 'react-bootstrap'

import Colors from 'helpers/Colors'
import EmptyState from './EmptyState/index.jsx'
import Restrictable from './Restrictable/index.jsx'
import WorkingGroupListSelector from './WorkingGroupListSelector/index.jsx'

class PrivacyModal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.addRestriction = this.addRestriction.bind(this)
    this.deleteRestriction = this.deleteRestriction.bind(this)
  }
  createInheritedRestrictions(newRestriction) {
    const inheritedRestrictions = []
    const treeElementRestrictions = this.props.treeElement.tree_element_restrictions
    const restrictable = this.props.getRestrictable(newRestriction)
    switch(newRestriction.restrictable_type) {
      case 'Role':
        // create inherited restrictions for deal entities
        _.each(_.filter(restrictable.deal_entities, { is_owner: false }), dealEntity => {
          const existingDealEntityRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntity.id, restrictable_type: 'DealEntity' })
          if (!existingDealEntityRestriction) {
            inheritedRestrictions.push({
              restrictable_id: dealEntity.id,
              restrictable_type: 'DealEntity',
              inherit: true
            })

            // create inherited restrictions for deal entity users
            _.each(dealEntity.deal_entity_users, dealEntityUser => {
              const existingDealEntityUserRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntityUser.id, restrictable_type: 'DealEntityUser' })
              if (!existingDealEntityUserRestriction) {
                inheritedRestrictions.push({
                  restrictable_id: dealEntityUser.id,
                  restrictable_type: 'DealEntityUser',
                  inherit: true
                })
              }
            })
          }
        })
        break
      case 'DealEntity':
        // create inherited restrictions for deal entity users
        _.each(restrictable.deal_entity_users, dealEntityUser => {
          const existingDealEntityUserRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntityUser.id, restrictable_type: 'DealEntityUser' })
          if (!existingDealEntityUserRestriction) {
            inheritedRestrictions.push({
              restrictable_id: dealEntityUser.id,
              restrictable_type: 'DealEntityUser',
              inherit: true
            })
          }
        })
        break
      case 'DealEntityUser':
        // no nothing
    }
    return inheritedRestrictions
  }

  getInheritedRestrictions(restriction) {
    const inheritedRestrictions = []
    const treeElementRestrictions = this.props.treeElement.tree_element_restrictions
    const restrictable = this.props.getRestrictable(restriction)
    switch(restriction.restrictable_type) {
      case 'Role':
        // create inherited restrictions for deal entities
        _.each(restrictable.deal_entities, dealEntity => {
          const existingDealEntityRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntity.id, restrictable_type: 'DealEntity' })
          if (existingDealEntityRestriction && existingDealEntityRestriction.inherit) {
            inheritedRestrictions.push(existingDealEntityRestriction)

            // create inherited restrictions for deal entity users
            _.each(dealEntity.deal_entity_users, dealEntityUser => {
              const existingDealEntityUserRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntityUser.id, restrictable_type: 'DealEntityUser' })
              if (existingDealEntityUserRestriction && existingDealEntityUserRestriction.inherit) {
                inheritedRestrictions.push(existingDealEntityUserRestriction)
              }
            })
          }
        })
        break
      case 'DealEntity':
        // create inherited restrictions for deal entity users
        _.each(restrictable.deal_entity_users, dealEntityUser => {
          const existingDealEntityUserRestriction = _.find(treeElementRestrictions, { restrictable_id: dealEntityUser.id, restrictable_type: 'DealEntityUser' })
          if (existingDealEntityUserRestriction && existingDealEntityUserRestriction.inherit) {
            inheritedRestrictions.push(existingDealEntityUserRestriction)
          }
        })
        break
      case 'DealEntityUser':
        // no nothing
    }
    return inheritedRestrictions
  }

  addRestriction(restrictable_id, restrictable_type) {
    const existingRestriction = _.find(this.props.treeElement.tree_element_restrictions, { restrictable_id, restrictable_type })
    if (existingRestriction) {
      if (existingRestriction.inherit) {
        this.props.updateRestriction(_.assign({}, existingRestriction, { inherit: false }), this.props.treeElement)
      }
    } else {
      const newRestriction = {
        restrictable_id,
        restrictable_type,
        inherit: false
      }

      this.props.addRestriction(newRestriction, this.createInheritedRestrictions(newRestriction), this.props.treeElement)
    }
  }

  deleteRestriction(restriction) {
    this.props.deleteRestriction(restriction, this.getInheritedRestrictions(restriction), this.props.treeElement)
  }

  render() {
    const { roles, showModal, treeElement, treeElementRestrictions, changesMade } = this.props
    const { getRestrictable, getRestrictableName, hidePrivacyModal, showChildrenPrivacyModal } = this.props
    const filteredRestrictions = _.filter(treeElementRestrictions, { inherit: false })
    const restrictable = filteredRestrictions.map((restriction, index) => (
      <Restrictable
        key={restriction.id || `restriction-index-${index}`}
        restriction={restriction}
        restrictable={getRestrictable(restriction)}
        treeElementRestrictions={treeElementRestrictions}
        type={restriction.restrictable_type}
        deleteRestriction={this.deleteRestriction}
        getRestrictable={getRestrictable}
        getRestrictableName={getRestrictableName}
        roles={roles}
      />
    ))

    return (
      <div style={styles.modalContainer}>
        <Modal show={showModal} onHide={hidePrivacyModal} backdrop={'static'} keyboard={false}>
          <Modal.Header >
            <Modal.Title><FormattedMessage id='category.sidebar.privacy.privacy_modal.customize_privacy' values={{name: treeElement.name}} /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={styles.modalBody}>
              <div style={styles.privacy_details}><FormattedMessage id='category.sidebar.privacy.privacy_modal.privacy_details' /></div>
              <div style={styles.bodyHeader}>
                <div style={styles.restrictDocumentFrom}><FormattedMessage id='category.sidebar.privacy.privacy_modal.restrict_document_from' /></div>
                <WorkingGroupListSelector
                  roles={roles}
                  restrictions={treeElement.tree_element_restrictions}
                  addRestriction={this.addRestriction}
                  getRestrictableName={getRestrictableName}
                />
              </div>
              <div style={styles.restrictions}>
                {restrictable.length > 0 ? restrictable : <EmptyState />}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div style={styles.footer}>
              <Button onClick={hidePrivacyModal} disabled={changesMade}>
                <FormattedMessage id='buttons.close' />
              </Button>
              {treeElement.children.length > 0 ?
                <Button
                  disabled={!changesMade}
                  bsStyle='primary'
                  onClick={showChildrenPrivacyModal}
                >
                  <FormattedMessage id='buttons.next' />
                </Button>
              :
                <Button
                  bsStyle='primary'
                  onClick={hidePrivacyModal}
                  disabled={!changesMade}
                >
                  <FormattedMessage id='buttons.save' />
                </Button>
              }
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

}

const styles = {
  modalContainer: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  modalBody: {
    padding: '0 16px',
    color: Colors.gray.dark
  },
  privacy_details: {
    marginBottom: '20px'
  },
  bodyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '4px'
  },
  restrictDocumentFrom: {
    fontWeight: 'bold',
    color: Colors.gray.darkest
  },
  restrictions: {
    overflow: 'auto',
    width: '100%',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${Colors.gray.light}`,
    background: Colors.gray.lightest
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 16px 16px 16px'
  }
}

PrivacyModal.propTypes = {
  changesMade: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
  showModal: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,
  treeElementRestrictions: PropTypes.array.isRequired,

  addRestriction: PropTypes.func.isRequired,
  deleteRestriction: PropTypes.func.isRequired,
  getRestrictable: PropTypes.func.isRequired,
  getRestrictableName: PropTypes.func.isRequired,
  hidePrivacyModal: PropTypes.func.isRequired,
  showChildrenPrivacyModal: PropTypes.func.isRequired,
  updateRestriction: PropTypes.func.isRequired
}

export default PrivacyModal
