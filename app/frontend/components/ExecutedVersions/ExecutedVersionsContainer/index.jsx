import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import NextButton from 'components/Whiteout/Buttons/NextButton/index.jsx'
import IncompleteDocuments from './IncompleteDocuments/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import ReadyDocuments from './ReadyDocuments/index.jsx'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'
import WhiteoutTabLayout from 'components/WhiteoutTabLayout/index.jsx'

export default class ExecutedVersionsContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.getTabs = this.getTabs.bind(this)
    this.onNext = this.onNext.bind(this)
    this.quit = this.quit.bind(this)
  }

  getTabs() {
    const { incompleteDocuments, readyDocuments, selectedDocuments, setSelectedDocuments, updateSelectedDocuments } = this.props
    let tabs = []

    if (readyDocuments.length > 0) {
      tabs.push({
        key: 'ready-tab',
        content: <ReadyDocuments
                   documents={readyDocuments}
                   selectedDocuments={selectedDocuments}
                   setSelectedDocuments={setSelectedDocuments}
                   updateSelectedDocuments={updateSelectedDocuments}
                 />,
        text: <FormattedMessage
                id='executed_versions.ready_tab'
                values={{readyDocumentsCount: readyDocuments.length}}
              />
      })
    }

    if (incompleteDocuments.length > 0) {
      tabs.push({
        key: 'incomplete-tab',
        content: <IncompleteDocuments documents={incompleteDocuments} />,
        text: <FormattedMessage
                id='executed_versions.incomplete_tab'
                values={{incompleteDocumentsCount: incompleteDocuments.length}}
              />
      })
    }
    return tabs
  }

  onNext() {
    this.props.setSelectedView('page_placement')
  }

  quit() {
    window.location.reload()
  }

  render() {
    const tabs = this.getTabs()
    const bodyContent = tabs.length > 0 ?
                          <WhiteoutTabLayout tabs={tabs} />
                        :
                          <LoadingSpinner />

    return (
      <WhiteoutModal
        header={<FormattedMessage id='executed_versions.create_executed_versions' />}
        title={<FormattedMessage id='executed_versions.choose_documents' />}
        quit={this.quit}
        body={bodyContent}
        topRightButton={
          <CloseButton />
        }
        bottomRightButton={
          <NextButton
            onClick={this.onNext}
            disabled={this.props.selectedDocuments.length === 0}
          />
        }
      />
    )
  }

}

ExecutedVersionsContainer.propTypes = {
  incompleteDocuments: PropTypes.array.isRequired,
  readyDocuments: PropTypes.array.isRequired,
  selectedDocuments: PropTypes.array.isRequired,

  setSelectedDocuments: PropTypes.func.isRequired,
  setSelectedView: PropTypes.func.isRequired,
  updateSelectedDocuments: PropTypes.func.isRequired
}
