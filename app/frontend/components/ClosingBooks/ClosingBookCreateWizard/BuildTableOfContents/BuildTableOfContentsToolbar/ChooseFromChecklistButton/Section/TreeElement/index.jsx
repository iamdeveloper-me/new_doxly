import _ from 'lodash'
import { DragSource } from 'react-dnd'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingBookDragHandle from 'components/ClosingBooks/ClosingBookCreateWizard/BuildTableOfContents/ClosingBookDragHandle/index.jsx'
import ClosingChecklistNumber from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import SupportedFileTypes from 'components/ClosingBooks/ClosingBookCreateWizard/SupportedFileTypes'
import {
  Tooltipster,
  TooltipsterBody,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

class TreeElementClass extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showInfoTooltip: false
    }
    this.openInfoTooltip = this.openInfoTooltip.bind(this)
    this.closeInfoTooltip = this.closeInfoTooltip.bind(this)
  }

  openInfoTooltip() {
    this.setState({ showInfoTooltip: true })
  }

  closeInfoTooltip() {
    this.setState({ showInfoTooltip: false })
  }

  render() {
    const { closingBookSections, indentation, isDragging, treeElement } = this.props
    const { connectDragSource, setIsDragging } = this.props

    const inClosingBook = (
      _.some(closingBookSections, closingBookSection => (
        _.some(closingBookSection.closing_book_documents, { document_id: treeElement.id })
      ))
    )
    const canChoose = treeElement.type === 'Document' && _.get(treeElement, 'attachment.latest_version.conversion_successful', false) && _.includes(SupportedFileTypes, treeElement.attachment.latest_version.file_type)
    const canDrag = canChoose && !inClosingBook

    // build all the child treeElement components
    const children = (
      treeElement.children.map((child) => {
        return (
          <TreeElement
            key={child.id}
            treeElement={child}
            indentation={indentation + 1}
            closingBookSections={closingBookSections}
            setIsDragging={setIsDragging}
          />
        )
      })
    )

    let infoMessage = null
    if (!canDrag) {
      if (inClosingBook) {
        infoMessage = <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.document_already_in_closing_book' /></p>
      } else if (!canChoose && treeElement.type !== 'Document') {
          infoMessage = <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.cannot_include_tasks' /></p>
      } else if (treeElement.attachment && !canChoose) {
        infoMessage = (
          <div>
            <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.unable_to_convert_to_pdf' /></p>
            <br />
            <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.supported_file_types' /></p>
          </div>
        )
      } else if (!canChoose) {
        infoMessage = <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.no_file_uploaded' /></p>
      }
    }
    const infoTooltip = (
      <Tooltipster
        open={this.state.showInfoTooltip}
        triggerElement={
          <div
            onMouseEnter={this.openInfoTooltip}
            onMouseLeave={this.closeInfoTooltip}
          >
            <i className="mdi mdi-help-circle-outline" aria-hidden="true"></i>
          </div>
        }
        content={
          <TooltipsterBody>
            {infoMessage}
          </TooltipsterBody>
        }
        repositionsOnScroll={true}
        side='bottom'
        theme='tooltipster-doxly-whiteout'
        onClickOutside={this.closeInfoTooltip}
      />
    )

    return (
      <div style={styles.treeElementContainer}>
        {connectDragSource(
          <div style={styles.treeElementHeader(canDrag)}>
            <div style={styles.dragHandle}>
              <ClosingBookDragHandle disabled={!canDrag} />
            </div>
            <div style={styles.indentation(indentation)}></div>
            <div style={styles.centerBox}>
              <ClosingChecklistNumber
                indentation={indentation}
                position={treeElement.position}
                numberingStyle={canDrag ? null : styles.position}
              />
              <div style={styles.name(canDrag)}>
                {treeElement.name}
              </div>
            </div>
            <div style={styles.infoBox}>
              {canDrag ? null : infoTooltip}
            </div>
          </div>
        )}
        <div style={styles.childrenContainer}>
          {children}
        </div>
      </div>
    )
  }
}

/**
 * Implements the drag source contract.
 */
const documentSource = {
  beginDrag(props) {
    const { treeElement } = props
    props.setIsDragging(treeElement.id, false)
    return {
      closingBookDocument: {
        document_id: treeElement.id,
        name: treeElement.name,
        tab_number: null,
        section_id: null,
        url: _.get(treeElement, 'attachment.latest_version.url', '')
      },
      documentIndex: null
    }
  },
  canDrag(props) {
    const { closingBookSections, treeElement } = props
    const inClosingBook = (
      _.some(closingBookSections, closingBookSection => (
        _.some(closingBookSection.closing_book_documents, { document_id: treeElement.id })
      ))
    )
    const canChoose = treeElement.type === 'Document' && _.get(treeElement, 'attachment.latest_version.conversion_successful', false) && _.includes(SupportedFileTypes, treeElement.attachment.latest_version.file_type)
    return canChoose && !inClosingBook
  },
  endDrag(props) {
    props.setIsDragging(null)
  }
}

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
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
  name: canDrag => ({
    color: Colors.whiteout.text.light,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontStyle: canDrag ? 'normal' : 'italic',
    opacity: canDrag ? '1' : '0.25'
  }),
  treeElementContainer:{
    width: '100%'
  },
  treeElementHeader: canDrag => ({
    cursor: canDrag ? 'move' : 'default',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: `.8rem .8rem .8rem 0`,
    borderBottom: `dotted .1rem ${Colors.whiteout.status.gray}`
  }),
  indentation: indentation => ({
    width: `${(indentation * 25 + 45)/10}rem`,
    flexShrink: '0'
  }),
  infoBox: {
    color: Colors.whiteout.blue,
    flexShrink: '0',
    paddingLeft: '1.6rem',
    paddingRight: '0.4rem',
    minHeight: '2.8rem',
    display: 'flex',
    alignItems: 'center'
  },
  dragHandle: {
    width: '2.4rem',
    marginLeft: '0.4rem',
    flexShrink: '0'
  },
  position: {
    opacity: '0.25',
    fontStyle: 'italic'
  }
}

TreeElementClass.propTypes = {
  closingBookSections: PropTypes.array.isRequired,
  indentation: PropTypes.number.isRequired,
  treeElement: PropTypes.object.isRequired,

  setIsDragging: PropTypes.func.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
}

const TreeElement = DragSource(DragDropItemTypes.CLOSING_BOOK_DOCUMENT, documentSource, collect)(TreeElementClass)
export default TreeElement
