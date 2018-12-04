import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import SignatureEntityBlock from './SignatureEntityBlock/index.jsx'
import SigningCapacityBlock from './SigningCapacityBlock/index.jsx'

export default class Block extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onUnlink = this.onUnlink.bind(this)
  }

  onDelete() {
    this.props.deleteBlockCollection(this.props.blockCollection, this.props.signatureGroup)
  }

  onEdit(block) {
    if (block.signature_entity !== null) {
      this.props.setSelectedBlock(block)
    } else {
      this.props.setSelectedBlock(block)
    }
  }

  onUnlink(block) {
    this.props.unlinkBlocks(block, this.props.blockCollection, this.props.signatureGroup)
  }

  render() {
    const { allBlocks, allSigningCapacities, block, hover, isLinking, linkedBlock } = this.props
    return (
      <div style={styles.container}>
        {!_.isEmpty(block.signatureEntities) ?
          <SignatureEntityBlock
            signatureEntities={block.signatureEntities}
            signingCapacities={block.signingCapacities}
            hover={hover}
            linkedBlock={linkedBlock}
            isLinking={isLinking}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
            onUnlink={this.onUnlink}
            allBlocks={allBlocks}
          />
        :
          <SigningCapacityBlock
            signingCapacity={allSigningCapacities[block.signingCapacity.id]}
            block={block.block}
            hover={hover}
            linkedBlock={linkedBlock}
            isLinking={isLinking}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
            onUnlink={this.onUnlink}
          />
        }
      </div>
    )
  }

}

const styles = {
  container: {
    marginBottom: '2.4rem'
  },
  header: {
    height: '2rem'
  },
  actions: hover => ({
    display: hover ? 'flex' : 'none',
    paddingTop: '.8rem',
    justifyContent: 'flex-end'
  }),
  remove: {
    paddingRight: '1.2rem',
    color: Colors.whiteout.alert.error
  },
  edit: {
    color: Colors.whiteout.blue
  }
}

Block.propTypes = {
  block: PropTypes.object.isRequired,
  allBlocks: PropTypes.object.isRequired,
  allSigningCapacities: PropTypes.object.isRequired,
  blockCollection: PropTypes.object.isRequired,
  hover: PropTypes.bool.isRequired,
  isLinking: PropTypes.bool.isRequired,
  linkedBlock: PropTypes.bool.isRequired,
  signatureGroup: PropTypes.object.isRequired,

  deleteBlockCollection: PropTypes.func.isRequired,
  setSelectedBlock: PropTypes.func.isRequired,
  unlinkBlocks: PropTypes.func.isRequired
}
