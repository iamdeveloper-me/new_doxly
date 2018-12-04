import FileSaver from 'file-saver'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import Schema from 'helpers/Schema'

const formats = {
  'html_index': '.zip',
  'pdf_index': '.zip',
  'pdf_compilation': '.pdf'
}

class ClosingBookInfo extends React.PureComponent {
  constructor(props) {
    super(props)
    this.downloadClosingBook = this.downloadClosingBook.bind(this)
    this.getFileName = this.getFileName.bind(this)
  }

  downloadClosingBook() {
    const params = Params.fetch()
    Api.getFile(Routes.dealClosingBookDownload(params.deals, this.props.closingBook.id))
      .then((blob) => {
        FileSaver.saveAs(blob, this.getFileName())
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  getFileName() {
    const { closingBook } = this.props
    return `${closingBook.name.replace(/\s/g, "_")}${formats[closingBook.format]}`
  }

  render() {
    const { closingBook } = this.props

    return(
      <div style={styles.container}>
        <div style={styles.title}><h4><FormattedMessage id={`closing_books.sidebar.info.title`} /></h4></div>
        <div style={styles.filename}>{this.getFileName()}</div>
        <div style={styles.format}><FormattedMessage id={`closing_books.format.${closingBook.format}`} /></div>
        <div style={styles.created}>
          <FormattedMessage
            id='closing_books.sidebar.info.created'
            values={{
              firstName: closingBook.creator.entity_user.user.first_name,
              lastName: closingBook.creator.entity_user.user.last_name,
              date: moment(closingBook.created_at).format('MM/DD/YYYY[,] h:mm a')
            }}
          />
        </div>
        <div style={styles.button}>
          <Button
            icon='download'
            type='primary'
            text={<FormattedMessage id="closing_books.sidebar.download" />}
            onClick={this.downloadClosingBook}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  button: {
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    background: Colors.white,
    minHeight: '16rem',
    width: '36rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    border: `solid .1rem ${Colors.whiteout.status.gray}`,
    borderRadius: '.4rem',
    padding: '1.2rem'
  },
  created: {
    color: Colors.whiteout.darkGray,
    paddingBottom: '1.6rem'
  },
  format: {
    paddingBottom: '.4rem',
    color: Colors.whiteout.darkGray
  },
  filename: {
    padding: '1.2rem 0 .4rem 0',
    wordWrap: 'break-word'
  },
  title: {
    paddingBottom: '.4rem'
  }
}

ClosingBookInfo.propTypes = {
  closingBook: Schema.closingBook.isRequired
}

export default ClosingBookInfo
