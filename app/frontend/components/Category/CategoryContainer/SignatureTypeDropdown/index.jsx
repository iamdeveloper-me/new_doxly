import _ from 'lodash'
import { Enum } from 'enumify'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import {
  Tooltipster,
  TooltipsterDropdownItem
} from 'components/Whiteout/Tooltipster/index.jsx'

class SIGNATURE_TYPES extends Enum {}
SIGNATURE_TYPES.initEnum(['no_signature', 'signature_required', 'voting_threshold_required'])

class SignatureTypeDropdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dropdownShown: false
    }
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropdown = this.hideDropdown.bind(this)
    this.setSignatureType = this.setSignatureType.bind(this)
  }

  showDropdown() {
    this.setState({ dropdownShown: true })
  }

  hideDropdown() {
    this.setState({ dropdownShown: false })
  }

  setSignatureType(signatureType) {
    const { treeElement, updateTreeElement } = this.props
    this.setState({ dropdownShown: false })
    const updatedTreeElement = _.assign({}, treeElement, { signature_type: signatureType })
    updateTreeElement(updatedTreeElement)
  }

  render() {
    const { hasVotingThreshold, intl, showTextOnTrigger, treeElement } = this.props
    const icons = {
      'no_signature': 'pencil-off',
      'signature_required': 'square-edit-outline',
      'voting_threshold_required': 'percent'
    }
    const selectedSignatureType = treeElement.signature_type ? SIGNATURE_TYPES[treeElement.signature_type].name : 'no_signature'

    return (
      <div className='whiteout-ui' style={styles.container} onClick={(e) => e.stopPropagation()}>
        <Tooltipster
          open={this.state.dropdownShown}
          triggerElement={
            <div style={styles.trigger} onClick={this.showDropdown}>
              <i className={`mdi mdi-${icons[selectedSignatureType]} mdi-18px gray`}></i>
              {showTextOnTrigger ? <div style={styles.dropdownText}><FormattedMessage id={`category.sidebar.header.signature_types.${selectedSignatureType}`} /></div> : null}
              <i style={styles.triggerArrow} className={`mdi mdi-menu-down gray`}></i>
            </div>
          }
          interactive={true}
          position='bottom'
          arrow={false}
          onClickOutside={this.hideDropdown}
          theme='tooltipster-doxly-whiteout'
          content={
            <div style={styles.dropdown}>
              {
                _.map(SIGNATURE_TYPES.enumValues, signatureType => (
                  <TooltipsterDropdownItem
                    style={styles.dropdownItem}
                    key={`signature_type_${signatureType.name}`}
                    onClick={() => this.setSignatureType(signatureType.name)}
                    disabled={!hasVotingThreshold && signatureType === SIGNATURE_TYPES.voting_threshold_required}
                    tooltip={!hasVotingThreshold && signatureType === SIGNATURE_TYPES.voting_threshold_required ? intl.formatMessage({id: 'category.sidebar.header.how_to_enable_voting_threshold'}) : null}
                  >
                    <div style={styles.signatureType}>
                      <i style={styles.signatureTypeIcon} className={`mdi mdi-${icons[signatureType.name]} mdi-18px`} />
                      <FormattedMessage id={`category.sidebar.header.signature_types.${signatureType.name}`} />
                    </div>
                  </TooltipsterDropdownItem>
                ))
              }
            </div>
          }
        />
      </div>
    )
  }

}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
    cursor: 'pointer'
  },
  dropdownItem: {
    width: '24.0rem'
  },
  dropdownText: {
    padding: '0 0.4rem'
  },
  signatureType: {
    display: 'flex'
  },
  signatureTypeIcon: {
    width: '2.8rem',
    textAlign: 'left'
  },
  trigger: {
    display: 'flex',
    alignItems: 'center'
  },
  triggerArrow: {
    marginTop: '0.2rem',
    fontSize: '1.4rem'
  }
}

SignatureTypeDropdown.propTypes = {
  hasVotingThreshold: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  showTextOnTrigger: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  updateTreeElement: PropTypes.func.isRequired
}

export default injectIntl(SignatureTypeDropdown)