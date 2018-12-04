import _ from 'lodash'
import Cookies from 'js-cookie'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import AddSignaturePacketReviewDocuments from './AddSignaturePacketReviewDocuments/index.jsx'
import Alert from 'components/Whiteout/Alert/index.jsx'
import Api from 'helpers/Api'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import ConfirmSendSignaturePacket from './ConfirmSendSignaturePacket/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'components/Whiteout/Modal/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import { SIGNATURE_PACKET_TYPES } from 'helpers/Enums'

class SendSignaturePacketWizard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      manualSignaturePages: [],
      docusignSignaturePages: [],
      manualSignaturePacketReviewDocuments: [],
      docusignSignaturePacketReviewDocuments: [],
      user: null,
      selectedStage: null,
      showModal: false,
      hasRecipients: false,
      packetType: SIGNATURE_PACKET_TYPES.email,
      hasInvalidCopyTo: false,
      onlySignaturePagesIdsManual: [],
      onlySignaturePagesIdsDocusign: [],
      sending: false,
      emailInformation: {
        copy_to: '',
        message: ''
      }
    }
    this.getReadySignaturePages = this.getReadySignaturePages.bind(this)
    this.getUser = this.getUser.bind(this)
    this.createSignaturePacketReviewDocumentFromChecklist = this.createSignaturePacketReviewDocumentFromChecklist.bind(this)
    this.createSignaturePacketReviewDocumentFromUploads = this.createSignaturePacketReviewDocumentFromUploads.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.isValidCopyTo = this.isValidCopyTo.bind(this)
    this.setHasRecipients = this.setHasRecipients.bind(this)
    this.setPacketType = this.setPacketType.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onSignatureOnly = this.onSignatureOnly.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onSend = this.onSend.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
    this.getSignaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments.bind(this)
  }

  componentDidMount() {
    this.getUser()
    this.getReadySignaturePages()
  }

  getReadySignaturePages() {
    const params = Params.fetch()
    Api.get(Routes.dealSignaturePagesReadyToSend(params.deals, this.props.userId, ['signature_page_collection.tree_element_signature_group.tree_element.attachment.latest_version']))
      .then((signaturePages) => {
        // sort into manual and docusign
        const manualSignaturePages = signaturePages.filter(signaturePage => signaturePage.signature_page_collection.tree_element_signature_group.tree_element.sign_manually)
        const docusignSignaturePages = signaturePages.filter(signaturePage => !signaturePage.signature_page_collection.tree_element_signature_group.tree_element.sign_manually)
        const uniqManualSignaturePages = _.uniqBy(manualSignaturePages, signaturePage => signaturePage.signature_page_collection.tree_element_signature_group.tree_element.id)
        const uniqDocusignSignaturePages = _.uniqBy(docusignSignaturePages, signaturePage => signaturePage.signature_page_collection.tree_element_signature_group.tree_element.id)
        // create the initial signaturePageReviewDocuments for existing signature pages
        const manualSignaturePacketReviewDocuments = uniqManualSignaturePages.map(manualSignaturePage => ({ tree_element_id: manualSignaturePage.signature_page_collection.tree_element_signature_group.tree_element.id, name: manualSignaturePage.signature_page_collection.tree_element_signature_group.tree_element.name, type: 'signature_page', version_position: this.getVersionPosition(manualSignaturePage.signature_page_collection.tree_element_signature_group.tree_element) }))
        const docusignSignaturePacketReviewDocuments = uniqDocusignSignaturePages.map(docusignSignaturePage => ({ tree_element_id: docusignSignaturePage.signature_page_collection.tree_element_signature_group.tree_element.id, name: docusignSignaturePage.signature_page_collection.tree_element_signature_group.tree_element.name, type: 'signature_page', version_position: this.getVersionPosition(docusignSignaturePage.signature_page_collection.tree_element_signature_group.tree_element) }))
        const selectedStage = docusignSignaturePages.length > 0 ? 'docusign_packet' : 'manual_packet'
        this.setState({
          manualSignaturePages: uniqManualSignaturePages,
          docusignSignaturePages: uniqDocusignSignaturePages,
          manualSignaturePacketReviewDocuments: manualSignaturePacketReviewDocuments,
          docusignSignaturePacketReviewDocuments: docusignSignaturePacketReviewDocuments,
          selectedStage: selectedStage,
          showModal: true
        })
      })
      .catch(() => {
        ErrorHandling.setErrors({ messages: { errors: [this.buildPacketsError()] } }, this.hideModal)
      })
  }

  getUser() {
    const params = Params.fetch()
    Api.get(Routes.dealSigner(params.deals, this.props.userId, ['signing_capacities']))
      .then((user) => {
        this.setState({ user })
      })
      .catch(() => {
        ErrorHandling.setErrors({ messages: { errors: [this.buildPacketsError()] } }, this.hideModal)
      })
  }

  packetsCount() {
    const anyManual = !_.isEmpty(this.state.manualSignaturePages)
    const anyDocusign = !_.isEmpty(this.state.docusignSignaturePages)
    return (anyManual && anyDocusign) ? 2 : 1
  }

  getVersionPosition(treeElement) {
    const attachment = treeElement.attachment
    if (attachment && attachment.latest_version) {
      return attachment.latest_version.position
    } else {
      return null
    }
  }

  hideModal(){
    this.setState({
      manualSignaturePages: [],
      docusignSignaturePages: [],
      manualSignaturePacketReviewDocuments: [],
      docusignSignaturePacketReviewDocuments: [],
      user: null,
      selectedStage: null,
      showModal: false,
      hasRecipients: false,
      hasInvalidCopyTo: false,
      onlySignaturePagesIdsManual: [],
      onlySignaturePagesIdsDocusign: [],
      sending: false,
      emailInformation: {
        copy_to: '',
        message: ''
      }
    })
    // using jquery to remove the full-screen overlay that the react modal renders into.
    $('.full-screen').remove()
  }

  onBack(){
    const onePacketType = !_.isEmpty(this.state.manualSignaturePages) ? 'manual_packet' : 'docusign_packet'
    const back = {
      manual_packet: 'docusign_packet',
      confirm_send: this.packetsCount() === 2 ? 'manual_packet' : onePacketType
    }
    this.setState({
      selectedStage: back[this.state.selectedStage]
    })
  }

  onNext() {
    const next = {
      docusign_packet: this.packetsCount() === 2 ? 'manual_packet' : 'confirm_send',
      manual_packet: 'confirm_send'
    }
    this.setState({
      selectedStage: next[this.state.selectedStage]
    })
  }

  isValidCopyTo() {
    const { emailInformation, hasRecipients } = this.state
    const emails =  emailInformation.copy_to !== '' ? emailInformation.copy_to.split(',') : []
    const regex = /\S+@\S+\.\S+/
    const whitespace = /\s/
    let valid = true

    if (hasRecipients && emails.length > 0) {
      _.forEach(emails, email => {
        if (!regex.test(email.trim()) || whitespace.test(email.trim())) {
          valid = false
        }
      })
    } else if (hasRecipients && emails.length < 1) {
      valid = false
    }
    return valid
  }

  onSend() {
    const { emailInformation, hasRecipients, packetType, user } = this.state
    const params = Params.fetch()

    if (!this.isValidCopyTo()) {
      this.setState({ hasInvalidCopyTo: true })
      return
    }

    this.setState({ sending: true })
    let signaturePacket = {}

    if (hasRecipients) {
      signaturePacket = _.cloneDeep(emailInformation)
    }
    // set the message anyway
    signaturePacket.message = _.cloneDeep(this.state.emailInformation.message)
    signaturePacket.packet_type = packetType.name

    signaturePacket.user_id = _.cloneDeep(user.id)
    signaturePacket.deal_id = params.deals
    let counter = 0
    let checkReload = () => {
      if (counter === this.packetsCount()) {
        window.location.reload()
      }
    }
    const sendPacket = (signaturePacket, type) => {
      Api.post(Routes.dealSignaturePackets(params.deals), {type: type, signature_packet: signaturePacket})
      .then(() => {
        counter += 1
        checkReload()
      })
      .catch(() => {
        counter += 1
        ErrorHandling.setErrors({ messages: { errors: [this.sendPacketError()] } }, checkReload)
      })
    }

    if (this.state.manualSignaturePacketReviewDocuments.length > 0) {
      let manualSignaturePacketReviewDocuments = _.cloneDeep(this.state.manualSignaturePacketReviewDocuments)
      manualSignaturePacketReviewDocuments = _.filter(manualSignaturePacketReviewDocuments, reviewDocument => !_.includes(this.state.onlySignaturePagesIdsManual, reviewDocument.tree_element_id))
      signaturePacket['signature_packet_review_documents'] = manualSignaturePacketReviewDocuments

      sendPacket(signaturePacket, "manual")
    }

    if (this.state.docusignSignaturePacketReviewDocuments.length > 0) {
      let docusignSignaturePacketReviewDocuments = _.cloneDeep(this.state.docusignSignaturePacketReviewDocuments)
      docusignSignaturePacketReviewDocuments = _.filter(docusignSignaturePacketReviewDocuments, reviewDocument => !_.includes(this.state.onlySignaturePagesIdsDocusign, reviewDocument.tree_element_id))
      signaturePacket['signature_packet_review_documents'] = docusignSignaturePacketReviewDocuments

      sendPacket(signaturePacket, "docusign")
    }
  }

  onRemove(signaturePacketDocument) {
    let signaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
    switch(signaturePacketDocument.type) {
      case "checklist":
        // fall through
      case "signature_page":
        signaturePacketReviewDocuments = _.filter(signaturePacketReviewDocuments, reviewDocument => reviewDocument.tree_element_id != signaturePacketDocument.tree_element_id)
        break
      case "upload":
        signaturePacketReviewDocuments = _.filter(signaturePacketReviewDocuments, reviewDocument => reviewDocument.temp_upload_id != signaturePacketDocument.temp_upload_id)
        break
      case "uploading":
        // fall through
      case "error":
        signaturePacketReviewDocuments = _.filter(signaturePacketReviewDocuments, reviewDocument => reviewDocument.identifier != signaturePacketDocument.identifier)
        break
    }

    this.setNewSignaturePacketReviewDocumentsState(signaturePacketReviewDocuments)
  }

  setAttribute(key, value) {
    let emailInformation = _.cloneDeep(this.state.emailInformation)
    emailInformation[key] = value
    this.setState({ emailInformation })
  }

  setHasRecipients() {
    this.setState({ hasRecipients: !this.state.hasRecipients })
  }

  setPacketType(packetType) {
    this.setState({packetType: packetType})
    if (packetType !== SIGNATURE_PACKET_TYPES.email) {
      this.setState({
        hasInvalidCopyTo: false,
        hasRecipients: false,
        emailInformation: {
          copy_to: '',
          message: ''
        }
      })
    }
  }

  onSignatureOnly(signaturePacketDocument, onlySignaturePagesIds) {
    let newOnlySignaturePagesIds = onlySignaturePagesIds

    if (_.includes(onlySignaturePagesIds, signaturePacketDocument.tree_element_id)) {
      newOnlySignaturePagesIds = _.filter(newOnlySignaturePagesIds, onlySignaturePageId => onlySignaturePageId !== signaturePacketDocument.tree_element_id)
    } else {
      newOnlySignaturePagesIds = [...newOnlySignaturePagesIds, signaturePacketDocument.tree_element_id]
    }

    if (this.state.selectedStage === 'manual_packet') {
      this.setState({ onlySignaturePagesIdsManual: newOnlySignaturePagesIds })
    } else if (this.state.selectedStage === 'docusign_packet') {
      this.setState({ onlySignaturePagesIdsDocusign: newOnlySignaturePagesIds })
    }
  }

  getRightFooterButtons() {
    const signaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
    const documentsUploading = _.filter(signaturePacketReviewDocuments, { type: 'uploading' })

    switch(this.state.selectedStage) {
      case 'docusign_packet':
        return (
          <div style={styles.rightButtons}>
            <div style={styles.farRightButton}>
              <Button
                onClick={this.onNext}
                text={<FormattedMessage id='buttons.next' />}
                type='primary'
                disabled={documentsUploading.length > 0}
              />
            </div>
          </div>
        )
      case 'manual_packet':
        return (
          <div style={styles.rightButtons}>
            {
              this.packetsCount() === 2 ?
                <Button
                  onClick={this.onBack}
                  text={<FormattedMessage id='buttons.back' />}
                  type='secondary'
                />
              :
                null
            }
            <div style={styles.farRightButton}>
              <Button
                onClick={this.onNext}
                text={<FormattedMessage id='buttons.next' />}
                type={'primary'}
              />
            </div>
          </div>
        )
      case 'confirm_send':
        return (
          <div style={styles.rightButtons}>
            <Button
              text={<FormattedMessage id='buttons.back' />}
              type='secondary'
              onClick={this.onBack}
            />
            <div style={styles.farRightButton}>
              <Button
                text={this.state.packetType == SIGNATURE_PACKET_TYPES.email ? <FormattedMessage id='buttons.send' /> : <FormattedMessage id='buttons.create' />}
                type='primary'
                onClick={this.onSend}
              />
            </div>
          </div>
        )
    }
  }

  getModalBody() {
    const { docusignSignaturePages, docusignSignaturePacketReviewDocuments, emailInformation, hasInvalidCopyTo, hasRecipients, packetType, manualSignaturePages, manualSignaturePacketReviewDocuments, onlySignaturePagesIdsDocusign, onlySignaturePagesIdsManual } = this.state
    const { copy_to, message } = emailInformation

    switch(this.state.selectedStage) {
      case 'docusign_packet':
        return (
          <AddSignaturePacketReviewDocuments
            pagesType={'docusign'}
            signaturePages={docusignSignaturePages}
            signaturePacketReviewDocuments={docusignSignaturePacketReviewDocuments}
            onlySignaturePagesIds={onlySignaturePagesIdsDocusign}
            packetsCount={this.packetsCount()}
            onRemove={this.onRemove}
            onSignatureOnly={this.onSignatureOnly}
            createSignaturePacketReviewDocumentFromChecklist={this.createSignaturePacketReviewDocumentFromChecklist}
            createSignaturePacketReviewDocumentFromUploads={this.createSignaturePacketReviewDocumentFromUploads}
          />
        )
      case 'manual_packet':
        return (
          <AddSignaturePacketReviewDocuments
            pagesType={'manual'}
            signaturePages={manualSignaturePages}
            signaturePacketReviewDocuments={manualSignaturePacketReviewDocuments}
            onlySignaturePagesIds={onlySignaturePagesIdsManual}
            packetsCount={this.packetsCount()}
            onRemove={this.onRemove}
            onSignatureOnly={this.onSignatureOnly}
            createSignaturePacketReviewDocumentFromChecklist={this.createSignaturePacketReviewDocumentFromChecklist}
            createSignaturePacketReviewDocumentFromUploads={this.createSignaturePacketReviewDocumentFromUploads}
          />
        )
      case 'confirm_send':
        return (
          <ConfirmSendSignaturePacket
            copy_to={copy_to}
            hasRecipients={hasRecipients}
            message={message}
            invalidCopyTo={hasInvalidCopyTo}
            setHasRecipients={this.setHasRecipients}
            packetType={packetType}
            setPacketType={this.setPacketType}
            setAttribute={this.setAttribute}
          />
        )
    }
  }

  buildPacketsError() {
    return this.props.intl.formatMessage({id: 'send_signature_packets.build_packets_error'})
  }

  sendPacketError() {
    return this.props.intl.formatMessage({id: 'send_signature_packets.send_packets_error'})
  }

  createSignaturePacketReviewDocumentFromChecklist(treeElement) {
    const newSignaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
    // ensure a SPRD doesn't exist already with that TreeElement Id.
    if (_.some(newSignaturePacketReviewDocuments, { tree_element_id: treeElement.id })) {
      return
    }
    newSignaturePacketReviewDocuments.push({ tree_element_id: treeElement.id, name: treeElement.name, type: 'checklist', version_position: treeElement.attachment.latest_version.position })
    this.setNewSignaturePacketReviewDocumentsState(newSignaturePacketReviewDocuments)
  }

  createSignaturePacketReviewDocumentFromUploads(files) {
    let newSignaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
    _.each(files, file => {
      const identifier = _.uniqueId()
      newSignaturePacketReviewDocuments.push({ identifier: identifier, file: file, type: 'uploading' })
      this.setNewSignaturePacketReviewDocumentsState(newSignaturePacketReviewDocuments)
      // prepare form data
      let formData = new FormData()
      formData.append('file', file)

      // upload
      const url = Routes.tempUploads(['user'])
      const authCookie = Cookies.getJSON('authentication')
      fetch(`${Api._baseUrl}${url}`, {
        method: 'POST',
        headers: new Headers({
          'X-User-Token': authCookie.token,
          'X-User-Email': authCookie.email,
          'X-Entity-User-Id': authCookie.entity_user_id
        }),
        body: formData
      })
      .then(Api._parseJSON)
      .then(Api._checkStatus)
      .then(Api._getData)
      .then(tempUpload => {
        // build uploaded Signature Packet Review Document
        let newerSignaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
        let index = _.findIndex(newerSignaturePacketReviewDocuments, { identifier: identifier })
        newerSignaturePacketReviewDocuments[index] = { temp_upload_id: tempUpload.id, tempUpload: tempUpload, type: 'upload' }
        this.setNewSignaturePacketReviewDocumentsState(newerSignaturePacketReviewDocuments)
      })
      .catch(() => {
        // build error SignaturePacketReviewDocument
        let newerSignaturePacketReviewDocuments = this.getSignaturePacketReviewDocuments()
        let errorSignaturePacketReviewDocument = _.find(newerSignaturePacketReviewDocuments, { identifier: identifier })
        errorSignaturePacketReviewDocument.type = 'error'
        this.setNewSignaturePacketReviewDocumentsState(newerSignaturePacketReviewDocuments)
      })

    })
  }

  setNewSignaturePacketReviewDocumentsState(newSignaturePacketReviewDocuments) {
    if (this.state.selectedStage === 'manual_packet') {
      this.setState({
        manualSignaturePacketReviewDocuments: newSignaturePacketReviewDocuments
      })
    } else if (this.state.selectedStage === 'docusign_packet') {
      this.setState({
        docusignSignaturePacketReviewDocuments: newSignaturePacketReviewDocuments
      })
    }
  }

  getSignaturePacketReviewDocuments() {
    if (this.state.selectedStage === 'manual_packet') {
      return _.cloneDeep(this.state.manualSignaturePacketReviewDocuments)
    } else if (this.state.selectedStage === 'docusign_packet') {
      return _.cloneDeep(this.state.docusignSignaturePacketReviewDocuments)
    }
  }

  render(){
    const { docusignSignaturePages, hasInvalidCopyTo, hasRecipients, selectedStage, sending, showModal, user } = this.state

    if (!selectedStage || !user || sending) {
      return <LoadingSpinner />
    }
    const packetInfo = (
      <div style={styles.packetInfo}>
        <div style={styles.message}>
          <FormattedMessage
            id={`send_signature_packets.${(selectedStage === 'confirm_send') ? 'confirm_send.review_message' : 'confirm_content'}`}
          />
        </div>
        {(selectedStage === 'confirm_send') && hasInvalidCopyTo && hasRecipients ?
          <div style={styles.alert}>
            <Alert
              status='error'
              messageTitle={<FormattedMessage id='send_signature_packets.confirm_send.invalid_email' />}
            />
          </div>
        :
          null
        }
        <h4><FormattedMessage id='send_signature_packets.packet_summary' /></h4>
        <div style={styles.userInfo}>
          <div style={styles.name}>
            {user.signing_capacities[0].name}
          </div>
          <div style={styles.email} className='gray'>
            {user.email}
          </div>
          <div style={styles.packetList} className='gray'>
            <FormattedMessage
              id='send_signature_packets.packets_list'
              values= {{
                docuSignPresent: !_.isEmpty(docusignSignaturePages),
                packetsCount: this.packetsCount()
              }}
            />
          </div>
        </div>
      </div>
    )
    if (selectedStage) {
      return (
        <Modal
          size='700'
          showModal={showModal}
          hideModal={this.hideModal}
          content={
            <div>
              <ModalHeader>
                <FormattedMessage
                  id='send_signature_packets.signature_packet'
                  values={{packetsCount: this.packetsCount()}}
                />
              </ModalHeader>
              <ModalBody modalStyle={''}>
                <div style={styles.body}>{packetInfo}</div>
                {this.getModalBody()}
              </ModalBody>
              <ModalFooter>
                <div style={styles.buttonsContainer}>
                  <Button
                    onClick={this.hideModal}
                    text={<FormattedMessage id='buttons.cancel' />}
                    type='secondary'
                  />
                  {this.getRightFooterButtons()}
                </div>
              </ModalFooter>
            </div>
          }
        />
      )
    }
  }
}

const styles = {
  buttonsContainer: {
    marginTop: '6.4rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexBasis: '100%'
  },
  farRightButton: {
    marginLeft: '1.2rem'
  },
  rightButtons: {
    display: 'flex'
  },
  packetInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  message: {
    marginBottom: '3.2rem'
  },
  body: {
    padding: '1.6rem 3.2rem 0 3.2rem',
    flexDirection: 'column'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.8rem'
  },
  name: {
    marginBottom: '.4rem',
    marginTop: '.8rem'
  },
  alert: {
    marginBottom: '3.2rem'
  }
}

SendSignaturePacketWizard.propTypes = {
  intl: intlShape.isRequired,
  userId: PropTypes.string.isRequired
}

export default injectIntl(SendSignaturePacketWizard)
