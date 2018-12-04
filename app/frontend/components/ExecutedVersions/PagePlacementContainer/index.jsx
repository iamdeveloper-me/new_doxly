import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import BackButton from 'components/Whiteout/Buttons/BackButton/index.jsx'
import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import NextButton from 'components/Whiteout/Buttons/NextButton/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import PagePlacement from './PagePlacement/index.jsx'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'

export default class PagePlacementContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onBack = this.onBack.bind(this)
    this.onNext = this.onNext.bind(this)
    this.quit   = this.quit.bind(this)
  }

  onBack() {
    this.props.setSelectedView('choose_documents')
  }

  onNext() {
    this.props.setSelectedView('confirm_changes')
  }

  quit() {
    window.location.reload()
  }

  render() {
    const { originalSelectedDocuments, selectedDocument, selectedDocuments } = this.props
    const { setSelectedDocumentId, setUpdatedDocuments, updateDocument } = this.props
    if (selectedDocuments.length === 0) {
      return <LoadingSpinner />
    }

    return (
      <WhiteoutModal
        header={<FormattedMessage id='executed_versions.create_executed_versions' />}
        title={<FormattedMessage id='executed_versions.custom_page_placement' />}
        quit={this.quit}
        body={
          <PagePlacement
            documents={selectedDocuments}
            originalDocuments={originalSelectedDocuments}
            setUpdatedDocuments={setUpdatedDocuments}
            updateDocument={updateDocument}
            selectedDocument={selectedDocument}
            setSelectedDocumentId={setSelectedDocumentId}
          />
        }
        topLeftButton={
          <BackButton onClick={this.onBack} />
        }
        topRightButton={
          <CloseButton />
        }
        bottomRightButton={
          <NextButton onClick={this.onNext} />
        }
      />
    )
  }

}

PagePlacementContainer.propTypes = {
  originalSelectedDocuments: PropTypes.array.isRequired,
  selectedDocument: PropTypes.object,
  selectedDocuments: PropTypes.array.isRequired,

  setSelectedDocumentId: PropTypes.func.isRequired,
  setSelectedView: PropTypes.func.isRequired,
  setUpdatedDocuments: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired
}
