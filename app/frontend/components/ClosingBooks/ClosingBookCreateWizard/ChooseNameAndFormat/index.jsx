import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'
import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import Input from 'components/Whiteout/Input/index.jsx'
import NextButton from 'components/Whiteout/Buttons/NextButton/index.jsx'
import Radio from 'components/Whiteout/Radio/index.jsx'
import Textarea from 'components/Whiteout/Textarea/index.jsx'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'

const formats = {
  html_index: 'html_index',
  pdf_index: 'pdf_index',
  pdf_compilation: 'pdf_compilation'
}

class ChooseNameAndFormat extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      formSubmitted: false,
      showCloseTooltip: false
    }

    this.toggleCloseTooltip = this.toggleCloseTooltip.bind(this)

    // validations
    this.isNameValid = this.isNameValid.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  toggleCloseTooltip(showCloseTooltip = !this.state.showCloseTooltip) {
    this.setState({ showCloseTooltip })
  }

  // validations
  isNameValid() {
    return _.trim(this.props.name) !== ''
  }

  submitForm() {
    this.setState({ formSubmitted: true })

    const validations = [
      this.isNameValid()
    ]

    if (_.every(validations)) {
      this.props.next()
    }
  }

  render() {
    const { description, format, intl, name } = this.props
    const { setAttribute, toggleCreateWizard } = this.props
    return (
      <WhiteoutModal
        header={<FormattedMessage id='closing_books.create_wizard.create_closing_book' />}
        title={<FormattedMessage id='closing_books.create_wizard.choose_name_and_format.choose_name_and_format' />}
        quit={toggleCreateWizard}
        body={
          <div style={styles.container}>
            <p style={styles.details}>
              <FormattedMessage id='closing_books.create_wizard.choose_name_and_format.give_this_closing_book_a_name' />
            </p>
            <div style={styles.scrollContainer}>
              {this.state.formSubmitted && !this.isNameValid() ?
                <div style={styles.alert}>
                  <Alert
                    status='error'
                    messageTitle={<FormattedMessage id='closing_books.create_wizard.choose_name_and_format.valid_name_required' />}
                  />
                </div>
              :
                null
              }
              <div style={styles.inputs}>
                <Input
                  type='text'
                  size='large'
                  labelText={<FormattedMessage id='closing_books.create_wizard.choose_name_and_format.name' />}
                  placeholder={intl.formatMessage({ id: 'closing_books.create_wizard.choose_name_and_format.name_placeholder' })}
                  value={name}
                  onChange={(e) => setAttribute('name', e.target.value)}
                  invalid={this.state.formSubmitted && !this.isNameValid()}
                />
                <Textarea
                  size='large'
                  style={styles.textarea}
                  labelText={<FormattedMessage id='closing_books.create_wizard.choose_name_and_format.description' />}
                  placeholder={intl.formatMessage({ id: 'closing_books.create_wizard.choose_name_and_format.description_placeholder' })}
                  value={description}
                  onChange={(e) => setAttribute('description', e.target.value)}
                />
              </div>

              <h4><FormattedMessage id='closing_books.create_wizard.choose_name_and_format.format' /></h4>
              <br />
              <Radio
                text={<FormattedMessage id='closing_books.format.html_index' />}
                checked={format === formats.html_index}
                onChange={() => setAttribute('format', formats.html_index)}
              />
              <Radio
                text={<FormattedMessage id='closing_books.format.pdf_index' />}
                checked={format === formats.pdf_index}
                onChange={() => setAttribute('format', formats.pdf_index)}
              />
              <Radio
                text={<FormattedMessage id='closing_books.format.pdf_compilation' />}
                checked={format === formats.pdf_compilation}
                onChange={() => setAttribute('format', formats.pdf_compilation)}
              />
            </div>
          </div>
        }
        topRightButton={
          <CloseButton />
        }
        bottomRightButton={
          <NextButton
            disabled={this.state.formSubmitted && !this.isNameValid()}
            onClick={this.submitForm}
          />
        }
      />
    )
  }
}

const styles = {
  container: {
    textAlign: 'left',
    width: '100%',
    maxWidth: '69rem',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  scrollContainer: {
    overflow: 'auto',
    flexGrow: '1'
  },
  details: {
    marginBottom: '2.4rem'
  },
  alert: {
    marginTop: '2.4rem',
    marginBottom: '3.2rem'
  },
  inputs: {
    marginTop: '2.4rem',
    marginBottom: '3.2rem'
  },
  textarea: {
    height: '2.4rem'
  }
}

ChooseNameAndFormat.propTypes = {
  description: PropTypes.string.isRequired,
  format: PropTypes.oneOf(_.values(formats)).isRequired,
  intl: intlShape.isRequired,
  name: PropTypes.string.isRequired,

  setAttribute: PropTypes.func.isRequired,
  toggleCreateWizard: PropTypes.func.isRequired
}

export default injectIntl(ChooseNameAndFormat)
