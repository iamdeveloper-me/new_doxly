import PropTypes from 'prop-types'
import React from 'react'

import ClosingChecklistNumber from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import Colors from 'helpers/Colors'
import TreeElement from './TreeElement/index.jsx'

export default class Section extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showChildren: true
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      showChildren: !this.state.showChildren
    })
  }

  render(){
    const { indentation, section, signaturePacketReviewDocuments } = this.props
    const { createSignaturePacketReviewDocumentFromChecklist } = this.props
    const { showChildren } = this.state
    const chevronDirection = showChildren ? 'down' : 'right'
    const children = (
      section.children.map((child) => {
        return (
          <TreeElement
            key={child.id}
            treeElement={child}
            indentation={indentation + 1}
            createSignaturePacketReviewDocumentFromChecklist={createSignaturePacketReviewDocumentFromChecklist}
            signaturePacketReviewDocuments={signaturePacketReviewDocuments}
          />
        )
      })
    )

    return (
      <div style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <div style={styles.toggle} onClick={this.toggle}>
            <i className={`mdi mdi-chevron-${chevronDirection} mdi-24px`}></i>
          </div>
          <div style={styles.centerBox}>
            <div style={styles.checklistNumber}>
              <ClosingChecklistNumber indentation={indentation} position={section.position} />
            </div>
            <div style={styles.name}>
              {section.name}
            </div>
          </div>
          <div style={styles.rightBox}></div>
        </div>
        <div style={styles.childrenContainer}>
          {showChildren  ? children : null}
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
    paddingLeft: '.8rem'
  },
  rightBox: {
    width: '5.6rem',
    flexShrink: '0',
    paddingLeft: '1.6rem'
  },
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    color: Colors.whiteout.text.default
  },
  sectionContainer: {
    width: '100%'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: ' 1.2rem .8rem 1.2rem 1.2rem',
    alignItems: 'center',
    borderBottom: `dotted .1rem ${Colors.whiteout.status.gray}`
  }
}

Section.propTypes = {
  indentation: PropTypes.number.isRequired,
  section: PropTypes.object.isRequired,
  signaturePacketReviewDocuments: PropTypes.array.isRequired,

  createSignaturePacketReviewDocumentFromChecklist: PropTypes.func.isRequired
}
