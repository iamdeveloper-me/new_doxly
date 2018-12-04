import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow,
  DropdownTrigger
} from 'components/Whiteout/Dropdown/index.jsx'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'


class UnmatchedSignatureUploadPage extends React.PureComponent {

  constructor(props) {
    super(props)
    const setSelectedSignerId = props.unmatchedSignatureUpload.is_client_upload && _.find(props.signers, { id: props.unmatchedSignatureUpload.uploader.id })
    const signerSignaturePages = setSelectedSignerId ? _.filter(props.signaturePages, signaturePage => signaturePage.signer === props.unmatchedSignatureUpload.uploader.id && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status)) : []
    this.state = {
      signerSignaturePages: signerSignaturePages,
      signerTreeElements: _.uniqBy(signerSignaturePages.map(signerSignaturePage => props.treeElements[signerSignaturePage.tree_element]), 'id'),
      signerTreeElementSigningCapacities: [],
      selectedSignerId: setSelectedSignerId ? props.unmatchedSignatureUpload.uploader.id : null,
      selectedTreeElementId: null,
      selectedSigningCapacityId: null,
      showDocumentViewer: false
    }
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
    this.setSelectedSigner = this.setSelectedSigner.bind(this)
    this.setSelectedTreeElement = this.setSelectedTreeElement.bind(this)
    this.setSelectedSigningCapacity = this.setSelectedSigningCapacity.bind(this)
    this.confirmSelection = this.confirmSelection.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const state = {}

    // check if selected signer is still valid
    if (this.state.selectedSignerId && _.find(nextProps.signers, { id: this.state.selectedSignerId })) {
      state.signerSignaturePages = _.filter(nextProps.signaturePages, signaturePage => signaturePage.signer === this.state.selectedSignerId && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status))
      state.signerTreeElements = _.uniqBy(state.signerSignaturePages.map(signerSignaturePage => nextProps.treeElements[signerSignaturePage.tree_element]), 'id')

      // check if selected tree element is still valid
      if (this.state.selectedTreeElementId && _.find(state.signerTreeElements, { id: this.state.selectedTreeElementId })) {
        state.signerTreeElementSigningCapacities = (
          _.uniqBy(
            _.filter(state.signerSignaturePages, signaturePage => (signaturePage.tree_element === this.state.selectedTreeElementId && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status)))
            .map(signerTreeElementSignaturePage => nextProps.signingCapacities[signerTreeElementSignaturePage.signing_capacity]),
            'id'
          )
        )

        // check if selected signature group is still valid
        if (this.state.selectedSigningCapacityId && _.find(state.signerTreeElementSigningCapacities, { id: this.state.selectedSigningCapacityId })) {
          // don't change anything
        } else if (state.signerTreeElementSigningCapacities.length === 1) {
          state.selectedSigningCapacityId = _.first(state.signerTreeElementSigningCapacities).id
        } else {
          state.selectedSigningCapacityId = null
        }
      } else {
        // clear all values set by selecting a tree element
        _.assign(state, {
          selectedTreeElementId: null,
          selectedSigningCapacityId: null,
          signerTreeElementSigningCapacities: []
        })
      }
    } else {
      // clear all values set by selecting a signer
      _.assign(state, {
        selectedSignerId: null,
        selectedTreeElementId: null,
        selectedSigningCapacityId: null,
        signerTreeElements: [],
        signerSignaturePages: [],
        signerTreeElementSigningCapacities: []
      })
    }

    this.setState(state)
  }

  openDocumentViewer() {
    this.setState({ showDocumentViewer: true })
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  setSelectedSigner(signer) {
    const signerSignaturePages = _.filter(this.props.signaturePages, signaturePage => signaturePage.signer === signer.id && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status))
    this.setState({
      signerSignaturePages: signerSignaturePages,
      signerTreeElements: _.uniqBy(signerSignaturePages.map(signerSignaturePage => this.props.treeElements[signerSignaturePage.tree_element]), 'id'),
      signerTreeElementSigningCapacities: [],
      selectedSignerId: signer.id,
      selectedTreeElementId: null,
      selectedSigningCapacityId: null
    })
  }

  setSelectedTreeElement(tree_element) {
    const signerTreeElementSigningCapacities = (
      _.uniqBy(
        _.filter(this.state.signerSignaturePages, signaturePage => (signaturePage.tree_element === tree_element.id && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status)))
        .map(signerTreeElementSignaturePage => this.props.signingCapacities[signerTreeElementSignaturePage.signing_capacity]),
        'id'
      )
    )
    if (signerTreeElementSigningCapacities.length === 1) {
      this.setState({
        signerTreeElementSigningCapacities: signerTreeElementSigningCapacities,
        selectedTreeElementId: tree_element.id,
        selectedSigningCapacityId: _.first(signerTreeElementSigningCapacities).id
      })
    } else {
      this.setState({
        signerTreeElementSigningCapacities: signerTreeElementSigningCapacities,
        selectedTreeElementId: tree_element.id,
        selectedSigningCapacityId: null
      })
    }
  }

  setSelectedSigningCapacity(signingCapacity) {
    this.setState({
      selectedSigningCapacityId: signingCapacity.id
    })
  }

  confirmSelection(signaturePage) {
    this.props.manuallyMatch(this.props.unmatchedSignatureUpload.id, this.props.unmatchedSignatureUploadPage.id, signaturePage.id)
  }

  clearSelection() {
    const setSelectedSignerId = this.props.unmatchedSignatureUpload.is_client_upload && _.find(this.props.signers, { id: this.props.unmatchedSignatureUpload.uploader.id })
    const signerSignaturePages = setSelectedSignerId ? _.filter(this.props.signaturePages, signaturePage => signaturePage.signer === this.props.unmatchedSignatureUpload.uploader.id && _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signaturePage.signature_status)) : []
    this.setState({
      signerSignaturePages: signerSignaturePages,
      signerTreeElements: _.uniqBy(signerSignaturePages.map(signerSignaturePage => this.props.treeElements[signerSignaturePage.tree_element]), 'id'),
      signerTreeElementSigningCapacities: [],
      selectedSignerId: setSelectedSignerId ? this.props.unmatchedSignatureUpload.uploader.id : null,
      selectedTreeElementId: null,
      selectedSigningCapacityId: null
    })
  }

  render() {
    const { intl, signatureEntities, signatureGroups, signers, signingCapacities, signaturePages, treeElements, unmatchedSignatureUpload, unmatchedSignatureUploadPage } = this.props

    const pageNumber = (
      <FormattedMessage
        id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.page_number'
        values={{
          page_number: unmatchedSignatureUploadPage.page_number
        }}
      />
    )

    // check if all the fields are filled out and get the matching signature page
    const formComplete = (
      this.state.selectedSignerId !== null &&
      this.state.selectedTreeElementId !== null &&
      this.state.selectedSigningCapacityId !== null
    )
    const signaturePage = formComplete ?
      _.find(signaturePages, {
        signer: this.state.selectedSignerId,
        tree_element: this.state.selectedTreeElementId,
        signing_capacity: this.state.selectedSigningCapacityId
      })
    :
      null

    return (
      <div style={styles.content}>
        <div style={styles.label}>
          <a onClick={this.openDocumentViewer}>{pageNumber}</a>
        </div>
        <div style={styles.dropdownContainer}>
          <Dropdown
            size="mini"
            trigger={
              <div style={styles.dropdownTrigger(false)}>
                <div style={styles.value}>
                  {
                    this.state.selectedSignerId ?
                      _.find(signers, { id: this.state.selectedSignerId }).name
                    :
                      <span style={styles.placeholder}><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.choose_signer' /></span>
                  }
                </div>
                <div style={styles.arrow}><i className="mdi mdi-chevron-down"></i></div>
              </div>
            }
            content={
              <DropdownRow>
                <DropdownColumn>
                  {
                    signers.length === 0 ?
                      <FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.signer_empty_state' />
                    :
                      signers.map(signer => (
                        <DropdownItem key={signer.id} onClick={() => this.setSelectedSigner(signer)}>
                          <span style={styles.signerOption}>
                            <FormattedMessage
                              id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.signer'
                              values={{
                                name: signer.name,
                                email: signer.email
                              }}
                            />
                          </span>
                        </DropdownItem>
                      ))
                  }
                </DropdownColumn>
              </DropdownRow>
            }
          />
          <Dropdown
            size="mini"
            disabled={this.state.selectedSignerId === null}
            trigger={
              <div style={styles.dropdownTrigger(this.state.selectedSignerId === null)}>
                <div style={styles.value}>
                  {
                    this.state.selectedTreeElementId ?
                      treeElements[this.state.selectedTreeElementId].name
                    :
                      <span style={styles.placeholder}><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.choose_document' /></span>
                  }
                </div>
                <div style={styles.arrow}><i className="mdi mdi-chevron-down"></i></div>
              </div>
            }
            content={
              <DropdownRow
                style={styles.row}
              >
                <DropdownColumn>
                  {
                    _.map(this.state.signerTreeElements, treeElement => (
                      <DropdownItem key={treeElement.id} onClick={() => this.setSelectedTreeElement(treeElement)}>
                        {treeElement.name}
                      </DropdownItem>
                    ))
                  }
                </DropdownColumn>
              </DropdownRow>
            }
          />
          {this.state.signerTreeElementSigningCapacities.length > 1 ?
            <Dropdown
              size="mini"
              disabled={this.state.selectedTreeElementId === null}
              trigger={
                <div style={styles.dropdownTrigger(this.state.selectedTreeElementId === null)}>
                  <div style={styles.value}>
                  {
                    this.state.selectedSigningCapacityId ?
                      <FormattedMessage
                        id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.signing_capacity'
                        values={{
                          entity: signingCapacities[this.state.selectedSigningCapacityId].signature_entity ? signatureEntities[signingCapacities[this.state.selectedSigningCapacityId].signature_entity].root.name : intl.formatMessage({id: 'unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.individual'}),
                          group: signatureGroups[signingCapacities[this.state.selectedSigningCapacityId].signature_group].name
                        }}
                      />
                    :
                      <span style={styles.placeholder}><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.choose_signing_capacity' /></span>
                  }
                  </div>
                  <div style={styles.arrow}><i className="mdi mdi-chevron-down"></i></div>
                </div>
              }
              content={
                <DropdownRow>
                  <DropdownColumn>
                    {
                      _.map(this.state.signerTreeElementSigningCapacities, signingCapacity => (
                        <DropdownItem key={signingCapacity.id} onClick={() => this.setSelectedSigningCapacity(signingCapacity)}>
                          <FormattedMessage
                            id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.signing_capacity'
                            values={{
                              entity: signingCapacity.signature_entity ? signatureEntities[signingCapacity.signature_entity].root.name : intl.formatMessage({id: 'unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.individual'}),
                              group: signatureGroups[signingCapacity.signature_group].name
                            }}
                          />
                        </DropdownItem>
                      ))
                    }
                  </DropdownColumn>
                </DropdownRow>
              }
            />
          :
            null
          }
        </div>
        <div style={styles.buttons}>
          <Button
            type="primary"
            size="mini"
            icon="check"
            disabled={signaturePage === null}
            tooltip={intl.formatMessage({id: 'buttons.confirm'})}
            onClick={() => this.confirmSelection(signaturePage)}
          />
          <div style={styles.closeButton}>
            <Button
              type="secondary"
              size="mini"
              icon="close"
              tooltip={intl.formatMessage({id: 'buttons.cancel'})}
              onClick={this.clearSelection}
            />
          </div>
        </div>
        {this.state.showDocumentViewer ?
          <WhiteoutPdfViewer
            title={pageNumber}
            pagePath={unmatchedSignatureUploadPage.url}
            onClose={this.hideDocumentViewer}
          />
        :
          null
        }
      </div>
    )
  }
}

const styles = {
  content: {
    padding: '0.8rem 0',
    display: 'flex',
    alignItems: 'flex-start'
  },
  label: {
    color: Colors.whiteout.blue,
    flex: '0 0 5.6rem'
  },
  dropdownContainer: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column'
  },
  buttons: {
    display: 'flex'
  },
  closeButton: {
    marginLeft: '0.4rem'
  },
  dropdownTrigger: disabled => ({
    width: '19.2rem',
    marginBottom: '0.8rem',
    borderBottom: `0.1rem dotted ${disabled ? Colors.whiteout.darkGray : Colors.whiteout.blue}`,
    cursor: disabled ? 'auto' : 'pointer',
    color: disabled ? Colors.whiteout.text.light : Colors.whiteout.blue,
    opacity: disabled ? '0.5' : '1',
    display: 'flex'
  }),
  value: {
    flexGrow: '1',
    color: Colors.whiteout.text.default,
    fontSize: '1.2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  placeholder: {
    color: Colors.whiteout.text.light
  },
  arrow: {
    fontSize: '1.4rem'
  },
  row: {
    whiteSpace: 'normal',
    width: '25rem'
  },
  signerOption: {
    whiteSpace: 'normal'
  }
}

UnmatchedSignatureUploadPage.propTypes = {
  intl: intlShape.isRequired,
  signatureEntities: PropTypes.object.isRequired,
  signatureGroups: PropTypes.object.isRequired,
  signingCapacities: PropTypes.object.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.array.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUpload: PropTypes.object.isRequired,
  unmatchedSignatureUploadPage: PropTypes.object.isRequired
}

export default injectIntl(UnmatchedSignatureUploadPage)
