import _ from 'lodash'
import React from 'react'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

import Api from 'helpers/Api'
import ClosingBookCreateWizard from './ClosingBookCreateWizard/index.jsx'
import ClosingBooksEmptyState from './ClosingBooksEmptyState/index.jsx'
import ClosingBookSidebar from './ClosingBookSidebar/index.jsx'
import ClosingBooksTable from './ClosingBooksTable/index.jsx'
import ClosingBooksToolbar from './ClosingBooksToolbar/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

export default class ClosingBooks extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      closingBooks: [],
      loading: true,
      selectedClosingBookId: null,
      createWizardOpen: false
    }
    this.createClosingBook = this.createClosingBook.bind(this)
    this.deleteClosingBook = this.deleteClosingBook.bind(this)
    this.selectClosingBook = this.selectClosingBook.bind(this)
    this.selectedClosingBookId = this.selectClosingBook.bind(this)
    this.toggleCreateWizard = this.toggleCreateWizard.bind(this)
    this.updateClosingBook = this.updateClosingBook.bind(this)
  }

  componentDidMount() {
    // make API call to get closing books
    const params = Params.fetch()
    Api.get(Routes.dealClosingBooks(params.deals, ['closing_book_documents.critical_errors', 'creator.entity_user.user']))
      .then((closingBooks) => {
        this.setState({
          closingBooks,
          loading: false
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  createClosingBook(closingBook) {
    const prevState = _.cloneDeep(this.state)

    const params = Params.fetch()
    Api.post(Routes.dealClosingBooks(params.deals, ['closing_book_documents.critical_errors', 'creator.entity_user.user']), closingBook)
      .then((closingBookResponse) => {
        this.setState({
          closingBooks: [closingBookResponse, ...this.state.closingBooks],
          selectedClosingBookId: closingBookResponse.id,
          createWizardOpen: false
        })
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  deleteClosingBook(closingBookId) {
    const prevState = _.cloneDeep(this.state)

    this.setState({
      selectedClosingBookId: null,
      closingBooks: _.filter(this.state.closingBooks, closingBook => closingBook.id !== closingBookId)
    })

    const params = Params.fetch()
    Api.delete(Routes.dealClosingBook(params.deals, closingBookId))
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  selectClosingBook(closingBookId) {
    this.setState({ selectedClosingBookId: closingBookId })
  }

  toggleCreateWizard() {
    this.setState({ createWizardOpen: !this.state.createWizardOpen })
  }

  updateClosingBook(closingBook) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)

    Api.put(Routes.dealClosingBook(params.deals, closingBook.id, ['closing_book_documents.critical_errors', 'creator.entity_user.user']), closingBook)
      .then((closingBookResponse) => {
        const closingBooks = _.cloneDeep(this.state.closingBooks)
        let existingClosingBook = _.find(closingBooks, { id: closingBook.id })
        _.merge(existingClosingBook, closingBookResponse)
        this.setState({ closingBooks })
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  render() {
    let view = null
    if (this.state.loading) {
      view = <LoadingSpinner />
    } else if (this.state.closingBooks.length > 0) {
      view = (
        <div style={styles.tableContainer}>
          <ClosingBooksToolbar
            toggleCreateWizard={this.toggleCreateWizard}
          />
          <ClosingBooksTable
            closingBooks={this.state.closingBooks}
            selectedClosingBookId={this.state.selectedClosingBookId}
            selectClosingBook={this.selectClosingBook}
          />
        </div>
      )
    } else {
      view = (
        <ClosingBooksEmptyState
          toggleCreateWizard={this.toggleCreateWizard}
        />
      )
    }

    const selectedClosingBook = _.find(this.state.closingBooks, { id: this.state.selectedClosingBookId })
    return (
      <div className="whiteout-ui" style={styles.wrapper}>
        {this.state.createWizardOpen ?
          <ClosingBookCreateWizard
            createClosingBook={this.createClosingBook}
            toggleCreateWizard={this.toggleCreateWizard}
          />
        :
          <div style={styles.container}>
            {view}
            <ClosingBookSidebar
              closingBook={selectedClosingBook}
              deleteClosingBook={this.deleteClosingBook}
              hide={() => this.setState({ selectedClosingBookId: null })}
              updateClosingBook={this.updateClosingBook}
            />
          </div>
        }
      </div>
    )
  }
}

const styles = {
  wrapper: {
    height: '100%'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
}
