import { DragSource } from 'react-dnd'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingBookDragHandle from 'components/ClosingBooks/ClosingBookCreateWizard/BuildTableOfContents/ClosingBookDragHandle/index.jsx'
import ClosingChecklistNumber from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import TreeElement from './TreeElement/index.jsx'
import SupportedFileTypes from 'components/ClosingBooks/ClosingBookCreateWizard/SupportedFileTypes'
import {
  Tooltipster,
  TooltipsterBody,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

class Section extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showChildren: true,
      showInfoTooltip: false
    }
    this.toggle = this.toggle.bind(this)
    this.openInfoTooltip = this.openInfoTooltip.bind(this)
    this.closeInfoTooltip = this.closeInfoTooltip.bind(this)
  }

  openInfoTooltip() {
    this.setState({ showInfoTooltip: true })
  }

  closeInfoTooltip() {
    this.setState({ showInfoTooltip: false })
  }

  toggle() {
    this.setState({
      showChildren: !this.state.showChildren
    })
  }

  render() {
    const { indentation, isDragging, section, closingBookSections } = this.props
    const { connectDragSource, setIsDragging } = this.props
    const { showChildren } = this.state

    const inClosingBook = _.some(closingBookSections, { tree_element_id: section.id })
    const canDrag = !inClosingBook
    const chevronDirection = showChildren ? 'down' : 'right'
    const children = (
      section.children.map((child) => {
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
            <p className='note gray'><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.section_already_in_closing_book' /></p>
          </TooltipsterBody>
        }
        repositionsOnScroll={true}
        side='bottom'
        theme='tooltipster-doxly-whiteout'
        onClickOutside={this.closeInfoTooltip}
      />
    )

    return (
      <div style={styles.sectionContainer}>
        {connectDragSource(
          <div style={styles.sectionHeader(canDrag)}>
            <div style={styles.dragHandle}>
              <ClosingBookDragHandle disabled={!canDrag} />
            </div>
            <div style={styles.toggle} onClick={this.toggle}>
              <i className={`mdi mdi-chevron-${chevronDirection} mdi-24px`}></i>
            </div>
            <div style={styles.centerBox}>
              <div style={styles.checklistNumber}>
                <ClosingChecklistNumber
                  indentation={indentation}
                  position={section.position}
                  numberingStyle={canDrag ? null : styles.position}
                />
              </div>
              <div style={styles.name(canDrag)}>
                {section.name}
              </div>
            </div>
            <div style={styles.infoBox}>
              {canDrag ? null : infoTooltip}
            </div>
          </div>
        )}
        <div style={styles.childrenContainer}>
          {showChildren  ? children : null}
        </div>
      </div>
    )
  }
}

/**
 * Implements the drag source contract.
 */
const sectionSource = {
  beginDrag(props) {
    const { closingBookSections, section } = props
    props.setIsDragging(section.id, true)

    // add children
    const getChildren = function(treeElement, sectionId) {
      const inClosingBook = (
        _.some(closingBookSections, closingBookSection => (
          _.some(closingBookSection.closing_book_documents, { document_id: treeElement.id })
        ))
      )
      const canChoose = treeElement.type === 'Document' && _.get(treeElement, 'attachment.latest_version.conversion_successful', false) && _.includes(SupportedFileTypes, treeElement.attachment.latest_version.file_type)
      const canDrag = canChoose && !inClosingBook
      let children = _.flatten(treeElement.children.map(child => getChildren(child, sectionId)))
      if (canDrag) {
        children.unshift({
          document_id: treeElement.id,
          name: treeElement.name,
          tab_number: null,
          section_id: sectionId,
          url: _.get(treeElement, 'attachment.latest_version.url', '')
        })
      }
      return children
    }
    return {
      closingBookSection: {
        section_id: section.id,
        name: section.name,
        position: null,
        closing_book_documents: _.flatten(_.map(section.children, treeElement => getChildren(treeElement, section.id)))
      },
      sectionIndex: null
    }
  },
  canDrag(props) {
    const { closingBookSections, section } = props
    const inClosingBook = _.some(closingBookSections, { section_id: section.id })
    return !inClosingBook
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
    paddingLeft: '.8rem'
  },
  infoBox: {
    color: Colors.whiteout.blue,
    flexShrink: '0',
    paddingLeft: '1.6rem',
    paddingRight: '0.4rem',
    minHeight: '2.8rem',
    display: 'flex',
    alignItems: 'center'
  },
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: canDrag => ({
    color: Colors.whiteout.text.default,
    fontStyle: canDrag ? 'normal' : 'italic',
    opacity: canDrag ? '1' : '0.25'
  }),
  sectionContainer: {
    width: '100%'
  },
  sectionHeader: canDrag => ({
    cursor: canDrag ? 'move' : 'default',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: ' 1.2rem .8rem 1.2rem 0',
    alignItems: 'center',
    borderBottom: `dotted .1rem ${Colors.whiteout.status.gray}`
  }),
  toggle: {
    paddingLeft: '1.2rem'
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

Section.propTypes = {
  closingBookSections: PropTypes.array.isRequired,
  indentation: PropTypes.number.isRequired,
  section: PropTypes.object.isRequired,

  setIsDragging: PropTypes.func.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
}

export default DragSource(DragDropItemTypes.CLOSING_BOOK_SECTION, sectionSource, collect)(Section)
