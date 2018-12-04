import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Block from './Block/index.jsx'
import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import Colors from 'helpers/Colors'

export default class BlockCollection extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      blockStructure: []
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.blockStructure = this.blockStructure.bind(this)
    this.getEntitySigningCapacities = this.getEntitySigningCapacities.bind(this)
  }

  componentDidMount() {
    this.setState({
      blockStructure: this.blockStructure()
    })
  }

  componentDidUpdate(prevProps) {
    if ((this.props.blockCollection !== prevProps.blockCollection) || (this.props.allSignatureEntities !== prevProps.allSignatureEntities) || (this.props.allSigningCapacities !== prevProps.allSigningCapacities)) {
      this.setState({
        blockStructure: this.blockStructure()
      })
    }
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  onClick() {
    if (this.props.isLinking) {
      this.props.buildBlockCollection(this.props.blockCollection)
    }
  }

  onCheck() {
    const { blockCollection } = this.props
    const updatedBlockCollection = _.assign(blockCollection, { is_consolidated: !blockCollection.is_consolidated })

    this.props.updateBlockCollection(updatedBlockCollection, this.props.signatureGroup)
  }

  getPrimaryAddress(primaryAddress) {
    const address = {}

    if (primaryAddress) {
      address['address_line_one'] = primaryAddress.address_line_one
      address['address_line_two'] = primaryAddress.address_line_two
      address['city'] = primaryAddress.city
      address['state_or_province'] = primaryAddress.state_or_province
      address['postal_code'] = primaryAddress.postal_code
    }
    return address
  }

  getCopyToAddress(copyToAddress) {
    const address = {}

    if (copyToAddress) {
      address['address_line_one_2'] = copyToAddress.address_line_one
      address['address_line_two_2'] = copyToAddress.address_line_two
      address['city_2'] = copyToAddress.city
      address['state_or_province_2'] = copyToAddress.state_or_province
      address['postal_code_2'] = copyToAddress.postal_code
    }
    return address
  }

  getEntities(entity, signatureEntities) {
    signatureEntities.push(entity)

    if (!_.isEmpty(entity.children)) {
      this.getEntities(entity.children[0], signatureEntities)
    }
    return signatureEntities
  }

  getSigners(currentEntitySigners, index, rootEntity, signatureEntitySigners) {
    const { allSignatureEntities, blockCollection } = this.props
    const currentEntityPrimaryAddress = this.getPrimaryAddress(rootEntity.primary_address)
    const currentEntityCopyToAddress = this.getCopyToAddress(rootEntity.copy_to_address)
    let signatureEntities = []
    this.getEntities(rootEntity, signatureEntities)

    if (blockCollection.is_consolidated) {
      _.map(_.flatten(signatureEntitySigners), (entitySigners, i) => {
        if (i !== index) {
          let rootEntity = allSignatureEntities[entitySigners['signatureEntity'].root.id]
          const signingCapacities = entitySigners['signingCapacities']

          const currentEntityUsers = _.map(currentEntitySigners, entitySigner => {
            return _.isObject(entitySigner.user) ? entitySigner.user.id : entitySigner.user
          })

          const entityUsers = _.map(signingCapacities, signingCapacity => {
            return _.isObject(signingCapacity.user) ? signingCapacity.user.id : signingCapacity.user
          })

          // check to see if equal (user, title, address)
          const equalTitles = _.isEqual(_.map(signingCapacities, 'title').sort(), _.map(currentEntitySigners, 'title').sort())
          const entityPrimaryAddress = this.getPrimaryAddress(rootEntity.primary_address)
          const entityCopyToAddress = this.getCopyToAddress(rootEntity.copy_to_address)
          const equalUsers = _.isEqual(entityUsers.sort(), currentEntityUsers.sort())
          const equalPrimaryAddresses = _.isEqual(currentEntityPrimaryAddress, entityPrimaryAddress)
          const equalCopyToAddresses = _.isEqual(currentEntityCopyToAddress, entityCopyToAddress)

          if (equalUsers && equalTitles && equalPrimaryAddresses && equalCopyToAddresses) {
            rootEntity = allSignatureEntities[entitySigners['signatureEntity'].root.id]
            this.getEntities(rootEntity, signatureEntities)
            signatureEntitySigners.splice(i, 1)
          }
        }
      })
    }
    return signatureEntities
  }

  getEntitySigningCapacities(signatureEntity) {
    const { allSigningCapacities } = this.props
    const entitySigners = []
    // get the entity in block that has signing capacities
    if (_.isEmpty(signatureEntity.signing_capacities) && !_.isEmpty(signatureEntity.children)) {
      return this.getEntitySigningCapacities(signatureEntity.children[0])
    } else {
      if (_.isObject(signatureEntity.signing_capacities[0])) {
        entitySigners.push({
          signingCapacities: signatureEntity.signing_capacities,
          signatureEntity
        })
      } else {
        entitySigners.push({
          signingCapacities: _.map((signatureEntity.signing_capacities), signingCapacityId => allSigningCapacities[signingCapacityId]),
          signatureEntity
        })
      }
    }
    return entitySigners
  }

  blockStructure() {
    const { blockCollection, allBlocks, allSignatureEntities, allSigningCapacities } = this.props
    const blockCollectionBlocks = _.filter(allBlocks, block => (_.includes(blockCollection.blocks, block.id)))
    const blockStructure = []
    const signatureEntitySigners = []
    const includedEntities = []

    _.map(blockCollectionBlocks, block => {
      if (!_.isEmpty(block.signature_entity)) {
        signatureEntitySigners.push(this.getEntitySigningCapacities(allSignatureEntities[block.signature_entity]))
      } else {
        return (
          blockStructure.push({
            signingCapacity: allSigningCapacities[block.signing_capacity],
            block: block,
            signatureEntities: null,
            position: block.position
          })
        )
      }
    })

    _.map(_.flatten(signatureEntitySigners), (signers, i) => {
      if (signers !== undefined) {
        const signingCapacities = signers['signingCapacities']
        const signatureEntity = signers['signatureEntity']
        const rootEntity = allSignatureEntities[signatureEntity.root.id]
        const signatureEntities = this.getSigners(signingCapacities, i, rootEntity, _.flatten(signatureEntitySigners))
        const position = allBlocks[signatureEntity.root.block_id].position
        let included = _.filter(signatureEntities, entity => entity.ancestry === null)
        included.splice(0, 1)
        includedEntities.push(included)

        if (!_.includes(_.flatten(includedEntities), rootEntity)) {
          return (
            blockStructure.push({
              signingCapacities,
              signatureEntities,
              position
            })
          )

        }

      }
    })
    return _.sortBy(blockStructure, 'position')
  }

  render() {
    const { allSigningCapacities, blockCollection, allBlocks, isLinking, linkedBlocks, signatureGroup } = this.props
    const { deleteBlockCollection, setSelectedBlock, unlinkBlocks } = this.props
    const position = linkedBlocks.map(block => block.id).indexOf(blockCollection.id) + 1

    return (
      <div
        style={styles.container}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <div style={styles.button(isLinking)}>
          <div style={styles.circle(position > 0)}>
            {position}
          </div>
        </div>
        <div style={styles.blocks}>
          {
            _.map(this.state.blockStructure, (block, i) => (
              <Block
                key={`block-${i}`}
                block={block}
                blockCollection={blockCollection}
                allBlocks={allBlocks}
                blocks={blockCollection.blocks}
                signatureGroup={signatureGroup}
                hover={this.state.hover}
                deleteBlockCollection={deleteBlockCollection}
                isLinking={isLinking}
                unlinkBlocks={unlinkBlocks}
                allSigningCapacities={allSigningCapacities}
                linkedBlock={blockCollection.blocks.length > 1}
                setSelectedBlock={setSelectedBlock}
              />
            ))
          }
        </div>
        <div style={styles.checkboxContainer(blockCollection.has_sent_packets)}>
          {this.state.hover && !isLinking ?
            <div style={styles.checkbox}>
              <Checkbox
                text={<FormattedMessage id='signature_management.blocks.consolidate' />}
                checked={blockCollection.is_consolidated}
                disabled={blockCollection.has_sent_packets}
                onChange={this.onCheck}
              />
            </div>
          :
            null
          }
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '37rem',
    backgroundColor: Colors.whiteout.white,
    border: `.1rem solid ${Colors.gray.light}`,
    borderRadius: '.2rem',
    cursor: 'pointer',
    margin: '1rem'
  },
  blocks: {
    padding: '2rem 2rem 0 2rem'
  },
  button: isLinking => ({
    display: isLinking ? 'flex' : 'none',
    justifyContent: 'flex-end'
  }),
  circle: position => ({
    borderRadius: '50%',
    border: `.1rem solid ${Colors.gray.normal}`,
    height: '2.4rem',
    width: '2.4rem',
    color: Colors.whiteout.white,
    backgroundColor: position ? Colors.whiteout.blue : Colors.whiteout.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    margin: '.8rem .8rem 0 0'
  }),
  checkboxContainer: disabled => ({
    width: '100%',
    height: '4rem',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }),
  checkbox: {
    display: 'flex',
    height: '100%',
    width: '100%',
    paddingLeft: '2rem',
    alignItems: 'center',
    backgroundColor: Colors.whiteout.crystal,
    borderTop: `solid 1px ${Colors.whiteout.gray}`
  }
}

BlockCollection.propTypes = {
  blockCollection: PropTypes.object.isRequired,
  allBlocks: PropTypes.object.isRequired,
  allSignatureEntities: PropTypes.object.isRequired,
  allSigningCapacities: PropTypes.object.isRequired,
  isLinking: PropTypes.bool.isRequired,
  linkedBlocks: PropTypes.array.isRequired,
  signatureGroup: PropTypes.object.isRequired,

  buildBlockCollection: PropTypes.func.isRequired,
  deleteBlockCollection: PropTypes.func.isRequired,
  setSelectedBlock: PropTypes.func.isRequired,
  unlinkBlocks: PropTypes.func.isRequired,
  updateBlockCollection: PropTypes.func.isRequired
}
