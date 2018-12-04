import {
  injectIntl,
  intlShape
} from 'react-intl'
import { normalize, schema } from 'normalizr'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Badge from 'components/Badge/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import UnmatchedSignaturePagesSidebar from './UnmatchedSignaturePagesSidebar/index.jsx'
import { SIGNATURE_PACKET_TYPES } from 'helpers/Enums'

class UnmatchedSignaturePages extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      uploadsLoading: true,
      signersLoading: true,
      signers: {},
      signingCapacities: {},
      signatureEntities: {},
      signatureGroups: {},
      signaturePages: {},
      treeElements: {},
      signaturePackets: {},
      unmatchedSignatureUploads: {},
      unmatchedSignatureUploadPages: {},
      unmatchedSidebarOpen: false
    }
    this.fetchData = this.fetchData.bind(this)
    this.hideUnmatchedSidebar = this.hideUnmatchedSidebar.bind(this)
    this.showUnmatchedSidebar = this.showUnmatchedSidebar.bind(this)
    this.manuallyMatch = this.manuallyMatch.bind(this)
    this.undoManuallyMatched = this.undoManuallyMatched.bind(this)
    this.removeUpload = this.removeUpload.bind(this)
    this.undoRemovedUpload = this.undoRemovedUpload.bind(this)

    App.React.FetchUnmatchedSignaturePagesData = this.fetchData
  }

  fetchData() {
    const params = Params.fetch()
    Api.get(Routes.dealUnmatchedSignatureUploads(params.deals, ['unmatched_signature_upload_pages.signature_page.signature_packet', 'unmatched_signature_upload_pages.signature_page.tree_element', 'uploader.user', 'unmatched_signature_upload_pages.url']))
      .then((unmatchedSignatureUploads) => {
        this.normalizeUnmatchedSignatureUploads(unmatchedSignatureUploads)
      })
      .catch(error => ErrorHandling.setErrors(error))

    Api.get(Routes.dealSigners(params.deals, ['signing_capacities.signature_pages.signature_packet', 'signing_capacities.signature_pages.tree_element', 'signing_capacities.signature_group.signature_entities', 'signing_capacities.signature_entity']))
      .then((signers) => {
        this.normalizeSigners(signers)
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  normalizeSigners(signers) {
    // schemas must be defined because they can be used, so we have to define them in the opposite order from when they will appear
    const normalizedData = normalize(signers, [ signer ])
    const updatedState = _.merge({}, this.state, normalizedData.entities, { signersLoading: false })
    this.setState(updatedState)
  }

  normalizeUnmatchedSignatureUploads(unmatchedSignatureUploads) {
    const normalizedData = normalize(unmatchedSignatureUploads, [ unmatchedSignatureUpload ])
    const updatedState = _.merge({}, this.state, normalizedData.entities, { uploadsLoading: false })
    this.setState(updatedState)
  }

  manuallyMatch(unmatchedSignatureUploadId, unmatchedSignatureUploadPageId, signaturePageId) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)

    // update unmatched signature upload page
    let unmatchedSignatureUploadPages = _.cloneDeep(this.state.unmatchedSignatureUploadPages)
    let unmatchedSignatureUploadPage = unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]
    unmatchedSignatureUploadPage.status = 'manually_matched'
    unmatchedSignatureUploadPage.signature_page = signaturePageId

    // update signature page
    let signaturePages = _.cloneDeep(this.state.signaturePages)
    let signaturePage = signaturePages[signaturePageId]
    signaturePage.signature_status = 'signed'
    App.SignaturePackets.markAsSigned(signaturePage.id)

    // update an 'opened' signature pages in the same packet
    _.each(_.filter(signaturePages, { signature_packet: signaturePage.signature_packet, signature_status: 'opened' }), signaturePage => {
      let signaturePacket = _.find(this.state.signaturePackets, { id: signaturePage.signature_packet })
      if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.email.name) {
        signaturePage.signature_status = 'awaiting_signature'
        App.SignaturePackets.markAsAwaitingSignature(signaturePage.id)
      } else if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.link.name) {
        signaturePage.signature_status = 'link_ready'
        App.SignaturePackets.markAsLinkReady(signaturePage.id)
      } else if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.download.name) {
        signaturePage.signature_status = 'download_ready'
        App.SignaturePackets.markAsDownloadReady(signaturePage.id)
      }
    })

    // update state
    this.setState({
      unmatchedSignatureUploadPages,
      signaturePages
    })

    // API call
    Api.put(Routes.dealUnmatchedSignatureUploadUnmatchedSignaturePageManuallyMatch(params.deals, unmatchedSignatureUploadId, unmatchedSignatureUploadPageId), { signature_page_id: signaturePageId })
      .catch(error => ErrorHandling.setErrors(error, () => this.setState(prevState)))
  }

  undoManuallyMatched(unmatchedSignatureUploadId, unmatchedSignatureUploadPageId) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)

    let unmatchedSignatureUploadPages = _.cloneDeep(this.state.unmatchedSignatureUploadPages)
    let unmatchedSignatureUploadPage = unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]

    // update signature page
    let signaturePages = _.cloneDeep(this.state.signaturePages)
    let signaturePage = signaturePages[unmatchedSignatureUploadPage.signature_page]
    let signaturePacket = _.find(this.state.signaturePackets, { id: signaturePage.signature_packet })
    if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.email.name) {
      signaturePage.signature_status = 'awaiting_signature'
      App.SignaturePackets.markAsAwaitingSignature(signaturePage.id)
    } else if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.link.name) {
      signaturePage.signature_status = 'link_ready'
      App.SignaturePackets.markAsLinkReady(signaturePage.id)
    } else if (signaturePacket.packet_type === SIGNATURE_PACKET_TYPES.download.name) {
      signaturePage.signature_status = 'download_ready'
      App.SignaturePackets.markAsDownloadReady(signaturePage.id)
    }

    // update unmatched signature page
    unmatchedSignatureUploadPage.status = 'unmatched'
    unmatchedSignatureUploadPage.signature_page = null

    // update state
    this.setState({
      unmatchedSignatureUploadPages,
      signaturePages
    })

    // API call
    Api.put(Routes.dealUnmatchedSignatureUploadUnmatchedSignaturePageUndoManuallyMatched(params.deals, unmatchedSignatureUploadId, unmatchedSignatureUploadPageId))
      .catch(error => ErrorHandling.setErrors(error, () => this.setState(prevState)))
  }

  removeUpload(unmatchedSignatureUploadId) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    const unmatchedSignatureUploadPages = _.cloneDeep(this.state.unmatchedSignatureUploadPages)
    const uploadToBeRemoved = this.state.unmatchedSignatureUploads[unmatchedSignatureUploadId]
    _.each(uploadToBeRemoved.unmatched_signature_upload_pages, unmatchedSignatureUploadPageId => {
      const unmatchedSignatureUploadPage = unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]
      if (unmatchedSignatureUploadPage.status === 'unmatched') {
        unmatchedSignatureUploadPage.status = 'removed'
      }
    })
    this.setState({ unmatchedSignatureUploadPages })

    Api.put(Routes.dealUnmatchedSignatureUploadRemove(params.deals, unmatchedSignatureUploadId))
      .catch(error => ErrorHandling.setErrors(error, () => this.setState(prevState)))
  }

  undoRemovedUpload(unmatchedSignatureUploadId) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    const unmatchedSignatureUploadPages = _.cloneDeep(this.state.unmatchedSignatureUploadPages)
    const uploadToBeRestored = this.state.unmatchedSignatureUploads[unmatchedSignatureUploadId]
    _.each(uploadToBeRestored.unmatched_signature_upload_pages, unmatchedSignatureUploadPageId => {
      const unmatchedSignatureUploadPage = unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]
      if (unmatchedSignatureUploadPage.status === 'removed') {
        unmatchedSignatureUploadPage.status = 'unmatched'
      }
    })
    this.setState({ unmatchedSignatureUploadPages })

    Api.put(Routes.dealUnmatchedSignatureUploadUndoRemoved(params.deals, unmatchedSignatureUploadId))
      .catch(error => ErrorHandling.setErrors(error, () => this.setState(prevState)))
  }

  componentDidMount() {
    this.fetchData()
  }

  hideUnmatchedSidebar() {
    this.setState({ unmatchedSidebarOpen: false })
  }
  showUnmatchedSidebar() {
    this.setState({ unmatchedSidebarOpen: true })
  }

  render() {
    const { intl } = this.props

    const unmatchedSignatureUploadPagesCount = _.size(_.filter(this.state.unmatchedSignatureUploadPages, { status: 'unmatched' }))
    const hasUnmatchedSignaturePages = !_.isEmpty(this.state.unmatchedSignatureUploadPages)

    return (
      <div className='whiteout-ui'>
        <div style={styles.button}>
          <Button
            type='secondary'
            icon='file'
            disabled={!hasUnmatchedSignaturePages}
            tooltip={hasUnmatchedSignaturePages ? '' : intl.formatMessage({ id: 'unmatched_signature_pages.no_unmatched_signature_pages' })}
            onClick={this.showUnmatchedSidebar}
          />
          {unmatchedSignatureUploadPagesCount > 0 ?
            <div style={styles.badge}>
              <Badge>
                {unmatchedSignatureUploadPagesCount}
              </Badge>
            </div>
          :
            null
          }
        </div>
        <UnmatchedSignaturePagesSidebar
          shown={this.state.unmatchedSidebarOpen}
          hide={this.hideUnmatchedSidebar}
          loading={this.state.uploadsLoading && this.state.signersLoading}
          signers={this.state.signers}
          signingCapacities={this.state.signingCapacities}
          signatureEntities={this.state.signatureEntities}
          signatureGroups={this.state.signatureGroups}
          signaturePages={this.state.signaturePages}
          treeElements={this.state.treeElements}
          unmatchedSignatureUploads={this.state.unmatchedSignatureUploads}
          unmatchedSignatureUploadPages={this.state.unmatchedSignatureUploadPages}
          manuallyMatch={this.manuallyMatch}
          undoManuallyMatched={this.undoManuallyMatched}
          removeUpload={this.removeUpload}
          undoRemovedUpload={this.undoRemovedUpload}
        />
      </div>
    )
  }
}
const signaturePacket = new schema.Entity('signaturePackets')
const treeElement = new schema.Entity('treeElements')
const signatureEntity = new schema.Entity('signatureEntities')
const signatureGroup = new schema.Entity('signatureGroups', {
  signature_entities: [ signatureEntity ]
})
const signaturePage = new schema.Entity('signaturePages', {
  signature_packet: signaturePacket,
  tree_element: treeElement
}, {
  processStrategy: (value, parent, key) => (_.assign(
    value,
    {
      signing_capacity: parent.id,
      signature_group: parent.signature_group,
      signer: parent.signer
    }
  ))
})
const signingCapacity = new schema.Entity('signingCapacities', {
  signature_group: signatureGroup,
  signature_entity: signatureEntity,
  signature_pages: [ signaturePage ],
}, {
  processStrategy: (value, parent, key) => (_.assign(
    value,
    {
      signer: parent.id
    }
  ))
})
const signer = new schema.Entity('signers', {
  signing_capacities: [ signingCapacity ]
})

const unmatchedSignatureUploadPage = new schema.Entity('unmatchedSignatureUploadPages', {
  signature_page: signaturePage
})
const unmatchedSignatureUpload = new schema.Entity('unmatchedSignatureUploads', {
  unmatched_signature_upload_pages: [ unmatchedSignatureUploadPage ],
})

const styles = {
  button: {
    marginLeft: '1.0rem'
  },
  badge: {
    position: 'absolute',
    top: '-0.4rem',
    right: '0.4rem'
  }
}

UnmatchedSignaturePages.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(UnmatchedSignaturePages)
