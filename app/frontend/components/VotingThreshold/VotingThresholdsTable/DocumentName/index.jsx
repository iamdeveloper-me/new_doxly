import PropTypes from 'prop-types'
import React from 'react'

export default class DocumentName extends React.PureComponent {

  render() {
    const { document } = this.props
    return (
      <div style={styles.container}>
        {document.name}
      </div>
    )
  }

}

const styles = {
  container: {
    minWidth: '25.6rem',
    overflow: 'auto',
    padding: '0.8rem'
  }
}

DocumentName.propTypes = {
  document: PropTypes.object.isRequired
}