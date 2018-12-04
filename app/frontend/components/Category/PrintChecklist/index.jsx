import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Category from 'components/Category/index.jsx'
import Colors from 'helpers/Colors'
import Lightbox from 'components/Lightbox/index.jsx'
import PrintChecklistHeader from './PrintChecklistHeader/index.jsx'

export default class PrintChecklist extends React.PureComponent {

  constructor(props) {
    super(props)
    this.print = this.print.bind(this)
  }

  print() {
    window.print()
  }

  render() {
    const { hide } = this.props
    const header = <PrintChecklistHeader hide={hide} print={this.print} />

    return (
      <Lightbox header={header}>
        <div style={styles.paper}>
          <Category />
        </div>
      </Lightbox>
    )
  }
}

const styles = {
}

PrintChecklist.propTypes = {
  hide: PropTypes.func.isRequired
}
