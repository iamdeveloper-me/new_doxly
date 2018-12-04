import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import Section from './Section/index.jsx'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

export default class ChooseFromChecklistButton extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open() {
    this.setState({ open: true })
  }

  close() {
    this.setState({ open: false })
  }

  render() {
    const { closingBookSections, tree } = this.props
    const { setIsDragging } = this.props

    return (
      <Tooltipster
        open={this.state.open}
        triggerElement={
          <Button
            type='primary'
            text={<FormattedMessage id='closing_books.create_wizard.build_table_of_contents.choose_from_checklist' />}
            icon='plus'
            onClick={this.open}
          />
        }
        content={
          <TooltipsterBody style={styles.body}>
            <TooltipsterHeader>
              <p><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.choose_from_checklist_instructions' /></p>
            </TooltipsterHeader>
            <div style={styles.tree}>
              {
                tree.map((section, index) => (
                  <Section
                    key={section.id}
                    section={section}
                    indentation={0}
                    closingBookSections={closingBookSections}
                    setIsDragging={setIsDragging}
                  />
                ))
              }
            </div>
            <TooltipsterButtons>
              <Button size='small' type='secondary' text={<FormattedMessage id='buttons.close' />} onClick={this.close} />
            </TooltipsterButtons>
          </TooltipsterBody>
        }
        interactive={true}
        repositionsOnScroll={true}
        side='bottom'
        theme='tooltipster-doxly-whiteout'
        onClickOutside={this.close}
      />
    )
  }

}

const styles = {
  body: {
    width: '48rem'
  },
  tree: {
    border: `0.1rem solid ${Colors.whiteout.gray}`,
    marginTop: '1.6rem',
    height: '32rem',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}

ChooseFromChecklistButton.propTypes = {
  closingBookSections: PropTypes.array.isRequired,
  tree: PropTypes.array.isRequired,

  setIsDragging: PropTypes.func.isRequired
}