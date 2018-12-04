import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow
} from 'components/Whiteout/Dropdown/index.jsx'

export default class ResourceProperties extends React.PureComponent {

  buildDropdownItems() {
    return this.props.versionNumbers.map((versionNumber, index) => (
      <DropdownItem key={index} active={versionNumber === this.props.currentVersionNumber} onClick={() => this.props.setCurrentVersionNumber(versionNumber)}>
        <div>{`Version ${versionNumber}`}</div>
      </DropdownItem>
    ))
  }

  buildMetadataElements() {
    return this.props.metadataArray.map((lineArray, index) => (
      <div key={index} style={styles.metadataLine}>
        <div style={styles.columnOne}>
          {lineArray[0]}
        </div>
        <div style={styles.columnTwo} title={lineArray[1]}>
          {lineArray[1]}
        </div>
      </div>
    ))
  }

  render() {
    return (
      this.props.versionNumbers.length > 0 ?
        <div style={styles.resourcePropertiesContainer}>
          <div style={styles.title}>
            <FormattedMessage id='file_picker.document_versions' />
          </div>
          <div style={styles.dropdown}>
            <Dropdown
              size={'mini'}
              trigger={
                <div style={styles.dropdownTrigger} className="control-dropdown">
                  <FormattedMessage id={'file_picker.version_number'} values={{versionNumber: this.props.currentVersionNumber}} />
                </div>
              }
              right={true}
              content={
                <DropdownRow>
                  <DropdownColumn>
                    {this.buildDropdownItems()}
                  </DropdownColumn>
                </DropdownRow>
              }
            />
          </div>
          <div style={styles.metadata}>
            {this.buildMetadataElements()}
          </div>
        </div>
      :
        <div style={styles.emptyState}>
          <i className={`mdi mdi-file-document mdi-48px`}></i>
          <div style={styles.emptyText}>
            <FormattedMessage id={'file_picker.select_a_document_to_view_versions'} />
          </div>
        </div>
    )
  }
}

const styles = {
  resourcePropertiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: `.1rem solid ${Colors.whiteout.mediumGray}`,
    flexGrow: 1,
    backgroundColor: Colors.whiteout.milk,
    padding: '2.4rem 1.6rem',
    overflow: 'hidden'
  },
  title: {
    fontSize: '2.4rem',
  },
  dropdownTrigger: {
    width: '22rem'
  },
  metadataLine: {
    display: 'flex',
    marginBottom: '.4rem',
    overflow: 'hidden'
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem',
    marginTop: '2.0rem',
    fontWeight: 500
  },
  columnOne: {
    flexBasis: '40%',
    display: 'flex',
    color: Colors.gray.normal,
    flexShrink: 0
  },
  columnTwo: {
    flexBasis: '60%',
    color: Colors.gray.darker,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteout.milk,
    color: Colors.whiteout.text.light
  },
  emptyText: {
    marginTop: '2rem'
  }
}

ResourceProperties.propTypes = {
  currentVersionNumber: PropTypes.string,
  metadataArray: PropTypes.array,
  versionNumbers: PropTypes.array.isRequired,

  setCurrentVersionNumber: PropTypes.func
}
