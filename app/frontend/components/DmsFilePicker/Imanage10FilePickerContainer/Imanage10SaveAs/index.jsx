import PropTypes from 'prop-types'
import React from 'react'

import SaveAs from 'components/DmsFilePicker/FilePicker/FileForm/SaveAs/index.jsx'

export default class Imanage10SaveAs extends React.PureComponent {

  render() {
    return (
      <SaveAs
        saveAsType={this.props.saveAsType}
        setSaveAsType={this.props.setSaveAsType}
      />
    )
  }
}


Imanage10SaveAs.propTypes = {
  saveAsType: PropTypes.string.isRequired,

  setSaveAsType: PropTypes.func.isRequired
}
