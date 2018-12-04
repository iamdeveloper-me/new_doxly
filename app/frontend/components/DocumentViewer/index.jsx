import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Api from 'helpers/Api'
import Colors from 'helpers/Colors'
import Lightbox from 'components/Lightbox/index.jsx'
import DocumentViewerDocument from './DocumentViewerDocument/index.jsx'
import DocumentViewerHeader from './DocumentViewerHeader/index.jsx'
import DocumentViewerInfo from './DocumentViewerInfo/index.jsx'
import DocumentViewerNotes from './DocumentViewerNotes/index.jsx'
import Error from 'components/Error/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

class DocumentViewer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      error: false,
      isLoading: true,
      versions: [
        this.props.version
      ],
      selectedVersionId: this.props.version && this.props.version.id,
      showNotes: false,
      embedUrl: this.props.version && this.props.version.url
    }
    this.getVersions = this.getVersions.bind(this)
    this.clickVersion = this.clickVersion.bind(this)
    this.toggleShowNotes = this.toggleShowNotes.bind(this)
    this.deleteVersion = this.deleteVersion.bind(this)
  }

  componentDidMount() {
    if (this.props.treeElement) {
      this.getVersions()
    } else {
      this.setState({ isLoading: false })
    }
  }

  getVersions() {
    const params = Params.fetch()
    Api.get(Routes.dealCategoryTreeElement(params.deals, params.categories, this.props.treeElement.id, ['attachment.versions.uploader.user', 'attachment.versions.version_storageable', 'attachment.versions.uploader.entity', 'attachment.versions.uploader.deal_entity', 'attachment.versions.signature_page_executions.user']))
      .then((treeElement) => {
        const versions = _.orderBy(treeElement.attachment.versions, 'position', 'desc')
        this.setState({
          error: false,
          isLoading: false,
          versions,
          selectedVersionId: _.get(versions, '[0].id'),
          embedUrl: _.get(versions, '[0].url')
        })
      })
      .catch(() => {
        App.FlashMessages.addMessage('error', this.props.intl.formatMessage({ id: 'category.document_viewer.errors.unable_to_load_versions_error' }))
        this.setState({ error: true })
      })
  }

  clickVersion(version) {
    this.setState({
      selectedVersionId: version.id,
      embedUrl: version.url
    })
  }

  toggleShowNotes() {
    this.setState({ showNotes: !this.state.showNotes })
  }

  deleteVersion(treeElement, version) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    const versionId = version.id
    const attachmentId = treeElement.attachment.id
    const allVersions = _.cloneDeep(this.state.versions)

    Api.delete(Routes.dealCategoryTreeElementAttachmentVersion(params.deals, params.categories, treeElement.id, attachmentId, versionId))
      .then(() => {
        // remove version, update positions
        _.remove(allVersions, { id: versionId })
        _.forEach(allVersions, (version, i) => version.position = allVersions.length - i)

        // setState if versions remain else close the viewer
        let latestVersion = null
        if (!_.isEmpty(allVersions)) {
          latestVersion = _.first(allVersions)

          this.setState({
            versions: _.orderBy(allVersions, 'position', 'desc'),
            selectedVersionId: latestVersion.id,
            embedUrl: latestVersion.url
          })
        } else {
          this.props.hideDocumentViewer()
        }
        this.props.deletePlacedUploadVersion(treeElement, version, latestVersion)
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState, error))})
  }

  render() {
    const header =  <DocumentViewerHeader
                      {...this.state}
                      {...this.props}
                      toggleShowNotes={this.toggleShowNotes}
                    />

    const error = <Error
                    title={<FormattedMessage id='category.document_viewer.errors.unable_to_load_versions' />}
                  />

    const info = this.props.treeElement ?
                    <DocumentViewerInfo
                      {...this.state}
                      {...this.props}
                      clickVersion={this.clickVersion}
                      deleteVersion={this.deleteVersion}
                    />
                  :
                    null

    const document =  <div style={styles.document}>
                        <DocumentViewerDocument
                          {...this.state}
                          {...this.props}
                        />
                      </div>

    const notes = this.props.treeElement && this.state.showNotes ?
                    <div style={styles.notes}>
                      <DocumentViewerNotes
                        {...this.state}
                        {...this.props}
                      />
                    </div>
                  :
                    null
    return (
      <Lightbox header={header}>
        <div style={styles.columns}>
          {this.state.error ? error : info}
          {document}
          {notes}
        </div>
      </Lightbox>
    )
  }
}

const styles = {
  columns: {
    display: 'flex',
    flexGrow: '1',
    height: '100%',
    background: Colors.gray.lightest
  },
  document: {
    flexGrow: '1',
    height: '100%',
    position: 'relative'
  },
  notes: {
    flexBasis: '20%'
  },
}

DocumentViewer.defaultProps = {
  documentViewerAlreadyShown: false
}

DocumentViewer.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  intl: intlShape.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object,
  version: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  hideDocumentViewer: PropTypes.func
}

export default injectIntl(DocumentViewer)
