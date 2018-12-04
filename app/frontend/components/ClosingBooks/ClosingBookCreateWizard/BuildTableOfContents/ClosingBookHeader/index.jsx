import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import ClosingBookIndexItem from '../ClosingBookIndexItem/index.jsx'

export default class ClosingBookHeader extends React.PureComponent {

  render() {
    return (
      <ClosingBookIndexItem
        name={<FormattedMessage id='closing_books.create_wizard.build_table_of_contents.document' />}
        tabNumber={<FormattedMessage id='closing_books.create_wizard.build_table_of_contents.tab_number' />}
        style={styles.container}
      />
    )
  }

}

const styles = {
  container: {
    marginBottom: '3.2rem',
    color: Colors.whiteout.text.light
  }
}
