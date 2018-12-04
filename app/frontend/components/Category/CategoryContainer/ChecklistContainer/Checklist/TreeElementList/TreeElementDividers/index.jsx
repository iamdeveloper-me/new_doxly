import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Schema from 'helpers/Schema'
import TreeElementDivider from './TreeElementDividerContainer/TreeElementDivider/index.jsx'
import TreeElementDividerContainer from './TreeElementDividerContainer/index.jsx'

export default class TreeElementDividers extends React.PureComponent {

  render() {
    const { categoryType, expanded, indentation, lastChildren, originalTree, parentTreeElement, treeElement } = this.props
    const { addTreeElement, moveTreeElement } = this.props

    const getDividers = () => {
      const children = _.drop(lastChildren)
      // add one for a my child
      let dividers = []
      if (!(categoryType === 'DiligenceCategory' && treeElement.type === 'Document')) {
        dividers.push(
          <TreeElementDivider
            key={`${treeElement.id}_${dividers.length}`}
            addTreeElement={addTreeElement}
            moveTreeElement={moveTreeElement}
            indentation={indentation+1}
            parentTreeElement={treeElement}
            treeElementBefore={null}
            treeElementAfter={_.first(treeElement.children)}
            first={treeElement.children.length > 0 && expanded}
          />
        )
      }

      // add one for my sibling IF I don't have any children OR if I'm not expanded
      if (treeElement.children.length === 0 || !expanded) {
        const siblings = parentTreeElement ? parentTreeElement.children : originalTree
        const afterIndex = _.findIndex(siblings, {id: treeElement.id})+1
        const treeElementAfter = siblings.length > afterIndex ? siblings[afterIndex] : null
        dividers.push(
          <TreeElementDivider
            key={`${treeElement.id}_${dividers.length}`}
            addTreeElement={addTreeElement}
            moveTreeElement={moveTreeElement}
            indentation={indentation}
            parentTreeElement={parentTreeElement}
            treeElementBefore={treeElement}
            treeElementAfter={treeElementAfter}
            first={!(_.includes(treeElement.ancestry, '/')) || (_.indexOf(children, true) === -1)}
          />
        )
      } else {
        return dividers
      }

      // add one for my parent IF I am the last child -> repeat
      if (_.includes(treeElement.ancestry, '/') && _.last(children)) {

        let numberOfTrues = 0

        // find parents
        let parents = []
        let ancestry = _.split(treeElement.ancestry, '/')
        ancestry.splice(0, 1)
        parents.push({ children: originalTree })
        let tree = originalTree
        _.each(ancestry, function(id) {
          const newTreeElement = _.find(tree, { id: parseInt(id) })
          tree = newTreeElement.children
          parents.push(newTreeElement)
        })

        _.each(_.reverse(children), (value, index) => {
          if (value) {
            let after = null
            let afterIndex = null
            const parentIndex = index+2
            const parent = parents[parents.length-parentIndex] || null
            const before = parents[parents.length-(index+1)] || null
            if (parent) {
              afterIndex = _.findIndex(parent.children, { id: before.id })+1
              after = afterIndex < parent.children.length ? parent.children[afterIndex] : null
            }
            dividers.push(
              <TreeElementDivider
                key={`${treeElement.id}_${dividers.length}`}
                addTreeElement={addTreeElement}
                moveTreeElement={moveTreeElement}
                indentation={indentation-(1+numberOfTrues++)}
                parentTreeElement={parentIndex === parents.length ? null : parent}
                treeElementBefore={before}
                treeElementAfter={after}
                first={_.lastIndexOf(children, true) === index}
              />
            )
          } else {
            return false
          }
        })
      }
      return dividers
    }

    return <TreeElementDividerContainer dividers={getDividers()} />
  }

}



TreeElementDividers.propTypes = {
  categoryType: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentTreeElement: Schema.treeElement,
  treeElement: Schema.treeElement.isRequired,

  addTreeElement: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired
}
