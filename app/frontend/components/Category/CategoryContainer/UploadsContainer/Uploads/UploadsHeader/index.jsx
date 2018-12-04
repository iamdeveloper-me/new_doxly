import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import {
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

import Badge from 'components/Badge/index.jsx'
import Colors from 'helpers/Colors'

export default class UploadsHeader extends React.PureComponent {

  render() {
    return (
      <div style={styles.header}>
        <div style={styles.text}>
          <div style={styles.title}><FormattedMessage id="category.sidebar.uploads.header.title" /></div>
          <div style={styles.subtitle}>
            <div style={styles.badge}>
              <Badge color={Colors.whiteout.navy}>{this.props.unplacedUploadsCount}</Badge>
            </div>
            <FormattedMessage 
              id="category.sidebar.uploads.header.need_to_be_placed"
              values={{uploadsCount: this.props.unplacedUploadsCount}} 
            />
          </div>
        </div>
        <DropdownButton bsSize="small" title={<FormattedMessage id={`category.sidebar.uploads.sort.${this.props.sort}`} />} id="dropdown-size-small" onSelect={this.props.setSort}>
          <MenuItem eventKey="created_at">
            <FormattedMessage id="category.sidebar.uploads.sort.created_at" />
          </MenuItem>
          <MenuItem eventKey="file_name">
            <FormattedMessage id="category.sidebar.uploads.sort.file_name" />
          </MenuItem>
        </DropdownButton>
      </div>
    )
  }

}

const styles = {
  header: {
    padding: '16px 16px 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '16px',
    color: Colors.gray.darkest
  },
  subtitle: {
    fontSize: '12px',
    color: Colors.gray.dark,
    display: 'flex',
    alignItems: 'center'
  },
  badge: {
    marginRight: '2px'
  }
}

UploadsHeader.propTypes = {
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired
}