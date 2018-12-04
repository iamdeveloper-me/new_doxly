import PropTypes from 'prop-types'
import React from 'react'

import SaveAs from 'components/DmsFilePicker/FilePicker/FileForm/SaveAs/index.jsx'

export default class NetDocumentsSaveAs extends React.PureComponent {

  render() {
    return (
      <SaveAs
        saveAsType={this.props.saveAsType}
        setSaveAsType={this.props.setSaveAsType}
      />
    )
  }
}


NetDocumentsSaveAs.propTypes = {
  saveAsType: PropTypes.string.isRequired,

  setSaveAsType: PropTypes.func.isRequired
}
