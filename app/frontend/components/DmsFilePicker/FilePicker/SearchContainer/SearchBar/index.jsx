import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'

class SearchBar extends React.PureComponent {

  render() {
    const { intl, search, searchQuery, setSearchQuery } = this.props
    return (
      <Input
        type='text'
        height='mini'
        icon='magnify'
        iconColor={Colors.whiteout.blue}
        size='medium'
        placeholder={intl.formatMessage({id: 'file_picker.search_text'})}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        interactiveIcon={true}
        onIconClick={search}
        onEnter={search}
      />
    )
  }
}


SearchBar.propTypes = {
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,

  search: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired
}

export default injectIntl(SearchBar)
