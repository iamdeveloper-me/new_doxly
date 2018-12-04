import React from 'react'

export default class FullScreenBackdrop extends React.PureComponent {

  render() {
    return (
      <div style={styles.outerContainer}>
        <div style={styles.childrenContainer}>{this.props.children}</div>
        <div style={styles.colorBackdrop}></div>
      </div>
    )
  }

}

const styles = {
  outerContainer: {
    zIndex: '1000000'
  },
  childrenContainer: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    zIndex: '2'
  },
  colorBackdrop: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    zIndex: '1',
    backgroundColor: 'white',
    opacity: '.7'
  }
}
