import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Actions from '../Actions/index.jsx'
import BlockAddress from '../BlockAddress/index.jsx'
import Colors from 'helpers/Colors'
import SigningCapacityBlock from '../SigningCapacityBlock/index.jsx'

export default class SignatureEntityBlock extends React.PureComponent {
  constructor(props) {
    super(props)
    this.getSigningCapacities = this.getSigningCapacities.bind(this)
    this.getEntity = this.getEntity.bind(this)
  }

  getSigningCapacities(signingCapacities) {
    return _.map(_.orderBy(signingCapacities, 'placeholder_id', 'asc'), signingCapacity => (
      <SigningCapacityBlock
        key={signingCapacity.id}
        signingCapacity={signingCapacity}
        hasEntity={true}
      />
    ))
  }

  getEntity(signatureEntity) {
    const { allBlocks, hover, isLinking, linkedBlock } = this.props
    const { onDelete, onEdit, onUnlink } = this.props

    if (signatureEntity.ancestry === null) {
      const block = allBlocks[signatureEntity.blockId || signatureEntity.block_id]
      return (
        <div style={styles.rootEntity} key={signatureEntity.id}>
          <div style={styles.name}>{signatureEntity.name}</div>
          {!isLinking ?
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
      )
    } else {
      return (
        <div style={styles.entity} key={signatureEntity.id}>
          <div style={styles.by}>
            <FormattedMessage id='signature_management.blocks.by' />
          </div>
          {signatureEntity.title ?
            <FormattedMessage
              id='signature_management.blocks.entity_name_title'
              values={{ entityName: signatureEntity.name, entityTitle: signatureEntity.title }}
            />
          :
            signatureEntity.name
          }
        </div>
      )
    }
  }

  render() {
    const { signatureEntities, signingCapacities } = this.props
    const primaryAddress = _.filter(_.map(signatureEntities, signatureEntity => (signatureEntity.primary_address)), null)
    const copyToAddress = _.filter(_.map(signatureEntities, signatureEntity => (signatureEntity.copy_to_address)), null)

    return (
      <div>
        <div>
          {_.map(signatureEntities, signatureEntity => this.getEntity(signatureEntity))}
          <div>{this.getSigningCapacities(signingCapacities)}</div>
        </div>
        <BlockAddress
          primaryAddress={primaryAddress[0]}
          copyToAddress={copyToAddress[0]}
        />
      </div>
    )
  }

}

const styles = {
  rootEntity: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '.8rem'
  },
  name: {
    fontWeight: 500
  },
  entity: {
    display: 'flex',
    marginBottom: '.8rem'
  },
  by: {
    marginRight: '.4rem',
    color: Colors.whiteout.moderateGray
  }
}

SignatureEntityBlock.propTypes = {
  allBlocks: PropTypes.object.isRequired,
  hover: PropTypes.bool.isRequired,
  isLinking: PropTypes.bool.isRequired,
  linkedBlock: PropTypes.bool.isRequired,
  signingCapacities: PropTypes.array.isRequired,
  signatureEntities: PropTypes.array.isRequired,

  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired
}
