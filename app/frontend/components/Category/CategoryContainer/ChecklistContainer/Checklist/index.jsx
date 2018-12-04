import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import { ProductContext, can } from 'components/ProductContext/index.jsx'
import Toolbar from './Toolbar/index.jsx'

export default class Checklist extends React.PureComponent {
  render() {
    const { addItems, exportChecklistButton, filterComponent, ongoingUploads, searchQuery, showUploads, treeElementList, unplacedUploadsCount } = this.props
    const { search, selectTreeElement, toggleUploads } = this.props

    let dropLayer = null
    if (this.props.draggingUpload) {
      dropLayer = (
        <div style={styles.draggingOverlay}>
          Drag and drop the document below to place it
        </div>
      )
    }

    return (
      <ProductContext.Consumer>
        {features => (
          <div style={styles.container(can(/R/, features.sidebar))}>
            <div style={styles.toolbar} className="do-not-print">
              <Toolbar
                search={search}
                searchQuery={searchQuery}
                selectTreeElement={selectTreeElement}
                showUploads={showUploads}
                toggleUploads={toggleUploads}
                unplacedUploadsCount={unplacedUploadsCount}
                addItems={addItems}
                filterComponent={filterComponent}
                ongoingUploads={ongoingUploads}
                exportChecklistButton={exportChecklistButton}
              />
            </div>
            {dropLayer}
            <div style={styles.treeElementList}>
              {this.props.loading ? <LoadingSpinner /> : treeElementList}
            </div>
          </div>
        )}
      </ProductContext.Consumer>
    )
  }
}

const styles = {
  container: canReadSidebar => ({
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.gray.lightest,
    padding: `10px ${canReadSidebar ? '10px' : '100px'} 10px ${canReadSidebar ? '0' : '100px'}`,
    position: 'relative'
  }),
  toolbar: {
    height: '50px',
    flex: '0 0 auto'
  },
  treeElementList: {
    flex: '1',
    overflow: 'hidden'
  },
  draggingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0,0,0,.8)',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
    fontSize: '24px',
    color: Colors.white
  }
}

Checklist.propTypes = {
  addItems: PropTypes.element.isRequired,
  draggingUpload: PropTypes.bool.isRequired,
  exportChecklistButton: PropTypes.element,
  filterComponent: PropTypes.element.isRequired,
  loading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  showUploads: PropTypes.bool.isRequired,
  treeElementList: PropTypes.element.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired,

  search: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  toggleUploads: PropTypes.func.isRequired,
}
