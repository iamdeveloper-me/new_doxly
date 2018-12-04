import _ from 'lodash'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import { DMS_VERSION_STORAGEABLE_TYPES } from 'components/Version/DmsMetadata/index.jsx'
import { Tooltipster, TooltipsterDropdownItem, TooltipsterHeader } from 'components/Whiteout/Tooltipster/index.jsx';

const FILE_PICKER_ACTIONS = {
  import: 'import',
  export: 'export'
}

// NOTE: THIS SHOULD BE COMBINED WITH THE EXISTING COMPONENT, BUT I DIDN'T WANT TO RISK CHANGING THE EXISTING CODE

class DmsUploadButton extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      dropdownShown: false
    }
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropdown = this.hideDropdown.bind(this)
  }

  showDropdown() {
    this.setState({ dropdownShown: true })
  }

  hideDropdown() {
    this.setState({ dropdownShown: false })
  }

  render() {
    const { dmsType, version } = this.props
    const { openDmsFilePicker, uploadNewVersion } = this.props
    const dmsUploadDisabled = _.includes(DMS_VERSION_STORAGEABLE_TYPES, _.get(version, 'version_storageable_type')) || _.get(version, 'sending_to_dms_status') === "sending"
    const disabledTitle = dmsUploadDisabled ? this.props.intl.formatMessage({id: 'category.sidebar.document.dms_upload_button_dropdown.this_version_has_already_been_uploaded'}, { dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`}) }) : ''

    return (
      <div>
        <Tooltipster
          open={this.state.dropdownShown}
          triggerElement={
            <div style={styles.iconButton} onClick={this.showDropdown}>
              <i className='mdi mdi-upload'></i>
            </div>
          }
          onClickOutside={this.hideDropdown}
          theme='tooltipster-doxly-whiteout'
          position='bottom'
          arrow={false}
          interactive={true}
          content={
            <div>
              <TooltipsterHeader>
                <div style={styles.dropdownHeader}>
                  <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.import_new_version'/>
                </div>
              </TooltipsterHeader>
              <TooltipsterDropdownItem onClick={uploadNewVersion}>
                <div style={styles.uploadOption(false)}>
                  <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.desktop' />
                </div>
              </TooltipsterDropdownItem>
              <TooltipsterDropdownItem onClick={() => openDmsFilePicker(FILE_PICKER_ACTIONS.import)}>
                <div style={styles.uploadOption(false)}>
                  <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.dms_type' values={{ dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`}) }} />
                </div>
              </TooltipsterDropdownItem>
              {version ?
                  <div>
                    <TooltipsterHeader>
                      <div style={styles.dropdownHeader}>
                        <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.save_this_version_to' values={{ dmsType: this.props.intl.formatMessage({id: `dms_types.${dmsType}`}) }} />
                      </div>
                    </TooltipsterHeader>
                    <TooltipsterDropdownItem disabled={dmsUploadDisabled} onClick={() => openDmsFilePicker(FILE_PICKER_ACTIONS.export)}>
                      <div title={disabledTitle} style={styles.uploadOption(dmsUploadDisabled)}>
                        <FormattedMessage id='category.sidebar.document.dms_upload_button_dropdown.select_location' />
                      </div>
                    </TooltipsterDropdownItem>
                  </div>
                :
                  null
                }
            </div>
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
    opacity: disabled ? '0.6' : '1'
  }),
  subtext: {
    marginTop: '.4rem'
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
  },
  iconButton: {
    fontSize: '1.8rem',
    color: Colors.whiteout.blue,
    height: '3.0rem',
    width: '3.0rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.4rem'
  },
  dropdownHeader: {
   margin: '0.8rem 0'
  }
}


DmsUploadButton.propTypes = {
  dmsType: PropTypes.string,
  intl: intlShape.isRequired,
  version: PropTypes.object,

  openDmsFilePicker: PropTypes.func,
  uploadNewVersion: PropTypes.func.isRequired,
}

DmsUploadButton = injectIntl(DmsUploadButton)

export { DmsUploadButton, FILE_PICKER_ACTIONS}
