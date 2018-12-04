import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const DocumentViewerInfoHeader = ({ treeElement }) => {
  return (
    <div style={styles.header}>
      <div style={styles.name}>
        {treeElement.name}
      </div>
      {treeElement.description ?
        <div style={styles.description}>
          {treeElement.description}
        </div>
      :
        null
      }
    </div>
  )
}

const styles = {
  header:  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '12px 12px 12px 8px',
    color: Colors.gray.darkest,
    backgroundColor: Colors.background.blue,
    fontSize: '12px',
    borderBottom: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `0px 3px 4px 0px ${Colors.gray.normal}`,
    position: 'relative',
    minHeight: '48px'
  },
  name: {
    fontSize: '16px',
    padding: '12px 0 0 4px',
    color: Colors.gray.darkest,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  description: {
    fontSize: '12px',
    padding: '12px 0 0 4px',
    color: Colors.gray.normal
  }
}

DocumentViewerInfoHeader.propTypes = {
  treeElement: PropTypes.object.isRequired
}

export default DocumentViewerInfoHeader
