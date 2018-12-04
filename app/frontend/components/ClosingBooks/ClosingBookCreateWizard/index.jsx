import _ from 'lodash'
import Enum from 'enum'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import BuildTableOfContents from './BuildTableOfContents/index.jsx'
import ChooseNameAndFormat from './ChooseNameAndFormat/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import SupportedFileTypes from './SupportedFileTypes'
import UploadCoverPage from './UploadCoverPage/index.jsx'

const TABS = new Enum(['CHOOSE_NAME_AND_FORMAT', 'UPLOAD_COVER_PAGE', 'BUILD_TABLE_OF_CONTENTS'])

export default class ClosingBookCreateWizard extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      closingBook: {
        name: '',
        description: '',
        format: 'html_index',
        closing_book_sections: [],
        cover_page_file: null,
        font_size: 12,
        font: 'Times New Roman'
      },
      loading: true,
      selectedTab: TABS.CHOOSE_NAME_AND_FORMAT,
      tree: []
    }
    this.previousTab = this.previousTab.bind(this)
    this.nextTab = this.nextTab.bind(this)
    this.createClosingBook = this.createClosingBook.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
  }

  componentDidMount() {
    const params = Params.fetch()
    Api.get(Routes.dealClosingChecklist(params.deals, ['attachment.latest_version']))
      .then((response) => {
        const tree = _.first(response).children
        this.setState({
          loading: false,
          tree: tree,
          closingBook: _.assign({}, this.state.closingBook, { closing_book_sections: this.generateClosingBookSections(tree) })
        })
      })
  }

  generateClosingBookSections(tree) {
    let section_position = 1
    let tab_number = 1
    const getChildren = function(treeElement, sectionId) {
      const canChoose = treeElement.type === 'Document' && _.get(treeElement, 'attachment.latest_version.conversion_successful', false) && _.includes(SupportedFileTypes, treeElement.attachment.latest_version.file_type)
      let closingBookDocument = null
      if (canChoose) {
        closingBookDocument = ({
          document_id: treeElement.id,
          name: treeElement.name,
          tab_number: tab_number++,
          section_id: sectionId,
          url: _.get(treeElement, 'attachment.latest_version.url', '')
        })
      }
      let children = _.flatten(treeElement.children.map(child => getChildren(child, sectionId)))
      if (closingBookDocument) {
        children.unshift(closingBookDocument)
      }
      return children
    }

    return _.map(tree, section => ({
      section_id: section.id,
      name: section.name,
      position: section_position++,
      closing_book_documents: _.flatten(_.map(section.children, treeElement => getChildren(treeElement, section.id)))
    }))
  }

  previousTab() {
    this.setState({
      selectedTab: TABS.enums[_.findIndex(TABS.enums, this.state.selectedTab)-1]
    })
  }

  nextTab() {
    this.setState({
      selectedTab: TABS.enums[_.findIndex(TABS.enums, this.state.selectedTab)+1]
    })
  }

  createClosingBook() {
    this.setState({ loading: true })
    this.props.createClosingBook(this.state.closingBook)
  }

  setAttribute(key, value) {
    let closingBook = _.cloneDeep(this.state.closingBook)
    closingBook[key] = value
    this.setState({ closingBook })
  }

  render() {
    const { toggleCreateWizard } = this.props
    const { cover_page_file, description, format, name } = this.state.closingBook

    switch(this.state.selectedTab) {
      case TABS.CHOOSE_NAME_AND_FORMAT:
        return (
          <ChooseNameAndFormat
            name={name}
            description={description}
            format={format}
            setAttribute={this.setAttribute}
            toggleCreateWizard={toggleCreateWizard}
            next={this.nextTab}
          />
        )
      case TABS.UPLOAD_COVER_PAGE:
        return (
          <UploadCoverPage
            back={this.previousTab}
            next={this.nextTab}
            coverPageFile={cover_page_file}
            setAttribute={this.setAttribute}
            toggleCreateWizard={toggleCreateWizard}
          />
        )
      case TABS.BUILD_TABLE_OF_CONTENTS:
        return (
          <BuildTableOfContents
            loading={this.state.loading}
            closingBook={this.state.closingBook}
            back={this.previousTab}
            tree={this.state.tree}
            createClosingBook={this.createClosingBook}
            setAttribute={this.setAttribute}
            toggleCreateWizard={toggleCreateWizard}
          />
        )
    }
  }
}

ClosingBookCreateWizard.propTypes = {
  createClosingBook: PropTypes.func.isRequired,
  toggleCreateWizard: PropTypes.func.isRequired
}
