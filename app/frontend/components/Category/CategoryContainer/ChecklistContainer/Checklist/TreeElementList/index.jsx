import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

import Empty from 'components/Empty/index.jsx'

export default class TreeElementList extends React.PureComponent {

  render() {
    const { filter, header, searchQuery, subtree, tree } = this.props
    let text
    const filterPresent = !((filter.parties && filter.parties[0] === 'show_all_parties' && filter.documents && filter.documents[0] === 'show_all_documents') || filter.filters && filter.filters[0] === 'show_all_documents')
    if (filterPresent && searchQuery) {
      text = <FormattedMessage id='category.checklist.no_filter_and_search_results' />
    } else if (searchQuery) {
      text = <FormattedMessage id='category.checklist.no_search_results' />
    } else if (filterPresent) {
      text = <FormattedMessage id='category.checklist.no_filter_results' />
    } else {
      text = <FormattedMessage id='category.checklist.empty' />
    }

    return (
      <div style={styles.treeElementList} className="react-tree-element-list">
        {header}
        { tree.length > 0 ? 
          subtree
        :
          <Empty
            icon={<i className='fa fa-list-ol fa-4x' aria-hidden='true'></i>}
            text={text}
          />
        }
        <div style={styles.borderBottomContainer}>
          <div style={styles.borderBottom}></div>
        </div>
      </div>
    )
  }

}

const styles = {
  treeElementList: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  borderBottomContainer: {
    width: '100%'
  },
  borderBottom: {
    borderBottom: `2px solid ${Colors.gray.normal}`,
    marginLeft: '10px'
  }
}

TreeElementList.propTypes = {
  filter: PropTypes.object.isRequired,
  header: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  subtree: PropTypes.object.isRequired,
  tree: PropTypes.array.isRequired
}
