import PropTypes from 'prop-types'
import React from 'react'

import SearchContainer from 'components/DmsFilePicker/FilePicker/SearchContainer/index.jsx'

export default class Imanage10SearchContainer extends React.PureComponent {

  render() {
    return (
      <SearchContainer
        searchQuery={this.props.searchQuery}
        setSearchQuery={this.props.setSearchQuery}
        search={this.props.search}
      />
    )
  }
}


Imanage10SearchContainer.propTypes = {
  searchQuery: PropTypes.string,

  search: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired
}
