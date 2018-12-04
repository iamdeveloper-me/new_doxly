import PropTypes from 'prop-types'
import React from 'react'

import ChooseFromChecklistButton from './ChooseFromChecklistButton/index.jsx'
import FontDropdown from './FontDropdown/index.jsx'
import FontSizeDropdown from './FontSizeDropdown/index.jsx'

export default class BuildTableOfContentsToolbar extends React.PureComponent {

  render() {
    const { closingBookSections, font, fontSize, tree } = this.props
    const { setFont, setFontSize, setIsDragging } = this.props
    return (
      <div style={styles.toolbar}>
        <FontDropdown
          font={font}
          setFont={setFont}
        />
        <FontSizeDropdown
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
        <div style={styles.spacer}></div>
        <ChooseFromChecklistButton
          closingBookSections={closingBookSections}
          tree={tree}
          setIsDragging={setIsDragging}
        />
      </div>
    )
  }

}

const styles = {
  toolbar: {
    flexShrink: '0',
    display: 'flex',
    marginBottom: '0.8rem',
    width: '100%'
  },
  spacer: {
    flexGrow: '1'
  }
}

BuildTableOfContentsToolbar.propTypes = {
  closingBookSections: PropTypes.array.isRequired,
  font: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  tree: PropTypes.array.isRequired,

  setFont: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  setIsDragging: PropTypes.func.isRequired
}