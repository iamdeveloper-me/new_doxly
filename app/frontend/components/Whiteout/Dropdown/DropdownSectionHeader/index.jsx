import React from 'react'

const DropdownSectionHeader = ({ children }) => {
  return (
    <div style={styles.dropdownSectionHeader}>
      {children}
    </div>
  )
}

const styles = {
  dropdownSectionHeader: {
    padding: '1rem 0'
  }
}

export default DropdownSectionHeader
