import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import BackButton from 'components/Whiteout/Buttons/BackButton/index.jsx'
import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import ConfirmChangesContainer from './ConfirmChangesContainer/index.jsx'
import FullScreenBackdrop from 'components/FullScreenBackdrop/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'

export default class ConfirmChanges extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      documentChanges: [],
      loading: false
    }
    this.getDocumentChanges = this.getDocumentChanges.bind(this)
    this.onBack = this.onBack.bind(this)
    this.processDocuments = this.processDocuments.bind(this)
    this.processDocuments = _.debounce(this.processDocuments, 100)
    this.getChangesText = this.getChangesText.bind(this)
    this.quit = this.quit.bind(this)
  }

  componentDidMount() {
    this.getDocumentChanges()
  }

  getChangesText(newSigners = false, pagesReordered = false, pagesRemoved = false) {
    let edits
    if (newSigners) {
      if (pagesReordered && pagesRemoved) {
        edits = <FormattedMessage id='executed_versions.pages_reordered_and_removed_and_signers' />
      } else if (pagesReordered) {
        edits = <FormattedMessage id='executed_versions.pages_reordered_and_signers' />
      } else if (pagesRemoved) {
        edits = <FormattedMessage id='executed_versions.pages_removed_and_signers' />
      } else {
        edits = <FormattedMessage id='executed_versions.new_signers' />
      }
    } else if (pagesReordered && pagesRemoved) {
      edits = <FormattedMessage id='executed_versions.pages_reordered_and_removed' />
    } else if (pagesReordered) {
      edits = <FormattedMessage id='executed_versions.pages_reordered' />
    } else if (pagesRemoved) {
      edits = <FormattedMessage id='executed_versions.pages_removed' />
    }

    return edits
  }

  getDocumentChanges() {
    let documentChanges = []

    this.props.documents.map((originalDocument) => {
      let pagesReordered = false
      let pagesRemoved = false
      let newSigners = false
      let edits

      originalDocument.pages.map((page, index) => {
        if (page.original_position !== index + 1) {
          pagesReordered = true
        }
        if (page.position === null) {
          pagesRemoved = true
        }
        if (page.signature_page_id && page.position && _.includes(originalDocument.new_signers, page.signing_capacity_id)) {
          newSigners = true
        }
      })
      edits = this.getChangesText(newSigners, pagesReordered, pagesRemoved)
      documentChanges.push({ document_name: originalDocument.document_name, changes: edits })
    })

    this.setState({
      documentChanges: documentChanges
    })
  }

  onBack() {
    this.props.setSelectedView('page_placement')
  }

  processDocuments() {
    let originalDocuments = _.cloneDeep(this.props.documents)
    const params = Params.fetch()

    originalDocuments.map((document) => {
      document.pages = _.reject(document.pages, ['position', null])
    })

    this.setState({ loading: true })
    Api.post(Routes.dealProcessDocumentsReadyToBeExecuted(params.deals), {'documents_to_execute': originalDocuments}).then((originalDocuments) => {
      window.location.reload()
    })
  }

  quit() {
    window.location.reload()
  }

  render() {
    return (
      <WhiteoutModal
        header={<FormattedMessage id='executed_versions.create_executed_versions' />}
        title={<FormattedMessage id='executed_versions.confirm_changes' />}
        quit={this.quit}
        body={ this.state.loading ?
            <FullScreenBackdrop><LoadingSpinner /></FullScreenBackdrop>
          :
            <ConfirmChangesContainer
              documents={this.state.documentChanges}
              processDocuments={this.processDocuments}
            />
        }
        topLeftButton={<BackButton onClick={this.onBack} />}
        topRightButton={<CloseButton />}
      />
    )
  }

}

ConfirmChanges.propTypes = {
  documents: PropTypes.array.isRequired,

  setSelectedView: PropTypes.func.isRequired
}
