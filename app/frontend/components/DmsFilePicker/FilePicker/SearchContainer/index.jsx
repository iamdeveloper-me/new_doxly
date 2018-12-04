import PropTypes from 'prop-types'
import React from 'react'

import SearchBar from './SearchBar/index.jsx'

export default class SearchContainer extends React.PureComponent {

  render() {
    return (
      <SearchBar
        searchQuery={this.props.searchQuery}
        setSearchQuery={this.props.setSearchQuery}
        search={this.props.search}
      />
    )
  }
}


SearchContainer.propTypes = {
  searchQuery: PropTypes.string,

  search: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired
}
