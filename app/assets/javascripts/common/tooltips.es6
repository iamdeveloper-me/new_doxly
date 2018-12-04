$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  bindUserTooltip('.has-user-tooltip')
  bindStatusTooltip('.has-status-tooltip')
  bindActionTooltip('.has-action-tooltip')
  bindEllipsizeWithTooltip()
})

function bindUserTooltip(element) {
  $(element)
    .off("mouseover mouseout")
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly',
      animationDuration: 200,
      delay: [600, 300],
      debug: false
    })
}

function bindStatusTooltip(element) {
  $(element)
    .off("mouseover mouseout")
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly-light',
      animationDuration: 200,
      delay: [600, 300],
      debug: false,
      distance: -5,
      zIndex: 1002,
      maxWidth: 300
    })
}

function bindActionTooltip(element) {
  $(element)
    .off("mouseover mouseout")
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly-light',
      animationDuration: 200,
      delay: [600, 300],
      debug: false,
      trigger: 'click',
      distance: -15,
      zIndex: 99
    })
}

function bindClosingBookTooltip(element) {
  $(element)
    .off("mouseover mouseout")
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly-light',
      animationDuration: 200,
      delay: [600, 300],
      debug: false,
      distance: -5,
      zIndex: 99,
      maxWidth: 280
    })
}

function bindExcludedTooltip(element) {
  $(element)
    .off("mouseover mouseout")
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly-light',
      animationDuration: 200,
      debug: false,
      delay: 0,
      distance: 2,
      zIndex: 99,
      maxWidth: 250,
      side: ['bottom', 'top', 'right', 'left']
    })
}

function bindEllipsizeWithTooltip() {
  $('.ellipsize.with-tooltip')
    .off("mouseover mouseout")
    .each(function(index, object) {
      // create tooltip id
      let tooltipId = `tooltip_content_expanded_text_${Math.floor(Math.random(9999)*9999)}`
      object = $(object)

      // add data attribute and tooltip if it does not already exist
      if (!object.data("data-tooltip-content")) {
        object.attr("data-tooltip-content", `#${tooltipId}`)
        $(`
          <div class="tooltip_templates">
            <div class="tooltip-content expanded-text-tooltip whiteout-ui" id="${tooltipId}">
              <span>${object.html()}</span>
            </div>
          </div>
        `).insertAfter(object)
      }
    })
    .tooltipster({
      interactive: true,
      theme: 'tooltipster-doxly-light',
      animationDuration: 200,
      debug: false,
      delay: [600, 300],
      distance: 2,
      zIndex: 99,
      maxWidth: 500,
      side: ['bottom', 'top', 'right', 'left'],
      functionBefore: function(instance, helper) {
        // only show if the text is ellipsized (larger than its container)
        return helper.origin.offsetWidth < helper.origin.scrollWidth
      }
    })
}
