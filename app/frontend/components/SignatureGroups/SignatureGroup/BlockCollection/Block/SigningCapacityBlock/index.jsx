import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Actions from '../Actions/index.jsx'
import BlockAddress from '../BlockAddress/index.jsx'
import Colors from 'helpers/Colors'

export default class SigningCapacityBlock extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { block, hasEntity, hover, isLinking, linkedBlock, signingCapacity } = this.props
    const { onDelete, onEdit, onUnlink } = this.props

    return (
      <div>
        <div style={styles.container(hasEntity)}>
          {hasEntity ?
            <div>
              <div style={styles.entitySigner}>
                <FormattedMessage id='signature_management.blocks.by' />
                <div style={styles.entityLine}></div>
              </div>
              <div style={styles.entityName}>
                {`${signingCapacity.name}, ${signingCapacity.title}`}
              </div>
            </div>
          :
            <div style={styles.individualSigner}>
              <div style={styles.line}></div>
              <div style={styles.individualName}>
                {signingCapacity.name}
              </div>
            </div>
          }
          <div>
            {!isLinking && !hasEntity ?
              <Actions
                hover={hover}
                linkedBlock={linkedBlock}
                onDelete={() => onDelete()}
                onEdit={() => onEdit(block)}
                onUnlink={() => onUnlink(block)}
              />
            :
              null
            }
          </div>
        </div>
        <BlockAddress
          primaryAddress={signingCapacity.primary_address}
          copyToAddress={signingCapacity.copy_to_address}
        />
      </div>
    )
  }

}

const styles = {
  container: hasEntity => ({
    display: hasEntity ? 'block' : 'flex',
    justifyContent: 'space-between'
  }),
  individualSigner: {
    width: '65%'
  },
  entitySigner: {
    display: 'flex'
  },
  entityLine: {
    borderBottom: `.1rem solid ${Colors.black}`,
    paddingTop: '1.6rem',
    width: '75%'
  },
  line: {
    borderBottom: `.1rem solid ${Colors.black}`,
    paddingTop: '1.6rem'
  },
  entityName: {
    fontWeight: 500,
    margin: '.8rem 0 0 2rem'
  },
  individualName: {
    fontWeight: 500,
    margin: '.8rem 0 0 0'
  }
}

SigningCapacityBlock.defaultProps = {
  hasEntity: false
}

SigningCapacityBlock.propTypes = {
  block: PropTypes.object,
  hasEntity: PropTypes.bool,
  hover: PropTypes.bool,
  isLinking: PropTypes.bool,
  linkedBlock: PropTypes.bool,
  signingCapacity: PropTypes.object.isRequired,

  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onUnlink: PropTypes.func
}
