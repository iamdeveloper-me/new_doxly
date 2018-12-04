import PropTypes from 'prop-types'
import React from 'react'

import Checklist from './Checklist/index.jsx'

export default class ChecklistContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      view: 'tree_element_list'
    }
    this.setView = this.setView.bind(this)
  }

  setView(value) {
    this.setState({ view: value })
  }

  render() {
    const { addItems, currentDealEntityUser, draggingUpload, exportChecklistButton, filterComponent, loading, ongoingUploads, searchQuery, showUploads, treeElementList, unplacedUploadsCount } = this.props
    const { deletePlacedUploadVersion, moveTreeElement, search, selectTreeElement, toggleUploads } = this.props
    return (
      <Checklist
        treeElementList={treeElementList}
        filterComponent={filterComponent}
        loading={loading}
        view={this.state.view}
        search={search}
        searchQuery={searchQuery}
        setView={this.setView}
        selectTreeElement={selectTreeElement}
        showUploads={showUploads}
        toggleUploads={toggleUploads}
        unplacedUploadsCount={unplacedUploadsCount}
        draggingUpload={draggingUpload}
        moveTreeElement={moveTreeElement}
        addItems={addItems}
        ongoingUploads={ongoingUploads}
        exportChecklistButton={exportChecklistButton}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    )
  }

}

ChecklistContainer.propTypes = {
  addItems: PropTypes.element.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  draggingUpload: PropTypes.bool.isRequired,
  exportChecklistButton: PropTypes.element,
  filterComponent: PropTypes.element.isRequired,
  loading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  showUploads: PropTypes.bool.isRequired,
  treeElementList: PropTypes.element.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired,

  deletePlacedUploadVersion: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  toggleUploads: PropTypes.func.isRequired
}
