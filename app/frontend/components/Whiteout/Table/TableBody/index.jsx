import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

class TableBody extends React.PureComponent {

  componentDidMount() {
    this.removeEventListner()
    this.addPaddingForScroll()
    window.addEventListener('resize', this.addPaddingForScroll)
  }

  componentWillUnmount() {
    this.removeEventListner()
  }

  removeEventListner() {
    window.removeEventListener('resize', this.addPaddingForScroll)
  }

  componentDidUpdate() {
    if(this.props.shouldScrollBottom) {
      this.scrollToBottom()
    }
  }

  scrollToBottom() {
    const tableBody = this.tableBody
    const maxScrollTop = tableBody.scrollHeight - tableBody.clientHeight
    tableBody.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  addPaddingForScroll() {
    const divHeight = $('.whiteout-table-container').height()
    const scrollHeight = $('.whiteout-table-container').prop('scrollHeight')

    if (scrollHeight > divHeight) {
      $('.whiteout-table-header-row').css({'padding-right': '16px'})
    } else {
      $('.whiteout-table-header-row').css({'padding-right': '0'})
    }
  }

  render() {
    const { children, style } = this.props

    return (
      <div
        style={_.assign({}, styles.body, style)}
        className='whiteout-table-container'
        ref={tableBody => { this.tableBody = tableBody }}
      >
        {children}
      </div>
    )
  }
}

const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  }
}

TableBody.defaultProps = {
  shouldScrollBottom: false,
  style: {}
}

TableBody.propTypes = {
  shouldScrollBottom: PropTypes.bool,
  style: PropTypes.object
}

export default TableBody
