import PropTypes from 'prop-types'
import React from 'react'

import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow,
  DropdownTrigger
} from 'components/Whiteout/Dropdown/index.jsx'

const fonts = ['Arial', 'Courier', 'Times New Roman', 'Verdana', 'Calibri']

const FontDropdown = ({ font, setFont }) => (
  <Dropdown
    trigger={
      <DropdownTrigger
        text={<span style={styles.font(font)}>{font}</span>}
      />
    }
    content={
      <DropdownRow>
        <DropdownColumn>
          {
            fonts.map(font => (
              <DropdownItem key={`font_${font}`} onClick={() => setFont(font)}>
                <span style={styles.font(font)}>{font}</span>
              </DropdownItem>
            ))
          }
        </DropdownColumn>
      </DropdownRow>
    }
  />
)

const styles = {
  font: font => ({
    fontFamily: font
  })
}

FontDropdown.propTypes = {
  font: PropTypes.string.isRequired,
  
  setFont: PropTypes.func.isRequired
}

export default FontDropdown