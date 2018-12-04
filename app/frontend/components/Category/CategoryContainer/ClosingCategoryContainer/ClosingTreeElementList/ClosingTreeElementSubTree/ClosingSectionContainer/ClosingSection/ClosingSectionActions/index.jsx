import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

export default class ClosingSectionActions extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      deleteTooltipShown: false
    }
    this.showDeleteTooltip = this.showDeleteTooltip.bind(this)
    this.hideDeleteTooltip = this.hideDeleteTooltip.bind(this)
    this.deleteTreeElement = this.deleteTreeElement.bind(this)
    this.getChildIds = this.getChildIds.bind(this)
  }

  showDeleteTooltip() {
    this.setState({ deleteTooltipShown: true })
  }

  hideDeleteTooltip() {
    this.setState({ deleteTooltipShown: false })
  }

  deleteTreeElement() {
    this.setState({ deleteTooltipShown: false })
    this.props.deleteTreeElement(this.props.treeElement)
  }

  getChildIds(treeElement) {
    // returns an array of all the tree element ids of all the tree elements under this tree element
    return [treeElement.id, ..._.flatten(treeElement.children.map(child => this.getChildIds(child)))]
  }
  
  render() {
    const { ongoingUploads, treeElement } = this.props
    const childIds = this.getChildIds(treeElement)
    const hasOngoingUploads = _.filter(ongoingUploads, ongoingUpload => _.includes(childIds, ongoingUpload.parentTreeElementId) && !ongoingUpload.error && !ongoingUpload.canceled).length > 0

    return (
      <div className="whiteout-ui" style={styles.container}>
        <Tooltipster
          open={this.state.deleteTooltipShown}
          triggerElement={
            <div style={styles.iconButton} onClick={this.showDeleteTooltip}>
              <i style={styles.delete} className='mdi mdi-delete'></i>
            </div>
          }
          content={
            <TooltipsterBody>
              <TooltipsterHeader>
                <p><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.end_uploads_and_delete' : 'category.sidebar.header.delete_tree_element_header'} /></p>
              </TooltipsterHeader>
              <TooltipsterText>
                <p className="gray"><FormattedMessage id={hasOngoingUploads ? 'category.sidebar.header.uploads_pending' : 'category.sidebar.header.delete_tree_element_content'} /></p>
              </TooltipsterText>
              <TooltipsterButtons>
                <Button size='small' type='secondary' text='Cancel' onClick={this.hideDeleteTooltip} />
                <Button size='small' type='removal' text='Delete' icon='delete' onClick={this.deleteTreeElement} />
              </TooltipsterButtons>
            </TooltipsterBody>
          }
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          onClickOutside={this.hideDeleteTooltip}
        />
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '3.4rem'
  },
  iconButton: {
    fontSize: '1.8rem',
    color: Colors.whiteout.blue,
    height: '3.0rem',
    width: '3.0rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.4rem'
  },
  delete: {
    color: Colors.whiteout.carmine
  }
}

ClosingSectionActions.propTypes = {
  ongoingUploads: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  deleteTreeElement: PropTypes.func.isRequired
}