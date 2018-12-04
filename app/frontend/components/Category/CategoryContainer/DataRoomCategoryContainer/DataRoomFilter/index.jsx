import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Checkbox from 'components/Checkbox/index.jsx'
import Colors from 'helpers/Colors'
import Filter from 'components/Filter/index.jsx'

export default class DataRoomFilter extends React.PureComponent {

  render() {
    const { filter } = this.props
    const { toggleFilter } = this.props
    const header = <div style={styles.header}>
      <div style={styles.filterBy}><FormattedMessage id='category.checklist.toolbar.data_room_filter.filter_by' /></div>
      <div style={styles.documentStatus}><FormattedMessage id='category.checklist.toolbar.data_room_filter.document_status' /></div>
    </div>
    const menuItems = <div style={styles.container}>
      <Checkbox
        key="show_all_documents"
        value="show_all_documents"
        label={<FormattedMessage id="category.checklist.toolbar.data_room_filter.show_all_documents" />}
        isChecked={_.includes(filter.filters, 'show_all_documents')}
        handleCheckboxChange={toggleFilter}
      />
      <Checkbox
        key='reviewed'
        value='reviewed'
        label={
          <div style={_.assign({}, styles.checkboxLabel, styles.reviewed)}>
            <img src={Assets.getPath('reviewed.svg')} style={styles.imageStyle} />
            <FormattedMessage id='category.checklist.toolbar.data_room_filter.reviewed' />
          </div>
        }
        isChecked={_.includes(filter.filters, 'reviewed')}
        handleCheckboxChange={toggleFilter}
      />
      <Checkbox
        key='needs_review'
        value='needs_review'
        label={
          <div style={_.assign({}, styles.checkboxLabel, styles.needsReview)}>
            <img src={Assets.getPath('not-reviewed.svg')} style={styles.imageStyle} />
            <FormattedMessage id='category.checklist.toolbar.data_room_filter.needs_review' />
          </div>
        }
        isChecked={_.includes(filter.filters, 'needs_review')}
        handleCheckboxChange={toggleFilter}
      />
      <Checkbox
        key='file_not_uploaded'
        value='file_not_uploaded'
        label={
          <div style={_.assign({}, styles.checkboxLabel, styles.notUploaded)}>
            <img src={Assets.getPath('upload.svg')} style={styles.imageStyle} />
            <FormattedMessage id='category.checklist.toolbar.data_room_filter.file_not_uploaded' />
          </div>
        }
        isChecked={_.includes(filter.filters, 'file_not_uploaded')}
        handleCheckboxChange={toggleFilter}
      />
    </div>
    return (
      <Filter
        header={header}
        label={_.without(filter.filters, 'show_all_documents').length > 0 ? 
          <FormattedMessage id='category.checklist.toolbar.data_room_filter.filtered_by_document_status' />
        :
          <FormattedMessage id='category.checklist.toolbar.data_room_filter.no_filter' />
        }
        menuItems={menuItems}
      />
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  leftButton: {
    marginRight: '8px'
  },
  checkbox: {
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center'
  },
  checkboxInputStyle: {
    height: '14px',
    width: '14px',
    marginTop: '0px',
    marginRight: '8px'
  },
  imageStyle: {
    marginRight: '8px'
  },
  notUploaded: {
    color: Colors.blue.darker
  },
  reviewed: {
    color: Colors.reviewStatus.reviewed
  },
  needsReview: {
    color: Colors.reviewStatus.needsReview
  },
  showAll: {
    color: Colors.gray.darkest,
    marginBottom: '8px'
  },
  labelStyle: {
    fontWeight: 'normal'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px'
  },
  filterBy: {
    color: Colors.blueGray.darker,
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  documentStatus: {
    color: Colors.blueGray.darker,
    fontSize: '14px'
  },
  checkboxLabel: {
    display: 'flex',
    fontWeight: 'bold',
    alignItems: 'center'
  }
}

DataRoomFilter.propTypes = {
  filter: PropTypes.object.isRequired,

  toggleFilter: PropTypes.func.isRequired
}
