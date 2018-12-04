import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Radio from 'components/Whiteout/Radio/index.jsx'

export default class SaveAs extends React.PureComponent {

  render() {
    const { saveAsType } = this.props
    const { setSaveAsType } = this.props
    return (
      <div style={styles.saveAs}>
        <div style={styles.saveAsTitle}>
          <FormattedMessage id='file_picker.save_as' />
        </div>
        <div style={styles.radioButtons}>
          <Radio
            text={<FormattedMessage id='file_picker.new_document' />}
            checked={saveAsType === 'new_document'}
            onChange={() => setSaveAsType('new_document')}
          />
          <Radio
            text={<FormattedMessage id='file_picker.new_version' />}
            checked={saveAsType === 'new_version'}
            onChange={() => setSaveAsType('new_version')}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  saveAs: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  radioButtons: {
    display: 'flex',
    flexDirection: 'column'
  },
  saveAsTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '.8rem'
  }
}

SaveAs.propTypes = {
  saveAsType: PropTypes.string.isRequired,

  setSaveAsType: PropTypes.func.isRequired
}
