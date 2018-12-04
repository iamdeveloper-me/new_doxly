import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import AddButton from 'components/Buttons/AddButton/index.jsx'
import Api from 'helpers/Api'
import Colors from 'helpers/Colors'
import EmptyStateButton from 'components/Buttons/EmptyStateButton/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import ToDos from './ToDos/index.jsx'

export default class ToDosContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hasToDos: false,
      complete: [],
      incomplete: [],
      isLoading: true
    }
    this.addToDo = this.addToDo.bind(this)
    this.getToDos = this.getToDos.bind(this)
    this.deleteToDo = this.deleteToDo.bind(this)
    this.insertEditableToDo = this.insertEditableToDo.bind(this)
    this.insertEditableToDo = _.debounce(this.insertEditableToDo, 200)
    this.removeEditableToDo = this.removeEditableToDo.bind(this)
    this.updateToDo = this.updateToDo.bind(this)
  }

  componentDidMount() {
    if (this.props.treeElement.id) {
      this.getToDos()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.treeElement.id !== this.props.treeElement.id) {
      this.setState({ isLoading: true })
      this.getToDos()
    }
  }

  getToDos() {
    const complete = []
    const incomplete = []
    const params = Params.fetch()
    Api.get(Routes.dealCategoryTreeElementToDos(params.deals, params.categories, this.props.treeElement.id, ['deal_entity_user.entity_user.user', 'due_dates']))
      .then((toDos) => {
        toDos.map((toDo) => {
          toDo.is_complete ? complete.push(toDo) : incomplete.push(toDo)
        })
        this.setState({
          complete: complete,
          incomplete: incomplete,
          hasToDos: toDos.length > 0,
          isLoading: false
        })
      })
  }

  insertEditableToDo() {
    if (_.findIndex(incomplete, {text: ""}) !== -1) {
      return false
    }
    let incomplete = _.cloneDeep(this.state.incomplete)
    const newToDo = { text: "", due_dates: [] }
    incomplete.unshift(newToDo)

    this.setState({
      incomplete: incomplete,
      hasToDos: true,
      selectedToDo: newToDo
    })
  }

  removeEditableToDo() {
    let complete = _.cloneDeep(this.state.complete)
    let incomplete = _.cloneDeep(this.state.incomplete)
    incomplete.shift()

    this.setState({
      incomplete: incomplete,
      hasToDos: complete.length > 0 || incomplete.length > 0,
      selectedToDo: null
    })
  }

  addToDo(toDo) {
    let originalIncomplete = _.cloneDeep(this.state.incomplete)
    const params = Params.fetch()

    if (toDo.text) {
      Api.post(Routes.dealCategoryTreeElementToDos(params.deals, params.categories, this.props.treeElement.id), toDo)
        .then((toDo) => {
          originalIncomplete.splice(0, 1)
          originalIncomplete.unshift(toDo)

          this.setState({
            incomplete: originalIncomplete,
            isLoading: false
          })
        })
    } else {
      this.removeEditableToDo()
    }
  }

  updateToDo(toDo, attribute) {
    const params = Params.fetch()
    let originalComplete = _.cloneDeep(this.state.complete)
    let originalIncomplete = _.cloneDeep(this.state.incomplete)
    const completeIndex = _.findIndex(originalComplete, { id: toDo.id })
    const incompleteIndex = _.findIndex(originalIncomplete, { id: toDo.id })

    Api.put(Routes.dealCategoryTreeElementToDo(params.deals, params.categories, this.props.treeElement.id, toDo.id, ['deal_entity_user.entity_user.user', 'due_dates']), toDo)
      .then((toDo) => {
        if (attribute === 'is_complete') {
          if (toDo.is_complete) {
            originalIncomplete.splice(incompleteIndex, 1)
            originalComplete.unshift(toDo)
          } else {
            originalComplete.splice(completeIndex, 1)
            originalIncomplete.push(toDo)
          }
        } else {
          toDo.is_complete ? originalComplete.splice(completeIndex, 1, toDo) : originalIncomplete.splice(incompleteIndex, 1, toDo)
        }

        this.setState({
          complete: originalComplete,
          incomplete: originalIncomplete,
          isLoading: false
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  deleteToDo(toDo) {
    let originalComplete = _.cloneDeep(this.state.complete)
    let originalIncomplete = _.cloneDeep(this.state.incomplete)
    const isComplete = toDo.is_complete
    const toDoId = toDo.id
    const params = Params.fetch()

    Api.delete(Routes.dealCategoryTreeElementToDo(params.deals, params.categories, this.props.treeElement.id, toDo.id))
      .then(() => {
        isComplete ?
          _.remove(originalComplete, { id: toDoId })
        :
          _.remove(originalIncomplete, { id: toDoId })

        this.setState({
          complete: originalComplete,
          incomplete: originalIncomplete,
          hasToDos: originalComplete.length > 0 || originalIncomplete.length > 0,
          isLoading: false
        })
      })
  }

  render() {
    const { complete, incomplete, hasToDos } = this.state
    const completeLength = complete.length
    const completeToDoText = <FormattedMessage id='category.sidebar.to_dos.completed_to_dos' values={{completedLength: completeLength}} />
    const toDoHeader = <FormattedMessage id='category.sidebar.to_dos.team_to_do' />
    const addToDoText = <FormattedMessage id='category.sidebar.to_dos.add_to_do' />
    const addToDoSubText = <FormattedMessage id='category.sidebar.to_dos.to_do_sub_text' />

    const completeHeader = (
      <div style={styles.completeHeader} >
        <div style={styles.completeTitle}>{completeToDoText}</div>
        <div style={styles.lineBreak}></div>
      </div>
    )

    const header = (
      <div style={styles.header}>
        <div style={styles.title}>{toDoHeader}</div>
        <AddButton
          text={addToDoText}
          addElement={this.insertEditableToDo}
          selectedElement={this.state.selectedToDo}
        />
      </div>
    )

    const emptyState = (
      <div style={styles.emptyState}>
        <EmptyStateButton
          header={toDoHeader}
          text={addToDoText}
          subText={addToDoSubText}
          addElement={this.insertEditableToDo}
        />
      </div>
    )

    const view = this.state.isLoading ?
                   <LoadingSpinner showLoadingBox={false} />
                 :
                  <div>
                    {hasToDos ? header : emptyState}
                    <div>
                      <ToDos
                        toDos={incomplete}
                        treeElement={this.props.treeElement}
                        addToDo={this.addToDo}
                        deleteToDo={this.deleteToDo}
                        updateToDo={this.updateToDo}
                      />
                      {complete.length > 0 ? completeHeader : null}
                      <ToDos
                        toDos={complete}
                        treeElement={this.props.treeElement}
                        addToDo={this.addToDo}
                        deleteToDo={this.deleteToDo}
                        updateToDo={this.updateToDo}
                      />
                    </div>
                  </div>

    return (
      <div style={styles.container}>
        {view}
      </div>
    )
  }

}

const styles = {
  emptyState: {
    paddingLeft: '20px'
  },
  container: {
    backgroundColor: Colors.white,
    padding: '20px 0px',
    borderTop: `1px solid ${Colors.gray.lighter}`,
    color: Colors.gray.darkest,
    fontSize: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 20px 16px 20px',
  },
  title: {
    textTransform: 'uppercase'
  },
  completeHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px 0px 20px',
    opacity: '0.5'
  },
  completeTitle: {
    minWidth: '100px',
    paddingBottom: '8px',
    whiteSpace: 'nowrap',
    marginRight: '8px'
  },
  lineBreak: {
    height: '1px',
    background: Colors.gray.darkest,
    width: '69%',
    margin: '0 0 8px 4px'
  }
}

ToDosContainer.propTypes = {
  treeElement: PropTypes.object.isRequired
}
