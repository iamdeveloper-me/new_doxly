import PropTypes from 'prop-types'
import React from 'react'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'

const SignatureGroupSearch = ({ intl, searchQuery, setSearchQuery }) => (
  <Input
    type='text'
    icon='magnify'
    iconColor={Colors.whiteout.blue}
    size='large'
    placeholder={intl.formatMessage({ id: 'signature_management.signature_groups.search'})}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
)

SignatureGroupSearch.propTypes = {
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,

  setSearchQuery: PropTypes.func.isRequired
}

export default injectIntl(SignatureGroupSearch)
