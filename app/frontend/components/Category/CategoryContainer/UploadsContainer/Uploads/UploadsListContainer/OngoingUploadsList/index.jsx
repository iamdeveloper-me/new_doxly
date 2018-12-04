import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import OngoingUpload from './OngoingUpload/index.jsx'

const OngoingUploadsList = ({ 
  ongoingUploads, 
  cancelAllOngoingUploads, 
  cancelOngoingUpload, 
  clearAllOngoingUploads 
}) => {
  const pendingUploads = _.filter(ongoingUploads, { complete: false, error: false, canceled: false })
  const incompleteUploads = _.filter(ongoingUploads, { complete: false })

  let header = null
  if (pendingUploads.length) {
    header = (
      <div style={styles.header}>
        <FormattedMessage id='category.sidebar.uploads.ongoing_uploads.uploading_files' values={{ pending_uploads_count: pendingUploads.length }} />
        <Button
          text='Cancel Uploads'
          type='secondary'
          size='mini'
          onClick={cancelAllOngoingUploads}
        />
      </div> 
    )
  } else if (incompleteUploads.length) {
    header = (
      <div style={styles.header}>
        <FormattedMessage id='category.sidebar.uploads.ongoing_uploads.uploads_not_completed' values={{ incomplete_uploads_count: incompleteUploads.length }} />
        <Button 
          text='Clear'
          type='secondary'
          size='mini'
          onClick={clearAllOngoingUploads}
        />
      </div> 
    )
  } else {
    header = (
      <div style={styles.header}>
        <FormattedMessage id='category.sidebar.uploads.ongoing_uploads.completed_uploads' />
      </div> 
    )
  }
  return (
    <div className="whiteout-ui">
      <div style={styles.container}>
        {header}
        <div>
          {ongoingUploads.map(ongoingUpload => <OngoingUpload key={ongoingUpload.id} ongoingUpload={ongoingUpload} cancelOngoingUpload={cancelOngoingUpload} />)}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem'
  },
  header: {
    background: Colors.whiteout.crystal,
    padding: '1.0rem 1.6rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

OngoingUploadsList.propTypes = {
  ongoingUploads: PropTypes.array.isRequired,

  cancelAllOngoingUploads: PropTypes.func.isRequired,
  cancelOngoingUpload: PropTypes.func.isRequired,
  clearAllOngoingUploads: PropTypes.func.isRequired
}

export default OngoingUploadsList