import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import { RESOURCE_TYPES } from 'components/DmsFilePicker/NetDocumentsFilePickerContainer/index.jsx'

import Colors from 'helpers/Colors'

export default class ResourceList extends React.PureComponent {

  getEmptyState() {
    if (this.props.resourceType == RESOURCE_TYPES.search_results) {
      return (
        <div style={styles.emptyLocation}>
          <i style={styles.emptyIcon} className='mdi mdi-magnify'></i>
          <div style={styles.emptyLocationText}>
            <span><FormattedMessage id='file_picker.search_results_empty' /></span>
            <span style={styles.secondLine}><FormattedMessage id='file_picker.please_search_again' /></span>
          </div>
        </div>
      )
    } else {
      return (
        <div style={styles.emptyLocation}>
          <i style={styles.emptyIcon} className='mdi mdi-folder-outline'></i>
          <div style={styles.emptyLocationText}><FormattedMessage id='file_picker.this_location_is_empty' /></div>
        </div>
      )
    }

  }

  render() {
    const { resourceType, resourceComponents } = this.props
    return (
      <div style={styles.resourceListContainer}>
        {_.isEmpty(resourceComponents) && resourceType ?
          this.getEmptyState()
        :
          resourceComponents
        }
      </div>
    )
  }
}

const styles = {
  resourceListContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: `.1rem solid ${Colors.whiteout.mediumGray}`,
    flexGrow: 1,
    overflow: 'auto'
  },
  emptyLocation: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteout.milk,
    color: Colors.whiteout.text.light
  },
  emptyLocationText: {
    marginTop: '2rem',
    justifyContent: 'center',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  emptyIcon: {
    fontSize: '4.8rem'
  },
  secondLine: {
    marginTop: '.8rem'
  }
}

ResourceList.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceComponents: PropTypes.array.isRequired
}
