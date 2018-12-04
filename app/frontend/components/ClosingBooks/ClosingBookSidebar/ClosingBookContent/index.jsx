import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Alert from 'components/Whiteout/Alert/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import ClosingBookDocument from './ClosingBookDocument/index.jsx'
import ClosingBookDocuments from './ClosingBookDocuments/index.jsx'
import ClosingBookErrors from './ClosingBookErrors/index.jsx'
import ClosingBookInfo from './ClosingBookInfo/index.jsx'
import Colors from 'helpers/Colors'
import EditableText from 'components/EditableText/index.jsx'
import InlineEdit from 'components/InlineEdit/index.jsx'
import Schema from 'helpers/Schema'
import Sidebar from 'components/Whiteout/Sidebar/index.jsx'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
} from 'components/Whiteout/Tooltipster/index.jsx'

class ClosingBookContent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
    this.toggleTooltip = this.toggleTooltip.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
  }

  toggleTooltip(showTooltip = !this.state.showTooltip) {
    this.setState({ showTooltip })
  }

  setAttribute(key, value) {
    let closingBook = _.cloneDeep(this.props.closingBook)
    closingBook[key] = value
    this.props.updateClosingBook(closingBook)
  }

  render() {
    const { closingBook, intl } = this.props
    const { deleteClosingBook, updateClosingBook } = this.props
    const closingBookDocumentsWithErrors = _.filter(closingBook.closing_book_documents, closingBookDocument => !_.isEmpty(closingBookDocument.critical_errors))
    let alert = null
    switch(closingBook.status) {
      case 'failed':
        alert = (
          <div style={styles.content}>
            <div style={styles.errorContent}>
              <Alert
                status='error'
                messageTitle={<FormattedMessage id='closing_books.sidebar.error_title' />}
                explanation={
                  <span>
                    <FormattedMessage id='closing_books.sidebar.error_message' />
                    <br /><br />
                    <FormattedMessage
                      id='closing_books.sidebar.error_contact'
                      values={{
                        email: <a href='mailto:support@doxly.com'><FormattedMessage id='closing_books.sidebar.support' /></a>
                      }}
                    />
                  </span>
                }
              />
            </div>
            <ClosingBookErrors
              closingBookDocumentsWithErrors={closingBookDocumentsWithErrors}
            />
          </div>
        )
        break
      case 'in_progress':
        alert = (
          <div style={styles.alert}>
            <Alert
              messageTitle={<FormattedMessage id='closing_books.table.alerts.in_progress' />}
              message={<FormattedMessage id='closing_books.table.alerts.in_progress_message' />}
            />
          </div>
        )
        break
      case 'complete':
        alert = null
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.nameAndDescription}>
            <EditableText
              style={styles.name}
              label={intl.formatMessage({id: 'closing_books.sidebar.closing_book_name_label'})}
              value={closingBook.name}
              placeholder={intl.formatMessage({id: 'closing_books.sidebar.closing_book_name'})}
              handleSubmit={value => this.setAttribute('name', value)}
            />
            <EditableText
              style={styles.description}
              label={intl.formatMessage({id: 'closing_books.sidebar.closing_book_description_label'})}
              value={closingBook.description}
              placeholder={intl.formatMessage({id: 'closing_books.sidebar.closing_book_description'})}
              handleSubmit={value => this.setAttribute('description', value)}
            />
          </div>
          <div style={styles.delete}>
            <Tooltipster
              open={this.state.showTooltip}
              triggerElement={
                <div
                  className='mdi mdi-delete'
                  onClick={() => this.toggleTooltip(true)}
                >
                </div>
              }
              content={
                <div className="do-not-hide-sidebar">
                  <TooltipsterBody>
                    <TooltipsterHeader>
                      <p><FormattedMessage id='closing_books.sidebar.delete_closing_book' /></p>
                    </TooltipsterHeader>
                    <TooltipsterText>
                      <p className="gray"><FormattedMessage id='closing_books.sidebar.permanently_remove' /></p>
                    </TooltipsterText>
                    <TooltipsterButtons>
                      <Button
                        size='small'
                        type='secondary'
                        text={intl.formatMessage({id: 'buttons.cancel'})}
                        onClick={() => this.toggleTooltip(false)}
                      />
                      <Button
                        size='small'
                        type='removal'
                        text={intl.formatMessage({id: 'buttons.delete'})}
                        icon='delete'
                        onClick={() => deleteClosingBook(closingBook.id)}
                      />
                    </TooltipsterButtons>
                  </TooltipsterBody>
                </div>
              }
              interactive={true}
              repositionsOnScroll={true}
              side='bottom'
              theme='tooltipster-doxly-whiteout'
              onClickOutside={() => this.toggleTooltip(false)}
            />
          </div>
        </div>
        {alert !== null ?
          alert
        :
          <div style={styles.content}>
            <ClosingBookInfo
              closingBook={closingBook}
            />
            <ClosingBookDocuments
              closingBookDocuments={closingBook.closing_book_documents}
            />
          </div>
        }
      </div>
    )
  }
}

const styles = {
  alert: {
    padding: '1.6rem 1.6rem 0 1.6rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'hidden'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'hidden'
  },
  errorContent: {
    padding: '1.6rem 1.6rem 0 1.6rem'
  },
  name: {
    fontSize: '1.8rem',
    padding: '2rem 0 .8rem 0',
    color: Colors.gray.darkest,
    maxWidth: '100%'
  },
  description: {
    fontSize: '1.4rem',
    padding: '0rem 0 1rem 0',
    color: Colors.gray.normal,
    maxHeight: '10rem',
    overflow: 'auto',
    maxWidth: '100%'
  },
  nameAndDescription: {
    flexGrow: '1',
    marginLeft: '1.6rem',
    maxWidth: '80%'
  },
  delete: {
    flexShrink: '0',
    color: Colors.whiteout.carmine,
    fontSize: '2rem',
    margin: '1.2rem',
    height: '3rem',
    width: '3rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    width: '100%',
    flexShrink: '0'
  }
}

ClosingBookContent.defaultProps = {
  closingBook: null
}

ClosingBookContent.propTypes = {
  closingBook: Schema.closingBook,
  intl: intlShape.isRequired
}

export default injectIntl(ClosingBookContent)
