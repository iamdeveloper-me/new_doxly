import { FormattedMessage } from 'react-intl'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import TypeOption from './TypeOption/index.jsx'

class TypeOptions extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside() {
    this.props.setIsOpen(false)
  }

  render() {
    const { options, treeElement } = this.props
    const { setIsOpen, setItemType, updateTreeElement } = this.props
    const typeOptions = (
      options.map((option, index) => (
        <TypeOption
          key={index}
          option={option}
          setIsOpen={setIsOpen}
          setItemType={setItemType}
          treeElement={treeElement}
          updateTreeElement={updateTreeElement}
        />
      ))
    )

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <FormattedMessage id='category.sidebar.header.item_type' />
        </div>
        {typeOptions}
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'absolute',
    zIndex: '1',
    marginTop: '2px',
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.button.blue}`,
    borderRadius: '4px',
    width: '0',
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    color: Colors.gray.light,
    marginBottom: '2px',
    padding: '4px 8px',
    borderBottom: `1px solid ${Colors.gray.light}`,
    boxShadow: `0px 1px 10px 0px ${Colors.gray.lighter}`,
    position: 'relative'
  }
}

TypeOptions.propTypes = {
  // attributes
  options: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  setIsOpen: PropTypes.func.isRequired,
  setItemType: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired
}

export default onClickOutside(TypeOptions)
