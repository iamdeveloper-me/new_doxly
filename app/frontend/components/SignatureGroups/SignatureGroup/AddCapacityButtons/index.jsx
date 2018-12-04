import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import { can } from 'components/ProductContext/index.jsx'
import Colors from 'helpers/Colors'
import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'
import { SIGNING_CAPACITY_FORMS } from 'components/SignatureGroups/index.jsx'

class AddCapacityButtons extends React.PureComponent {
  constructor(props) {
    super(props)
    this.importWorkingGroup = this.importWorkingGroup.bind(this)
    this.openSignatureEntityModal =  this.openSignatureEntityModal.bind(this)
    this.openSigningCapacityModal = this.openSigningCapacityModal.bind(this)
  }

  importWorkingGroup() {
    App.SignatureGroups.openImportWorkingGroupList(this.props.signatureGroup.deal_id, this.props.signatureGroup.id)
  }

  openSigningCapacityModal() {
    this.props.setSelectedFormAndGroup(SIGNING_CAPACITY_FORMS.individual_form, this.props.signatureGroup)
  }

  openSignatureEntityModal() {
    this.props.setSelectedFormAndGroup(SIGNING_CAPACITY_FORMS.entity_form, this.props.signatureGroup)
  }

  render() {
    const { signatureGroup } = this.props
    return (
      <div style={styles.container}>
        <Dropdown
          trigger={
            <div style={styles.button}>
              <div style={styles.circle}>
                <i className="mdi mdi-plus"></i>
              </div>
              <FormattedMessage
                id='signature_management.signature_groups.add'
                values={{ signature_group: signatureGroup.name }}
              />
            </div>
          }
          content={
            <DropdownRow>
              <DropdownColumn>
                <DropdownItem onClick={this.openSigningCapacityModal}>
                  <FormattedMessage id='signature_management.individual' />
                </DropdownItem>
                <DropdownItem onClick={this.openSignatureEntityModal}>
                  <FormattedMessage id='signature_management.entity' />
                </DropdownItem>
              </DropdownColumn>
            </DropdownRow>
          }
        />
        {can(/R/, _.get(signatureGroup, 'deal.features.collaborators', false)) ?
          <div style={styles.button} onClick={this.importWorkingGroup}>
            <div style={styles.circle}>
              <i className="mdi mdi-import"></i>
            </div>
            <FormattedMessage id='signature_management.blocks.import' />
          </div>
        :
          null
        }
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '3.2rem',
    cursor: 'pointer'
  },
  circle: {
    borderRadius: '50%',
    height: '2.4rem',
    width: '2.4rem',
    color: Colors.whiteout.white,
    backgroundColor: Colors.whiteout.blue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginRight: '.4rem'
  }
}

AddCapacityButtons.propTypes = {
  signatureGroup: PropTypes.object.isRequired,

  setSelectedFormAndGroup: PropTypes.func.isRequired
}

export default AddCapacityButtons
