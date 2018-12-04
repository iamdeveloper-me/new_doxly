import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingChecklistNumber from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import Colors from 'helpers/Colors'

export default class TreeElement extends React.PureComponent {

  render(){
    const { indentation, signaturePacketReviewDocuments, treeElement } = this.props
    const { createSignaturePacketReviewDocumentFromChecklist } = this.props
    // only show plus icon if attachment present and there is no signaturePacketReviewDocument that already exists for the tree element.
    const showPlusIcon = treeElement.attachment && (!_.some(signaturePacketReviewDocuments, { tree_element_id: treeElement.id }))

    // build all the child treeElement components
    const children = (
      treeElement.children.map((child) => {
        return (
          <TreeElement
            key={child.id}
            treeElement={child}
            indentation={indentation + 1}
            signaturePacketReviewDocuments={signaturePacketReviewDocuments}
            createSignaturePacketReviewDocumentFromChecklist={createSignaturePacketReviewDocumentFromChecklist}
          />
        )
      })
    )
    return (
      <div style={styles.treeElementContainer}>
        <div style={styles.treeElementHeader(indentation)}>
          <div style={styles.centerBox}>
            <ClosingChecklistNumber indentation={indentation} position={treeElement.position} />
            <div style={styles.name(!showPlusIcon)}>
              {treeElement.name}
            </div>
          </div>
          <div style={styles.rightBox}>
            {
              showPlusIcon ?
                <i style={styles.plusIcon} onClick={() => createSignaturePacketReviewDocumentFromChecklist(treeElement)} className="mdi mdi-plus mdi-24px"></i>
              :
                null
            }
          </div>
        </div>
        <div style={styles.childrenContainer}>
          {children}
        </div>
      </div>
    )
  }
}

const styles = {
  centerBox: {
    flexGrow: '1',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden'
  },
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: disabled => ({
    color: Colors.whiteout.text.light,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontStyle: disabled ? 'italic' : 'normal',
    opacity: disabled ? '0.65' : '1'
  }),
  treeElementContainer:{
    width: '100%'
  },
  treeElementHeader: indentation => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: `.8rem .8rem .8rem ${(indentation * 25 + 45)/10}rem`,
    borderBottom: `dotted .1rem ${Colors.whiteout.status.gray}`
  }),
  rightBox: {
    color: Colors.whiteout.blue,
    width: '5.6rem',
    flexShrink: '0',
    paddingLeft: '1.6rem',
    minHeight: '2.8rem'
  },
  plusIcon: {
    cursor: 'pointer',
    paddingLeft: '1.6rem',
    minHeight: '2.8rem'
  }
}

TreeElement.propTypes = {
  indentation: PropTypes.number.isRequired,
  signaturePacketReviewDocuments: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  createSignaturePacketReviewDocumentFromChecklist: PropTypes.func.isRequired
}
