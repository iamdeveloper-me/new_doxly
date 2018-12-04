import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from 'components/Whiteout/Checkbox/index.jsx'

export default class DocumentCheckbox extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.props.updateSelectedDocuments(this.props.document)
  }

  render() {
    const { document, selectedDocuments } = this.props
    const isChecked = _.filter(selectedDocuments, { document_id: document.document_id }).length > 0

    return (
      <Checkbox
        text={document.document_name}
        checked={isChecked}
        onChange={this.handleChange}
      />
    )
  }

}

DocumentCheckbox.propTypes = {
  document: PropTypes.object.isRequired,
  selectedDocuments: PropTypes.array.isRequired,

  updateSelectedDocuments: PropTypes.func.isRequired
}
