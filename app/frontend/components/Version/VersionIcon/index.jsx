import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class VersionIcon extends React.PureComponent {

  getIconPath(type) {
    const genericPath = { file_name: 'ic-document-generic' }
    const iconMap = [
      // specific
      { file_name: "ic-document-pdf", file_types: ['.pdf'] },
      { file_name: "ic-document-doc", file_types: ['.doc', '.docx'] },
      { file_name: "ic-document-xlsx", file_types: ['.xlr', '.xls', '.xlsx'] },

      // generic
      { file_name: "ic-document-generic-text", file_types: ['.log', '.msg', '.odt', '.pages', '.rtf', '.tex', '.txt', '.wpd', '.wps'] },
      { file_name: "ic-document-generic-spreadsheet", file_types: ['.csv', '.dat', '.ged'] },
      { file_name: "ic-document-generic-img", file_types: ['.ai', '.bmp', '.eps', '.gif', '.jpeg', '.jpg', '.png', '.psd', '.svg', '.tif', '.tiff'] }
    ]
    return (_.find(iconMap, { file_types: [type] }) || genericPath).file_name
  }

  render() {
    const { type } = this.props
    const path = this.getIconPath(type)
    return (
      <img src={Assets.getPath(`${path}.svg`)} style={styles.icon} />
    )
  }

}

const styles = {
  icon: {
    height: '36px'
  }
}


VersionIcon.propTypes = {
  type: PropTypes.string
}
