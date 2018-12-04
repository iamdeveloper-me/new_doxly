import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Dropdown,
  Glyphicon,
  MenuItem
} from 'react-bootstrap'

import Colors from 'helpers/Colors'

export default class ResponsiblePartyDropdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(responsibleParty) {
    const { setActiveParty, treeElement } = this.props
    setActiveParty(treeElement, responsibleParty)
  }

  render() {
    const { treeElement } = this.props
    const activeParty = _.find(treeElement.responsible_parties, ['is_active', true])

    return (
      <Dropdown id={`responsible-party-dropdown-${Math.random()}`}>
        <Dropdown.Toggle style={styles.dropdownButton(activeParty.deal_entity.id)} bsSize='xsmall' noCaret={true}>
          <div style={styles.buttonLabel}>
            {activeParty.deal_entity.entity.name}
          </div>
          <Glyphicon glyph='chevron-down' style={styles.dropdownChevron} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem header>
            <div style={styles.dropddownHeader}>
              <FormattedMessage id='category.sidebar.responsible_party.set_responsibility' />
            </div>
          </MenuItem>
          {treeElement.responsible_parties.map((party, index) => (
            <MenuItem key={index} onClick={() => this.onClick(party)}>
              <div style={styles.menuItem(party.deal_entity.id)}>
                {party.deal_entity.entity.name}
              </div>
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    )
  }

}

const styles = {
  dropdownButton: dealEntityId => ({
    background: getPartyColor(dealEntityId),
    color: Colors.white,
    border: 'none',
    maxWidth: '92px',
    minWidth: '92px',
    whiteSpace: 'normal',
    display: 'flex',
    alignItems: 'center'
  }),
  buttonLabel: {
    width: '100%',
    alignItems: 'center',
    padding: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  dropdownChevron: {
    marginLeft: '4px'
  },
  menuItem: dealEntityId => ({
    background: getPartyColor(dealEntityId),
    border: `1px soid ${getPartyColor(dealEntityId)}`,
    borderRadius: '5px',
    color: Colors.white,
    textAlign: 'center',
    padding: '0px 7px'
  }),
  dropddownHeader: {
    fontWeight: 'normal',
    textAlign: 'center',
    color: Colors.gray.normal
  }
}

const getPartyColor = dealEntityId => Colors.responsibleParty[dealEntityId % 20]

ResponsiblePartyDropdown.propTypes = {
  treeElement: PropTypes.object.isRequired,

  setActiveParty: PropTypes.func
}
