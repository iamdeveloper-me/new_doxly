import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import ConfirmChangesTable from './ConfirmChangesTable/index.jsx'

export default class ConfirmChangesContainer extends React.PureComponent {

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <FormattedMessage id='executed_versions.confirm_changes_description' />
          </div>
          <ConfirmChangesTable documents={this.props.documents} />
        </div>
        <div style={styles.button}>
          <Button
            type='primary'
            text={<FormattedMessage id='buttons.confirm' />}
            onClick={this.props.processDocuments}
          />
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingTop: '20px',
    textAlign: 'left',
    color: Colors.text.gray
  },
  header: {
    flexShrink: 0,
    marginBottom: '32px'
  },
  content: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingBottom: '20px'
  },
  button: {
    textAlign: 'center'
  }
}

ConfirmChangesContainer.propTypes = {
  documents: PropTypes.array.isRequired,

  processDocuments: PropTypes.func.isRequired
}
