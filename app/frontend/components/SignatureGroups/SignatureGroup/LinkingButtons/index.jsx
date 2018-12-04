import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

class LinkingButtons extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onLink = this.onLink.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onLink() {
    this.props.linkBlocks(this.props.linkedBlocks, this.props.signatureGroup)
    this.props.setIsLinking(false)
  }

  onCancel() {
    this.props.setIsLinking(false)
    this.props.setLinkedBlocks([])
  }

  render() {
    return (
      <div style={styles.container}>
        <FormattedMessage id='signature_management.blocks.link_blocks_explanation' />
        <div style={styles.buttons}>
          <Button
            type='secondary'
            onClick={this.onCancel}
            text={<FormattedMessage id='buttons.cancel' />}
          />
          <div style={styles.button}>
            <Button
              disabled={this.props.linkedBlocks.length < 2}
              type='primary'
              text={<FormattedMessage id='buttons.link' />}
              onClick={this.onLink}
            />
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: '0 4rem 1.6rem 0'
  },
  buttons: {
    display: 'flex',
    marginLeft: '2.4rem'
  },
  button: {
    marginLeft: '2.4rem'
  }
}

LinkingButtons.propTypes = {
  linkedBlocks: PropTypes.array.isRequired,
  signatureGroup: PropTypes.object.isRequired,

  linkBlocks: PropTypes.func.isRequired,
  setIsLinking: PropTypes.func.isRequired,
  setLinkedBlocks: PropTypes.func.isRequired
}

export default LinkingButtons
