import PropTypes from 'prop-types'
import React from 'react'

import SaveAs from 'components/DmsFilePicker/FilePicker/FileForm/SaveAs/index.jsx'

export default class SeeUnityImanageSaveAs extends React.PureComponent {

  render() {
    return (
      <SaveAs
        saveAsType={this.props.saveAsType}
        setSaveAsType={this.props.setSaveAsType}
      />
    )
  }
}


SeeUnityImanageSaveAs.propTypes = {
  saveAsType: PropTypes.string.isRequired,

  setSaveAsType: PropTypes.func.isRequired
}
