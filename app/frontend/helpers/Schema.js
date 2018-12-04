import PropTypes from 'prop-types'
import { SIGNATURE_TYPES } from 'helpers/Enums'
const Schema = {
  closingBook: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string,
    creator_id: PropTypes.number,
    status: PropTypes.oneOf(['in_progress','complete','failed']),
  }),
  completionStatus: PropTypes.shape({
    id: PropTypes.number,
    is_complete: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    tree_element_id: PropTypes.number,
    deal_entity_id: PropTypes.number
  }),
  treeElement: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    signature_type: PropTypes.oneOf(_.map(SIGNATURE_TYPES.enumValues, signature_type => signature_type.name)),
    is_post_closing: PropTypes.bool,
    position: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    children: PropTypes.array,
    folder_completion_numbers: PropTypes.shape({
      completed_documents_count: PropTypes.number,
      descendant_documents_count: PropTypes.number,
      documents_with_attachment_count: PropTypes.number
    }),
    sign_manually: PropTypes.bool,
    ancestry: PropTypes.string
  })
}

export default Schema
