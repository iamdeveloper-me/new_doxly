import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentViewerInfoHeader from './DocumentViewerInfoHeader/index.jsx'
import DocumentViewerInfoVersionsList from './DocumentViewerInfoVersionsList/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

export default class DocumentViewerInfo extends React.PureComponent {

  render() {
    const { isLoading } = this.props
    return (
      <div style={styles.info}>
        <div style={styles.header}>
          <DocumentViewerInfoHeader {...this.props} />
        </div>
        {isLoading ?
          <LoadingSpinner showLoadingBox={false} />
        :
          <div style={styles.body}>
            <DocumentViewerInfoVersionsList {...this.props} />
          </div>
        }
      </div>
    )
  }
}

const styles = {
  info: {
    flexBasis: '20%',
    borderLeft: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `-10px 0 10px -10px ${Colors.gray.lighter}`,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: Colors.white,
    overflow: 'hidden'
  },
  header: {
    flexShrink: 0
  },
  body: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    flexGrow: 1,
    background: Colors.white
  }
}

DocumentViewerInfo.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  clickVersion: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}
