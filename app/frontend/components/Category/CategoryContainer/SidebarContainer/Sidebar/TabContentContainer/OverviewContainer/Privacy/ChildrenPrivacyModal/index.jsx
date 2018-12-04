import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Modal
} from 'react-bootstrap'

import Colors from 'helpers/Colors'

class ChildrenPrivacyModal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      yesSelected: this.props.categoryType == 'DiligenceCategory' ? true : false,
      noSelected: this.props.categoryType == 'DiligenceCategory' ? false : true
    }
    this.onChange = this.onChange.bind(this)
    this.getDescendants = this.getDescendants.bind(this)
  }

  onChange() {
    this.setState({
      yesSelected: !this.state.yesSelected,
      noSelected: !this.state.noSelected
    })
  }

  onSave() {
    if (this.state.yesSelected) {
      this.props.propagateRestrictionsToChildren(this.props.treeElement)
    }
    this.props.hideChildrenPrivacyModal()
  }

  getDescendants(treeElement, children) {
    let descendants = children

    treeElement.children.map((child) => {
      descendants.push(child)
      if (child.children.length > 0) {
        this.getDescendants(child, descendants)
      }
    })
    return descendants
  }

  render() {
    const { showChildrenPrivacyModal, treeElement } = this.props
    const { hideChildrenPrivacyModal, showPreviousModal } = this.props
    const descendants = this.getDescendants(treeElement, [])
    const descendantsCount = descendants.length

    return (
      <div style={styles.modalContainer}>
        <Modal show={showChildrenPrivacyModal} onHide={hideChildrenPrivacyModal} backdrop={'static'} keyboard={false}>
          <Modal.Header >
            <Modal.Title><FormattedMessage id='category.sidebar.privacy.privacy_modal.customize_privacy' values={{name: treeElement.name}} /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={styles.modalBody}>
              <div style={styles.listMessage}>
                <FormattedMessage id='category.sidebar.privacy.privacy_modal.listed_items' values={{number: descendantsCount}} />
              </div>
              <div style={styles.restrictions}>
                <div>
                  <div style={styles.header}>
                    <FormattedMessage id='category.sidebar.privacy.privacy_modal.list_items' />
                  </div>
                  {
                    descendants.map((child, index) =>(
                      <div key={index} style={styles.children}>{child.name}</div>
                    ))
                  }
                </div>
              </div>
              <div style={styles.question}>
                <FormattedMessage id='category.sidebar.privacy.privacy_modal.children_privacy_question' />
              </div>
              <div style={styles.radioButtons}>
                <div className="radio" style={styles.radioButton}>
                  <label style={styles.answerText}>
                    <input
                      type="radio"
                      name="value"
                      onChange={this.onChange}
                      value="1"
                      checked={this.state.noSelected}
                    />
                    <span style={styles.answer}><FormattedMessage id='category.sidebar.privacy.privacy_modal.no' /> </span>
                    <FormattedMessage id='category.sidebar.privacy.privacy_modal.retain_restrictions' />
                  </label>
                </div>
                <div className="radio" style={styles.radioButton}>
                  <label style={styles.answerText}>
                    <input
                      type="radio"
                      name="value"
                      onChange={this.onChange}
                      value="0"
                      checked={this.state.yesSelected}
                    />
                    <span style={styles.answer}><FormattedMessage id='category.sidebar.privacy.privacy_modal.yes' /> </span>
                    <FormattedMessage id='category.sidebar.privacy.privacy_modal.set_child_restrictions' values={{name: treeElement.name}}/>
                  </label>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div style={styles.footer}>
              <div>
                <Button onClick={showPreviousModal}>
                  <FormattedMessage id='buttons.previous' />
                </Button>
                <Button bsStyle='primary' onClick={() => this.onSave()}>
                  <FormattedMessage id='buttons.save' />
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

}

const styles = {
  modalContainer: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  bodyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '4px'
  },
  modalBody: {
    overflow: 'auto',
    width: '100%',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column'
  },
  listMessage: {
    paddingBottom: '12px',
    color: Colors.gray.darkest
  },
  restrictions: {
    overflow: 'auto',
    width: '100%',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${Colors.gray.light}`,
    background: Colors.gray.lightest
  },
  header: {
    backgroundColor: Colors.background.blue,
    width: '100%',
    padding: '6px',
    borderBottom: `1px solid ${Colors.gray.light}`
  },
  children: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: '8px 0',
    paddingLeft: '16px',
    borderBottom: `1px solid ${Colors.gray.light}`,
    color: Colors.gray.darkest
  },
  question: {
    color: Colors.gray.darkest,
    fontWeight: 'bold',
    paddingTop: '20px'
  },
  radioButtons: {
    paddingBottom: '20px'
  },
  radioButton: {
    padding: '12px 0 0 12px'
  },
  answerText: {
    color: Colors.gray.darkest
  },
  answer: {
    color: Colors.gray.darkest,
    fontWeight: 'bold'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 16px 16px 16px'
  }
}

ChildrenPrivacyModal.propTypes = {
  categoryType: PropTypes.string.isRequired,
  showChildrenPrivacyModal: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  hideChildrenPrivacyModal: PropTypes.func.isRequired,
  propagateRestrictionsToChildren: PropTypes.func.isRequired,
  showPreviousModal: PropTypes.func.isRequired
}

export default ChildrenPrivacyModal
