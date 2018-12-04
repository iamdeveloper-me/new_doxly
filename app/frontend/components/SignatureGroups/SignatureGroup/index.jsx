import * as Scroll from 'react-scroll'
import { Element , animateScroll as scroll, scroller } from 'react-scroll'
import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import AddCapacityButtons from './AddCapacityButtons/index.jsx'
import BlockCollection from './BlockCollection/index.jsx'
import Colors from 'helpers/Colors'
import EditButton from './EditButton/index.jsx'
import LinkingButtons from './LinkingButtons/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Toggle from 'components/Toggle/index.jsx'

export default class SignatureGroup extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLinking: false,
      showBlocks: true
    }
    this.onToggle =  this.onToggle.bind(this)
    this.setIsLinking = this.setIsLinking.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  onToggle() {
    this.setState({ showBlocks: !this.state.showBlocks })
  }

  onClick() {
    if (this.props.signatureGroup.block_collections.length > 1) {
      scroller.scrollTo(`signature-group-${this.props.signatureGroup.id}`, {
        duration: 1000,
        smooth: true,
        containerId: 'deals-layout-scrollable-container',
        offset: -110
      })
      this.setIsLinking(true)
    }
  }

  setIsLinking(value) {
    this.setState({ isLinking: value })
  }

  render() {
    const { allBlockCollections, allBlocks, allSigningCapacities, linkedBlocks, selectedSignatureGroup, allSignatureEntities, signatureGroup, signatureGroupIsLoading } = this.props
    const { buildBlockCollection, deleteBlockCollection, deleteSignatureGroup, linkBlocks, openModal, setLinkedBlocks, setSelectedBlock, setSelectedFormAndGroup, setSelectedGroup, unlinkBlocks, updateBlockCollection } = this.props
    const { isLinking } = this.state
    const signatureGroupBlockCollections = _.filter(allBlockCollections, blockCollection => ( _.includes(signatureGroup.block_collections, blockCollection.id) ))
    const disabled = signatureGroup.block_collections.length < 2

    return (
      <div>
        <Element name={`signature-group-${signatureGroup.id}`}></Element>
        {isLinking ? <div style={styles.background}></div> : null}
        <div className='whiteout-ui' style={styles.container(isLinking)}>
          <div style={styles.header}>
            <div style={styles.leftHeader}>
              <Toggle
                toggle={this.onToggle}
                expanded={this.state.showBlocks}
              />
              <div style={styles.name}>{signatureGroup.name}</div>
            </div>
            <EditButton
              signatureGroup={signatureGroup}
              openModal={openModal}
              setSelectedGroup={setSelectedGroup}
              deleteSignatureGroup={deleteSignatureGroup}
              isLinking={isLinking}
            />
          </div>
          {signatureGroupIsLoading && (selectedSignatureGroup.id === signatureGroup.id) ?
            <LoadingSpinner />
          :
            <div id="blocks-container" style={styles.blocks(this.state.showBlocks)}>
              {
                _.map((signatureGroupBlockCollections),  blockCollection => (
                  <BlockCollection
                    key={blockCollection.id}
                    blockCollection={blockCollection}
                    deleteBlockCollection={deleteBlockCollection}
                    signatureGroup={signatureGroup}
                    allBlocks={allBlocks}
                    allSignatureEntities={allSignatureEntities}
                    allSigningCapacities={allSigningCapacities}
                    isLinking={isLinking}
                    linkedBlocks={linkedBlocks}
                    unlinkBlocks={unlinkBlocks}
                    buildBlockCollection={buildBlockCollection}
                    updateBlockCollection={updateBlockCollection}
                    setSelectedBlock={setSelectedBlock}
                  />
                ))
              }
            </div>
          }
          {!isLinking ?
            <div style={styles.footer}>
              <AddCapacityButtons
                signatureGroup={signatureGroup}
                setSelectedGroup={setSelectedGroup}
                setSelectedFormAndGroup={setSelectedFormAndGroup}
              />
              <div style={styles.button(disabled)} onClick={this.onClick}>
                <div style={styles.circle(disabled)}>
                  <i className="mdi mdi-link-variant"></i>
                </div>
                <FormattedMessage id='signature_management.blocks.link_blocks' />
              </div>
            </div>
          :
            <LinkingButtons
              linkedBlocks={linkedBlocks}
              linkBlocks={linkBlocks}
              signatureGroup={signatureGroup}
              setLinkedBlocks={setLinkedBlocks}
              setIsLinking={this.setIsLinking}
            />
          }
        </div>
      </div>
    )
  }

}

const styles = {
  container: isLinking => ({
    position: 'relative',
    margin: '2rem',
    border: `solid .1rem ${Colors.whiteout.gray}`,
    backgroundColor: Colors.whiteout.blueGreen,
    zIndex: isLinking ? 10001 : null
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.8rem',
    color: Colors.text.gray,
    padding: '1.6rem 4rem 1.8rem 1rem'
  },
  leftHeader: {
    display: 'flex'
  },
  name: {
    paddingLeft: '1rem'
  },
  blocks: expanded => ({
    display: expanded ? 'flex' : 'none',
    flexWrap: 'wrap',
    padding: '0 3rem 3rem 3rem'
  }),
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 4rem 1.6rem 4rem',
    color: Colors.whiteout.blue
  },
  circle: disabled => ({
    borderRadius: '50%',
    height: '2.4rem',
    width: '2.4rem',
    color: Colors.whiteout.white,
    backgroundColor: Colors.whiteout.blue,
    opacity: disabled ? .65 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginRight: '.4rem'
  }),
  leftButtons: {
    display: 'flex'
  },
  button: disabled => ({
    display: 'flex',
    alignItems: 'center',
    opacity: disabled ? .65 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }),
  background: {
    position: 'absolute',
    backgroundColor: Colors.black,
    zIndex: 10000,
    opacity: .65,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
}

SignatureGroup.defaultProps = {
  selectedSignatureGroup: null
}

SignatureGroup.propTypes = {
  allBlockCollections: PropTypes.object.isRequired,
  allBlocks: PropTypes.object.isRequired,
  allSignatureEntities: PropTypes.object.isRequired,
  allSigningCapacities: PropTypes.object.isRequired,
  linkedBlocks: PropTypes.array.isRequired,
  selectedSignatureGroup: PropTypes.object,
  signatureGroup: PropTypes.object.isRequired,
  signatureGroupIsLoading: PropTypes.bool.isRequired,

  buildBlockCollection: PropTypes.func.isRequired,
  deleteBlockCollection: PropTypes.func.isRequired,
  deleteSignatureGroup: PropTypes.func.isRequired,
  linkBlocks: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  setLinkedBlocks: PropTypes.func.isRequired,
  setSelectedBlock: PropTypes.func.isRequired,
  setSelectedFormAndGroup: PropTypes.func.isRequired,
  setSelectedGroup: PropTypes.func.isRequired,
  unlinkBlocks: PropTypes.func.isRequired,
  updateBlockCollection: PropTypes.func.isRequired
}
