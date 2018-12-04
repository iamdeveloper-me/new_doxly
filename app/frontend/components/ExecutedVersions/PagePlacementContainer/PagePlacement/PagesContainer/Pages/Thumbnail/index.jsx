import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
 } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'

import Assets from 'helpers/Assets'
import {
  Tooltip,
  TooltipBody,
  TooltipButtons,
  TooltipHeader,
  TooltipText
} from 'components/Whiteout/Tooltip/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'

const DragHandle = SortableHandle(() => <i className="mdi mdi-arrow-all" style={styles.moveIcon}></i>)

class Thumbnail extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      popoverShown: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.openPagePreview = this.openPagePreview.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.removeSignerTooltip = this.removeSignerTooltip.bind(this)
    this.hidePopover = this.hidePopover.bind(this)
    this.showPopover = this.showPopover.bind(this)
    this.getBanner = this.getBanner.bind(this)
    this.onRemoveFromAll = this.onRemoveFromAll.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({
      hover: true
    })
  }

  onMouseLeaveHandler() {
    this.setState({
      hover: false
    })
  }

  onRemove() {
    this.props.updateSelectedPages(this.props.page, false)
    this.hidePopover()
  }

  onRemoveFromAll() {
    this.props.updateSelectedPages(this.props.page, true)
    this.hidePopover()
  }

  openPagePreview() {
    this.props.toggleShowPreview(this.props.page)
  }

  hidePopover() {
    this.setState({ popoverShown: false })
  }

  showPopover() {
    this.setState({ popoverShown: true })
  }

  getButton(button, position) {
    const { intl } = this.props

    return (
      <Tooltip
        position={position}
        hideTooltip={this.hideTooltip}
        showTooltip={this.state.showTooltip}
        content={
          <TooltipBody>
            <TooltipHeader>
              {intl.formatMessage({id: 'executed_versions.discard_changes'})}
            </TooltipHeader>
            <TooltipText>
              {intl.formatMessage({id: 'executed_versions.discard_changes_description'})}
            </TooltipText>
            <TooltipButtons>
              <Button size='small' type='secondary' text={intl.formatMessage({id: 'buttons.cancel'})} onClick={this.hideTooltip} />
              <Button size='small' type='removal' text={intl.formatMessage({id: 'buttons.quit'})} onClick={this.quit} />
            </TooltipButtons>
          </TooltipBody>
        }
        trigger={<div onClick={this.showTooltip}>{button}</div>}
      />
    )
  }


  removeSignerTooltip(){
    const { intl, page } = this.props
    const { hover, popoverShown } = this.state
    const removed = page.position === null
    const displayRemoved = !hover && removed

    return (
      <Tooltip
        position='bottom'
        hideTooltip={this.hidePopover}
        showTooltip={popoverShown}
        content={
          <TooltipBody style={styles.tooltip}>
            <TooltipHeader>
              {intl.formatMessage({id: 'executed_versions.remove_from_all_documents'})}
            </TooltipHeader>
            <TooltipText>
              {intl.formatMessage({id: 'executed_versions.remove_signer_from_all'})}
            </TooltipText>
            <TooltipButtons style={styles.buttons}>
              <div style={styles.button}>
                <Button size='small' type='secondary' text={intl.formatMessage({id: 'executed_versions.remove_from_all'})} onClick={this.onRemoveFromAll} />
              </div>
              <Button size='small' type='primary' text={intl.formatMessage({id: 'executed_versions.this_document_only'})} onClick={this.onRemove} />
            </TooltipButtons>
          </TooltipBody>
        }
        trigger={
          <i
            className={removed ? "mdi mdi-plus-circle" : "mdi mdi-minus-circle"}
            style={styles.icon((hover || popoverShown), displayRemoved)}
            onClick={this.showPopover}
          />
        }
      />
    )
  }

  getBanner() {
    const { page } = this.props
    let banner

    if (page.position === null) {
      banner = <div style={styles.banner(Colors.banner.darkBlue)}>
                 <FormattedMessage id='executed_versions.removed' />
               </div>
    } else if (page.signature_page_id) {
      if (page.currently_executed) {
        banner = <div style={styles.banner(Colors.banner.green)}>
                   <FormattedMessage id='executed_versions.executed' />
                 </div>
      } else {
        banner = <div style={styles.banner(Colors.banner.yellow)}>
                   <FormattedMessage id='executed_versions.new_signer' />
                 </div>
      }
    }
    return banner
  }

  render() {
    const { hover, popoverShown } = this.state
    const { page, selectedDocument, selectedDocuments, thumbnailSprite } = this.props
    const removed = page.position === null
    const isSignaturePage = page.signature_page_id
    const allPages = _.flatMap(selectedDocuments, 'pages')
    const signerPages = _.filter(allPages, { signing_capacity_id: page.signing_capacity_id })
    const signaturePageDelete = isSignaturePage && !removed
    const hasBanner = removed || isSignaturePage
    const displayRemoved = !hover && removed
    const activeIcons = hover || popoverShown
    const url = isSignaturePage ? page.thumbnail_sprite_path : thumbnailSprite
    // if the url is null, the request is still made of the backend, but the route can't be found, and so it redirects to the deals page (asynchronously). Very expensive so preventing that below.
    const thumbnailAttributes = url ?
      {
        backgroundImage: `url(${url})`,
        backgroundPosition: `${isSignaturePage ? 0 : (page.original_position-1)*85*-1}px 0px`,
        backgroundRepeat: 'no-repeat'
      }
    :
      {}


    return (
      <div
        style={styles.container}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <div style={styles.thumbnail(displayRemoved)}>
          <div style={_.assign({}, styles.image, thumbnailAttributes)}>
          </div>
          <div style={styles.overlay(activeIcons, removed)}>
            <div style={styles.topIcons}>
              <i
                className="mdi mdi-eye"
                style={styles.icon(activeIcons, displayRemoved)}
                onClick={this.openPagePreview}
              />
              {signaturePageDelete && signerPages.length > 1 ?
                this.removeSignerTooltip()
              :
                <i
                  className={removed ? "mdi mdi-plus-circle" : "mdi mdi-minus-circle"}
                  style={styles.icon(hover, displayRemoved)}
                  onClick={this.onRemove}
                />
              }
            </div>
            <DragHandle />
          </div>
        </div>
        {(hasBanner && !hover && !popoverShown) ? this.getBanner() : null}
        <div style={styles.position}>
          {page.name}
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'relative',
    paddingRight: '20px',
    paddingBottom: '20px',
    cursor: 'pointer',
    zIndex: 100000
  },
  thumbnail: removed => ({
    width: '85px',
    height: '110px',
    outline: `1px solid ${Colors.gray.light}`,
    position: 'relative',
    opacity: removed ? '0.3' : '1'
  }),
  image: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    background: Colors.white
  },
  overlay: (hover, removed) => ({
    width: '100%',
    height: '100%',
    zIndex: hover ? '100' : '-100',
    position: 'absolute',
    opacity: removed ? '0.5' : '0.7',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: Colors.black
  }),
  topIcons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px'
  },
  icon: (hover, removed) => ({
    fontSize: '20px',
    color: hover ? Colors.white : Colors.gray.darkest,
    position: removed ? 'absolute' : 'relative',
    right: removed ? '0' : 'none',
    margin: removed ? '4px' : '0'
  }),
  moveIcon: {
    paddingBottom: '24px',
    fontSize: '20px',
    textAlign: 'center',
    cursor: 'move',
    color: Colors.white
  },
  position: {
    textAlign: 'center',
    paddingTop: '4px',
    width: '85px'
  },
  banner: color => ({
    position: 'absolute',
    top: '0',
    width: '89px',
    textAlign: 'center',
    marginTop: '4px',
    marginLeft: '-2px',
    padding: '2px',
    background: color,
    color: Colors.white
  }),
  tooltip: {
    width: '23rem'
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '.8rem'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column'
  }
}

Thumbnail.defaultProps = {
  thumbnailSprite: Assets.getPath("ic-page-placement-empty.png")
}

Thumbnail.propTypes = {
  intl: intlShape.isRequired,
  page: PropTypes.object.isRequired,
  selectedDocuments: PropTypes.array.isRequired,
  thumbnailSprite: PropTypes.string,

  toggleShowPreview: PropTypes.func.isRequired,
  updateSelectedPages: PropTypes.func.isRequired
}

export default injectIntl(SortableElement(Thumbnail))
