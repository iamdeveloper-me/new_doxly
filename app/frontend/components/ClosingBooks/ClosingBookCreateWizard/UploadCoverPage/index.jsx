import _ from 'lodash'
import Dropzone from 'react-dropzone'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Assets from 'helpers/Assets'
import BackButton from 'components/Whiteout/Buttons/BackButton/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import Colors from 'helpers/Colors'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import NextButton from 'components/Whiteout/Buttons/NextButton/index.jsx'
import Routes from 'helpers/Routes'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'

class UploadCoverPage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imgSrc: null,
      showDocumentViewer: false,
      viewPath: null
    }
    this.getPreview = this.getPreview.bind(this)
    this.removeCoverPage = this.removeCoverPage.bind(this)
    this.performUpload = this.performUpload.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
  }

  componentDidMount() {
    if (this.props.coverPageFile) {
      this.setState({ loading: false })
      this.getPreview(this.props.coverPageFile.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.coverPageFile != this.props.coverPageFile) && nextProps.coverPageFile) {
      this.setState({ loading: false })
      this.getPreview(nextProps.coverPageFile.id)
    }
  }

  getPreview(coverPageFileId) {
    Api.getFile(Routes.tempUploadPreview(coverPageFileId))
      .then((blob) => {
        this.setState({ imgSrc: URL.createObjectURL(blob) })
      })
  }

  removeCoverPage() {
    Api.delete(Routes.tempUpload(this.props.coverPageFile.id))
      .catch(error => { ErrorHandling.setErrors(error)})
    this.props.setAttribute('cover_page_file', null)
    this.setState({ imgSrc: null })
  }

  performUpload(file) {
    Api.upload(Routes.tempUploads(), file)
      .then((tempUpload) => {
        this.props.setAttribute('cover_page_file', tempUpload)
      })
      .catch(error => { ErrorHandling.setErrors(error)})
  }

  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length > 0) {
      this.setState({ loading: true })
      this.performUpload(acceptedFiles[0])
    } else {
      _.each(rejectedFiles, file => ErrorHandling.setErrors({ messages: { errors: [this.props.intl.formatMessage({ id: 'closing_books.create_wizard.upload_cover_page.not_supported' })] } }))
    }
  }

  openDocumentViewer(e) {
    this.setState({ showDocumentViewer: true })
    e.preventDefault()
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }
  
  render() {
    const { coverPageFile } = this.props
    const { back, next, setAttribute, toggleCreateWizard } = this.props

    let preview = null
    if (this.state.loading || (this.props.coverPageFile && !this.state.imgSrc)) {
      preview = <LoadingSpinner showLoadingBox={false} showLoadingText={false} />
    } else {
      preview = <img src={this.state.imgSrc} />
    }
    const view = this.props.coverPageFile ?
      <div style={styles.preview}>
        <div>
          <h4><FormattedMessage id='closing_books.create_wizard.upload_cover_page.preview' /></h4>
          <div style={styles.previewImage} onClick={this.openDocumentViewer}>{preview}</div>
          <Button
            size="small"
            type="secondary"
            icon="delete"
            text={<FormattedMessage id='closing_books.create_wizard.upload_cover_page.remove' />}
            onClick={this.removeCoverPage}
          />
        </div>
      </div>
    :
      <div style={styles.options}>
        <Dropzone
          style={styles.dropzone}
          onDrop={this.onDrop}
          accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" // pdf, doc, and docx mime types
          ref={dropzone => { this.dropzoneRef = dropzone }}
        >
        </Dropzone>
        <img src={Assets.getPath('ic-wo-coverpage-200-px.svg')} style={styles.icon} />
        <Button
          type="primary"
          text={<FormattedMessage id='closing_books.create_wizard.upload_cover_page.upload_cover_page'/>}
          onClick={() => { this.dropzoneRef.open() }}
        />
        <Button
          text={<FormattedMessage id='closing_books.create_wizard.upload_cover_page.continue_without_cover_page' />}
          onClick={next}
        />
      </div>

    return (
      <WhiteoutModal
        header={<FormattedMessage id='closing_books.create_wizard.create_closing_book' />}
        title={<FormattedMessage id='closing_books.create_wizard.upload_cover_page.would_you_like_to_use_cover_page' />}
        quit={toggleCreateWizard}
        body={
          <div style={styles.container}>
            <p>
              <FormattedMessage id='closing_books.create_wizard.upload_cover_page.choose_a_pdf_or_word_document' />
            </p>
            {view}
            {this.state.showDocumentViewer && coverPageFile.url ?
              <WhiteoutPdfViewer
                title={<FormattedMessage id='closing_books.create_wizard.upload_cover_page.cover_page' />}
                pagePath={coverPageFile.url}
                onClose={this.hideDocumentViewer}
              />
            :
              null
            }
          </div>
        }
        topLeftButton={
          <BackButton
            onClick={back}
          />
        }
        topRightButton={
          <CloseButton />
        }
        bottomRightButton={
          <NextButton
            onClick={next}
          />
        }
      />
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },
  icon: {
    marginBottom: '3.2rem',
    flexShrink: '0'
  },
  preview: {
    margin: '2.4rem 0 6.4rem 0',
    paddingTop: '2.4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
    flexGrow: '1',
    width: '100%',
    maxWidth: '69rem',
    textAlign: 'left'
  },
  options: {
    margin: '2.4rem 0 6.4rem 0',
    paddingTop: '2.4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
    flexGrow: '1',
    width: '100%',
    maxWidth: '69rem'
  },
  dropzone: {
    border: 'none',
    height: '0',
    width: '0'
  },
  previewImage: {
    height: '28.5rem',
    width: '22rem',
    border: `0.1rem solid ${Colors.gray.normal}`,
    margin: '0.8rem 0',
    cursor: 'pointer',
    overflow: 'hidden'
  }
}

UploadCoverPage.propTypes = {
  back: PropTypes.func.isRequired,
  toggleCreateWizard: PropTypes.func.isRequired
}

export default injectIntl(UploadCoverPage)