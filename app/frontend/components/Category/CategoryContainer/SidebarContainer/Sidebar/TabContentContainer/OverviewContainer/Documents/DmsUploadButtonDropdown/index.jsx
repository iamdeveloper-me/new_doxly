import _ from 'lodash'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import { DMS_VERSION_STORAGEABLE_TYPES } from 'components/Version/DmsMetadata/index.jsx'

import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow,
  DropdownSectionHeader
} from 'components/Whiteout/Dropdown/index.jsx'

const FILE_PICKER_ACTIONS = {
  import: 'import',
  export: 'export'
}

class DmsUploadButtonDropdown extends React.PureComponent {

  render() {
    const { dmsType, uploadNewVersion, version } = this.props
    const { openFilePicker } = this.props
    const dmsUploadDisabled = _.includes(DMS_VERSION_STORAGEABLE_TYPES, _.get(version, 'version_storageable_type')) || _.get(version, 'sending_to_dms_status') === "sending"
    const disabledTitle = dmsUploadDisabled ? this.props.intl.formatMessage({id: 'category.sidebar.document.dms_upload_button_dropdown.this_version_has_already_been_uploaded'}, {dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})}) : ''
    return (
      <div>
        <Dropdown
          trigger={
            <div style={styles.button}>
              <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.import_export' />
              <i className="mdi mdi-swap-vertical" style={styles.addIcon}></i>
            </div>
          }
          right={true}
          content={
            <DropdownRow>
              <DropdownColumn>
                <DropdownSectionHeader>
                  <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.import_new_version'/>
                </DropdownSectionHeader>
                <DropdownItem onClick={uploadNewVersion}>
                  <div style={styles.uploadOption(false)}>
                    <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.desktop' />
                  </div>
                </DropdownItem>
                <DropdownItem onClick={() => openFilePicker(FILE_PICKER_ACTIONS.import)}>
                  <div style={styles.uploadOption(false)}>
                    <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.dms_type' values={{ dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})}} />
                  </div>
                </DropdownItem>
                {version ?
                  <div>
                    <DropdownSectionHeader>
                      <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.save_this_version_to' values={{ dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})}} />
                    </DropdownSectionHeader>
                    <DropdownItem disabled={dmsUploadDisabled} onClick={() => openFilePicker(FILE_PICKER_ACTIONS.export)}>
                      <div title={disabledTitle} style={styles.uploadOption(dmsUploadDisabled)}>
                        <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.select_location' />
                      </div>
                    </DropdownItem>
                  </div>
                :
                  null
                }
              </DropdownColumn>
            </DropdownRow>
          }
        />
      </div>
    )
  }
}

const styles = {
  uploadOption: disabled => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '1.2rem',
    color: disabled ? Colors.whiteout.darkGray : Colors.whiteout.blue,
    opacity: disabled ? '0.6' : '1',
  }),
  subtext: {
    marginTop: '.4rem',
  },
  dropdownCategory: {
    padding: '1rem 0'
  },
  button: {
    color: Colors.button.blue,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  addIcon: {
    marginLeft: '0.8rem',
    fontSize: '1.4rem',
    background: Colors.button.blue,
    color: 'white',
    height: '1.8rem',
    width: '1.8rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}


DmsUploadButtonDropdown.propTypes = {
  dmsType: PropTypes.string,
  intl: intlShape.isRequired,
  version: PropTypes.object,

  openFilePicker: PropTypes.func.isRequired,
  uploadNewVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

DmsUploadButtonDropdown = injectIntl(DmsUploadButtonDropdown)

export { DmsUploadButtonDropdown, FILE_PICKER_ACTIONS}
