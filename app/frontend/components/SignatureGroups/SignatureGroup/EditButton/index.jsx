import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'

class EditButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onEdit() {
    this.props.setSelectedGroup(this.props.signatureGroup)
    this.props.openModal()
  }

  onDelete() {
    this.props.deleteSignatureGroup(this.props.signatureGroup.id)
    this.props.setSelectedGroup(null)
  }

  render() {
    return (
      <Dropdown
        trigger={
          <div style={styles.pencil}>
            <i className="mdi mdi-pencil"></i>
          </div>
        }
        right={true}
        disabled={this.props.isLinking}
        content={
          <DropdownRow>
            <DropdownColumn>
              <DropdownItem onClick={this.onEdit}>
                <FormattedMessage id='signature_management.signature_groups.edit_group' />
              </DropdownItem>
              <DropdownItem onClick={this.onDelete}>
                <FormattedMessage id='signature_management.signature_groups.delete_group' />
              </DropdownItem>
            </DropdownColumn>
          </DropdownRow>
        }
      />
    )
  }
}

const styles = {
  pencil: {
    color: Colors.whiteout.blue,
    cursor: 'pointer',
    fontSize: '2.4rem'
  }
}

EditButton.propTypes = {
  isLinking: PropTypes.bool.isRequired,
  signatureGroup: PropTypes.object.isRequired,

  deleteSignatureGroup: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedGroup: PropTypes.func.isRequired
}

export default EditButton
