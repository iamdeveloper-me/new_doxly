import PropTypes from 'prop-types'
import React from 'react'

import ToDo from './ToDo/index.jsx'

export default class ToDos extends React.PureComponent {

  render() {
    const { toDos, treeElement } = this.props
    const { addToDo, deleteToDo, updateToDo } = this.props
    const toDosList = (
      toDos.map((toDo, index) => (
        <ToDo
          key={toDo.id || index}
          index={index}
          toDo={toDo}
          treeElement={treeElement}
          addToDo={addToDo}
          deleteToDo={deleteToDo}
          updateToDo={updateToDo}
        />
      ))
    )

    return (
      <div>{toDosList}</div>
    )
  }

}

ToDos.propTypes = {
  toDos: PropTypes.array,
  treeElement: PropTypes.object.isRequired,

  addToDo: PropTypes.func.isRequired,
  deleteToDo: PropTypes.func.isRequired,
  updateToDo: PropTypes.func.isRequired
}
