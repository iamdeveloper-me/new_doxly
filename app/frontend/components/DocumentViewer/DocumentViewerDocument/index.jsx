import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'react-bootstrap'

import Error from 'components/Error/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

export default class DocumentViewerDocument extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      error: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedVersionId !== this.props.selectedVersionId) {
      this.setState({
        error: false
      })
    }
  }

  render() {
    const { embedUrl } = this.props
    if (this.state.error) {
      return  <Error
                title={<FormattedMessage id='category.document_viewer.errors.unable_to_load_document' />}
                body={<FormattedMessage id='category.document_viewer.errors.contact_support' />}
                actions={
                  <Button onClick={() => {this.setState({ error: false }, this.props.getViewer)}}>
                    <FormattedMessage id='category.document_viewer.errors.reload_document' />
                  </Button>
                }
              />
    } else if (embedUrl) {
      return <iframe style={styles.iframe} src={embedUrl} />
    } else {
      return <LoadingSpinner showLoadingBox={false} />
    }
  }
}

const styles = {
  iframe: {
    height: '100%',
    width: '100%',
    border: 'none'
  }
}

DocumentViewerDocument.propTypes = {
  embedUrl: PropTypes.string,
  selectedVersionId: PropTypes.number
}
