import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Badge from 'components/Badge/index.jsx'
import Colors from 'helpers/Colors'

export default class TreeElement extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    const { treeElement } = this.props
    const childrenCount = treeElement.children.length
    const children =  treeElement.children.map((treeElement, index) => (
                        index >= 3 ?
                          false
                        :
                          <div key={`drag_handle_child_for_${treeElement.id}_${index}`} style={styles.child}></div>
                      ))
    const badge = <div style={styles.badge}>
                    <Badge>
                      <FormattedMessage
                        id="category.tree_element.dragging.children_count"
                        values={{childrenCount: childrenCount}}
                      />
                    </Badge>
                  </div>
    return (
      <div>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.dragHandle}></div>
            <div style={styles.name}>
              <div style={styles.indentation(this.props.treeElement.ancestry.split("/").length)} />
              <div>{this.props.treeElement.name}</div>
            </div>
          </div>
          {childrenCount > 0 ? badge : null}
        </div>
        {children}
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'relative',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,.4)',
    width: '50%',
    marginTop: '-30px',
    opacity: '.75'
  },
  dragHandle: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0
  },
  indentation: indentation => ({
    width: indentation * 25,
    flexShrink: 0
  }),
  row: {
    backgroundColor: Colors.white,
    display: "flex",
    alignItems: "center",
    padding: "4px 8px 3px 0",
    outline: `2px dashed ${Colors.blue.dark}`,
    cursor: "pointer",
    minHeight: "48px"
  },
  name: {
    flex: "2",
    wordWrap: "break-word",
    color: Colors.gray.darker,
    display: "flex",
    alignItems: "center",
    paddingRight: "8px"
  },
  badge: {
    position: 'absolute',
    left: '50px',
    bottom: '-8px'
  },
  child: {
    height: '3px',
    backgroundColor: Colors.gray.lightest,
    borderColor: Colors.gray.light,
    borderWidth: '0px 1px 1px 1px',
    borderStyle: 'solid',
    width: '50%'
  }
}

TreeElement.propTypes = {
  treeElement: PropTypes.object.isRequired
}
