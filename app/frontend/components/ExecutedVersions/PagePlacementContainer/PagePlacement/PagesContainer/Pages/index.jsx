import PropTypes from 'prop-types'
import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Thumbnail from './Thumbnail/index.jsx'

class Pages extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      image: null,
    }
    this.loadImage = this.loadImage.bind(this)
    this.onLoad = this.onLoad.bind(this)
  }

  componentDidMount() {
    this.loadImage(this.props.selectedDocument.thumbnail_sprite_path)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDocument.thumbnail_sprite_path !== this.props.selectedDocument.thumbnail_sprite_path) {
      this.props.setThumbnailsLoading(true)
      this.setState({ image: null }, () => {
        this.loadImage(nextProps.selectedDocument.thumbnail_sprite_path)
      })
    }
  }

  loadImage(src) {
    if (this.image) {
      this.image.onload = null
      this.image.onerror = null
    }
    const image = new Image()
    this.image = image
    image.onload = this.onLoad
    image.src = src
  }

  onLoad() {
    this.props.setThumbnailsLoading(false)
    this.setState({
      image: this.image.src,
    })
  }

  render() {
    const { pages, selectedDocument, selectedDocuments, thumbnailsLoading, toggleShowPreview, updateSelectedPages } = this.props

    const thumbnails = pages.map((page, index) => (
      <Thumbnail
        key={`item-${selectedDocument.document_id}-${index}`}
        index={index}
        page={page}
        thumbnailSprite={this.state.image}
        selectedDocuments={selectedDocuments}
        toggleShowPreview={toggleShowPreview}
        updateSelectedPages={updateSelectedPages}
      />
    ))

    return (
      <div style={styles.thumbnailContainer}>
        {thumbnailsLoading ? (
            <div style={styles.loading}>
              <LoadingSpinner showLoadingBox={false} showLoadingText={false} />
            </div>
          )
        :
          thumbnails
        }
      </div>
    )
  }

}

const styles = {
  thumbnailContainer: {
    flexGrow: '1',
    width: '100%',
    paddingTop: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'auto',
    alignContent: 'flex-start',
    paddingLeft: '10px'
  },
  loading: {
    flexGrow: '1'
  }
}

Pages.propTypes = {
  pages: PropTypes.array.isRequired,
  selectedDocument: PropTypes.object.isRequired,
  selectedDocuments: PropTypes.array.isRequired,
  thumbnailsLoading: PropTypes.bool.isRequired,

  setThumbnailsLoading: PropTypes.func.isRequired,
  toggleShowPreview: PropTypes.func.isRequired,
  updateSelectedPages: PropTypes.func.isRequired
}

export default SortableContainer(Pages)
