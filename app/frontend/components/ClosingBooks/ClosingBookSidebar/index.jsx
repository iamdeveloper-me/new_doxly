import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl'

import ClosingBookContent from './ClosingBookContent/index.jsx'
import Colors from 'helpers/Colors'
import EditableText from 'components/EditableText/index.jsx'
import InlineEdit from 'components/InlineEdit/index.jsx'
import Schema from 'helpers/Schema'
import Sidebar from 'components/Whiteout/Sidebar/index.jsx'

class ClosingBookSidebar extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { closingBook } = this.props
    const { deleteClosingBook, hide, updateClosingBook } = this.props

    return (
      <Sidebar
        hide={hide}
        shown={closingBook !== null}
      >
      {closingBook ?
        <ClosingBookContent
          closingBook={closingBook}
          deleteClosingBook={deleteClosingBook}
          updateClosingBook={updateClosingBook}
        />
      :
        null
      }
      </Sidebar>
    )
  }
}
const styles = {
  name: {
    fontSize: '1.6rem',
    padding: '2rem 0 .8rem 1.6rem',
    color: Colors.gray.darkest
  },
  description: {
    fontSize: '1.2rem',
    padding: '0rem 0 1rem 1.6rem',
    color: Colors.gray.normal,
    maxHeight: '10rem',
    overflow: 'auto'
  }
}

ClosingBookSidebar.defaultProps = {
  closingBook: null
}

ClosingBookSidebar.propTypes = {
  closingBook: Schema.closingBook,

  deleteClosingBook: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired
}

export default injectIntl(ClosingBookSidebar)
