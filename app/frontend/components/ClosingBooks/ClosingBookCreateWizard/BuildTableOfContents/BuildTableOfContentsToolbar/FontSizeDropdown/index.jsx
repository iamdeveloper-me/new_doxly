import PropTypes from 'prop-types'
import React from 'react'

import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow,
  DropdownTrigger
} from 'components/Whiteout/Dropdown/index.jsx'

const fontSizes = [10, 11, 12, 14, 15, 16]

const FontSizeDropdown = ({ fontSize, setFontSize }) => (
  <Dropdown
    trigger={
      <DropdownTrigger
        style={styles.fontSizeTrigger}
        text={`${fontSize}`}
      />
    }
    content={
      <DropdownRow>
        <DropdownColumn>
          {
            fontSizes.map(fontSize => (
              <DropdownItem key={`font_size_${fontSize}`} onClick={() => setFontSize(fontSize)}>
                <span style={styles.fontSize(fontSize)}>{fontSize}</span>
              </DropdownItem>
            ))
          }
        </DropdownColumn>
      </DropdownRow>
    }
  />
)

const styles = {
  fontSize: fontSize => ({
    fontSize: fontSize
  }),
  fontSizeTrigger: {
    minWidth: '6.4rem',
    marginLeft: '0.8rem'
  }
}

FontSizeDropdown.propTypes = {
  fontSize: PropTypes.number.isRequired,
  
  setFontSize: PropTypes.func.isRequired
}

export default FontSizeDropdown