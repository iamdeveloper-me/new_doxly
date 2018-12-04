import React from 'react'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'

export default class ReservedContainer extends React.PureComponent {

  render() {

    return (
      <div style={styles.reserved}>
        <div style={styles.icon}>
          <img src={Assets.getPath('reserved.svg')} />
          <div style={styles.text}>[Reserved]</div>
        </div>
      </div>
    )
  }

}

const styles = {
  reserved: {
    height: '100%',
    width: '30%',
    backgroundColor: Colors.background.sidebar
  },
  icon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '100px'
  },
  text: {
    alignSelf: 'center',
    paddingLeft: '20px',
    fontStyle: 'italic',
    fontSize: '20px',
    color: Colors.gray.darkest
  }
}
