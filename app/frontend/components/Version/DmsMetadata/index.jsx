import _ from 'lodash'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentTypes from 'helpers/DocumentTypes'

const SENDING_TO_DMS_STATUSES = {
  sending: 'sending',
  failed: 'failed'
}

const DMS_VERSION_STORAGEABLE_TYPES = {
  NetDocumentsVersionStorage: "NetDocumentsVersionStorage",
  SeeUnityImanageVersionStorage: 'SeeUnityImanageVersionStorage',
  Imanage10VersionStorage: 'Imanage10VersionStorage'
}

const VERSION_STOREAGEABLE_TYPES_MAP_TO_DMS_TYPES = {
  NetDocumentsVersionStorage: 'net_documents',
  SeeUnityImanageVersionStorage: 'see_unity_imanage',
  Imanage10VersionStorage: 'imanage10'
}

class DmsMetadata extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showDmsVersionData: false
    }
    this.toggleMetadata = this.toggleMetadata.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.version.id !== this.props.version.id) {
      this.setState({
        showDmsVersionData: false
      })
    }
  }


  buildMetadata() {
    const { dmsType, version } = this.props
    if (version.sending_to_dms_status === SENDING_TO_DMS_STATUSES.sending) {
      return (
        <div style={styles.sending}>
          <i style={styles.icon} className={`mdi mdi-progress-upload`}></i>
          <FormattedMessage
            id='category.tree_element.attachment.version.dms_metadata.sending'
            values={{
              dms_type: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})
            }}
          />
        </div>
      )
    } else if (version.sending_to_dms_status === SENDING_TO_DMS_STATUSES.failed) {
      return(
        <div style={styles.failed}>
          <i style={styles.icon} className={`mdi mdi-alert-circle`}></i>
          <FormattedMessage
            id='category.tree_element.attachment.version.dms_metadata.failed'
            values={{
              dms_type: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})
            }}
          />
        </div>
      )
    } else if (_.includes(DMS_VERSION_STORAGEABLE_TYPES, version.version_storageable_type)) {
      const arrowClass = this.state.showDmsVersionData ?
        'menu-down'
      :
        'menu-right'
      return (
        <div style={styles.saved}>
          <div style={styles.savedMessage} onClick={this.toggleMetadata}>
            <i style={styles.menuArrowIcon} className={`mdi mdi-${arrowClass}`}></i>
            <FormattedMessage
              id='category.tree_element.attachment.version.dms_metadata.saved_to_dms'
              values={{
                dms_type: this.props.intl.formatMessage({id: `dms_types.${VERSION_STOREAGEABLE_TYPES_MAP_TO_DMS_TYPES[version.version_storageable_type]}`})
              }}
            />
            <i style={styles.checkMarkIcon} className={'mdi mdi-check'}></i>
          </div>
          {this.buildDmsVersionMetadataHtml()}
        </div>

      )
    } else {
      return (
        <div style={styles.alert}>
          <i style={styles.icon} className={`mdi mdi-alert-circle`}></i>
          <FormattedMessage
            id='category.tree_element.attachment.version.dms_metadata.not_saved_to_dms'
            values={{
              dms_type: this.props.intl.formatMessage({id: `dms_types.${dmsType}`})
            }}
          />
        </div>
      )
    }
  }

  buildDmsVersionMetadata() {
    const { version } = this.props
    switch(version.version_storageable_type){
      case DMS_VERSION_STORAGEABLE_TYPES.NetDocumentsVersionStorage:
        return this.buildNetDocumentsMetaData()
      case DMS_VERSION_STORAGEABLE_TYPES.SeeUnityImanageVersionStorage:
        return  this.buildSeeUnityImanageMetaData()
      case DMS_VERSION_STORAGEABLE_TYPES.Imanage10VersionStorage:
        return this.buildImanage10MetaData()
    }
  }

  buildDmsVersionMetadataHtml() {
    const metadataArray = this.buildDmsVersionMetadata()
    return (
      <div style={styles.metadata(this.state.showDmsVersionData)}>
        <div style={styles.columnOne}>
          {
            metadataArray[0].map((category, index) => (
              <div key={index} style={styles.columnOneValue}>
                {category}
              </div>
            ))
          }
        </div>
        <div style={styles.columnTwo}>
          {
            metadataArray[1].map((value, index) => (
              <div key={index} style={styles.columnTwoValue}>
                {value}
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  buildNetDocumentsMetaData() {
    const { version } = this.props
    const ndVersionObject = _.get(version, 'version_storageable.nd_version_object')
    if (!ndVersionObject) {
      return [[],[]]
    }
    return (
      [
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.name' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.type' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.created_by' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.modified_by' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.version' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.document' />
        ],
        [
          _.get(ndVersionObject, 'document.name'),
          `${DocumentTypes.getDocumentNameString(ndVersionObject.extension)}`,
          `${ndVersionObject.createdBy},  ${moment(ndVersionObject.created).format('DD/MM/YYYY, h:mma')}`,
          `${ndVersionObject.modifiedBy},  ${moment(ndVersionObject.modified).format('DD/MM/YYYY, h:mma')}`,
          ndVersionObject.number,
          _.get(ndVersionObject, 'document.id')
        ]
      ]
    )
  }

  buildSeeUnityImanageMetaData(){
    const { version } = this.props
    const seeUnityImanageVersionObject = _.get(version, 'version_storageable.see_unity_imanage_version_object')
    if (!seeUnityImanageVersionObject || _.isEmpty(seeUnityImanageVersionObject.document)) {
      return [[],[]]
    }
    return (
      [
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.name' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.class' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.author' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.modified_date' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.version' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.document' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.comment' />,
        ],
        [
          _.get(seeUnityImanageVersionObject, 'document.Name'),
          `${DocumentTypes.getDocumentNameString(_.find(seeUnityImanageVersionObject.Properties, { Field: 'Class'}).Value)}`,
          _.find(seeUnityImanageVersionObject.Properties, { Field: 'Author'}).Value,
          moment(_.find(seeUnityImanageVersionObject.Properties, { Field: 'Edit Date'}).Value.replace('T', ' ')).local().format('DD/MM/YYYY, h:mma'),
          seeUnityImanageVersionObject.VersionLabel,
          _.find(seeUnityImanageVersionObject.document.Properties, { Field: 'imProfileDocNum'}).Value,
          _.find(seeUnityImanageVersionObject.document.Properties, { Field: 'imProfileComment'}).Value
        ]
      ]
    )
  }


  buildImanage10MetaData(){
    const { version } = this.props
    const imanage10VersionObject = _.get(version, 'version_storageable.imanage10_version_object')
    if (!imanage10VersionObject || _.isEmpty(imanage10VersionObject.document)) {
      return [[],[]]
    }
    return (
      [
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.name' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.extension' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.author' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.create_date' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.last_user' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.edit_date' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.version' />,
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.document' />
        ],
        [
          _.get(imanage10VersionObject, 'document.name'),
          imanage10VersionObject.extension,
          imanage10VersionObject.author_description,
          moment(imanage10VersionObject.create_date).format('DD/MM/YYYY, h:mma'),
          imanage10VersionObject.last_user_description,
          moment(imanage10VersionObject.edit_date).format('DD/MM/YYYY, h:mma'),
          imanage10VersionObject.version,
          imanage10VersionObject.document_number
        ]
      ]
    )
  }

  toggleMetadata() {
    this.setState({
      showDmsVersionData: !this.state.showDmsVersionData
    })
  }

  render() {
    return (
      <div style={styles.container}>
        {this.buildMetadata()}
      </div>
    )
  }
}

const styles = {
  container: {
    marginTop: '12px',
    color: Colors.text.gray,
    fontSize: '14px',
    flexGrow: 1,
    overflow: 'hidden'
  },
  sending: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingSpinner: {
    height: '16px',
    marginRight: '4px'
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    color: Colors.whiteout.darkGray
  },
  failed: {
    display: 'flex',
    alignItems: 'center',
    color: Colors.whiteout.alert.error
  },
  icon: {
    fontSize: '18px',
    marginRight: '4px'
  },
  metadata: isShown => ({
    display: isShown ? 'flex' : 'none',
    fontSize: '1.2rem',
    fontWeight: 500,
    marginLeft: '2rem'
  }),
  metadataLine: {
    display: 'flex',
    marginBottom: '.4rem',
    overflow: 'hidden',
  },
  columnOne: {
    display: 'flex',
    flexDirection: 'column',
    color: Colors.gray.normal,
    flexShrink: 0
  },
  columnTwo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    color: Colors.gray.darker,
    marginLeft: '8px',
    minWidth: '0'
  },
  columnTwoValue: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  menuArrowIcon: {
    fontSize: '24px',
  },
  savedMessage: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginLeft: '-.6rem' // to make the icon left justify with the rest of the content because it has whitespace
  },
  checkMarkIcon: {
    marginLeft: '.8rem'
  }
}


DmsMetadata.propTypes = {
  dmsType: PropTypes.string,
  intl: intlShape.isRequired,
  version: PropTypes.object.isRequired
}

DmsMetadata = injectIntl(DmsMetadata)

export { DmsMetadata, DMS_VERSION_STORAGEABLE_TYPES }
