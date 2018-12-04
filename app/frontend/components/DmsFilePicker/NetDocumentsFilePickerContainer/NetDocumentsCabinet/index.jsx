import PropTypes from 'prop-types'
import React from 'react'

import Cabinet from 'components/DmsFilePicker/FilePicker/ResourceList/Cabinet/index.jsx'

export default class NetDocumentsCabinet extends React.PureComponent {

  render() {
    const { cabinet } = this.props
    const { getCabinetFolders } = this.props
    return (
      <Cabinet
        imagePath='net-documents-cabinet.svg'
        cabinet={cabinet}
        getCabinetFolders={getCabinetFolders}
      />
    )
  }
}

NetDocumentsCabinet.propTypes = {
  cabinet: PropTypes.object.isRequired,

  getCabinetFolders: PropTypes.func.isRequired
}
