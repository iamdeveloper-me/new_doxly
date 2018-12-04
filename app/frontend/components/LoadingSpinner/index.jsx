import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Assets from 'helpers/Assets'

export default class LoadingSpinner extends React.PureComponent {

  render() {
    const { loadingText, showLoadingBox, showLoadingText, type } = this.props
    const types = {
      'blue': { color: Colors.blue.dark, img: Assets.getPath('loading-spin.svg') },
      'pink': { color: Colors.pink.darker, img: Assets.getPath('loading-spin-pink.svg') },
    }
    return (
      <div style={styles.spinner}>
        <div style={showLoadingBox ? styles.loadingBox : styles.invisibleLoadingBox}>
          <img src={types[type].img} />
          {showLoadingText ?
            <div style={styles.text(types[type].color)}>{loadingText}</div>
          :
            null
          }
        </div>
      </div>
    )
  }

}

const styles = {
  spinner: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingBox: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    background: 'white',
    boxShadow: '0 1px 2px 0px rgba(0,0,0,.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  invisibleLoadingBox: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: color => ({
    color: color,
    paddingTop: color === '#273343' ? 0 : '10px',
    marginLeft: color === '#273343' ? '8px' : '0'
  })
}

LoadingSpinner.defaultProps = {
  loadingText: <span>Loading...</span>,
  showLoadingBox: true,
  showLoadingText: true,
  type: 'blue'
}

LoadingSpinner.propTypes = {
  loadingText: PropTypes.object,
  showLoadingBox: PropTypes.bool,
  showLoadingText: PropTypes.bool,
  type: PropTypes.string
}
