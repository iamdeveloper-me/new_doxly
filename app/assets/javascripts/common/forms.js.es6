App.Forms = {

  initialize: function() {
    App.Forms.enableInputs()
    App.Forms.enableDynamicSubmit()
    App.Forms.performFormFocus($('document'))
    App.Forms.appendRoleDescription()
  },

  appendRoleDescription: function() {
    $('.read-only').append("<p>Can only view reports, organizations, and deals; cannot edit or add new deals</p>")
    $('.read-only .text').css('font-weight', 'bold');

    $('.standard-user').append("<p>Can create and edit deals and users; cannot create organizations or edit organization's settings</p>")
    $('.standard-user .text').css('font-weight', 'bold');

    $('.entity-admin').append("<p>Can create and edit deals and users, add new organizations, and edit organization's settings</p>")
    $('.entity-admin .text').css('font-weight', 'bold');
  },

  enableInputs: function(context = '') {
    $(`${context} input[type=file].bootstrap-file-input`).bootstrapFileInput()
    $(`${context} .selectpicker`).selectpicker()
    $(`${context} .datepicker`).datepicker({
      autoclose: true,
      orientation: 'bottom'
    })
    // TODO: Find a better solution
    $('#modal').on('mouseover', '.timepicker', function() {
      $(`${context} .timepicker`).timepicker({
        timeFormat: "g:i A"
      })
    })
    $(document).trigger('refresh_autonumeric')
  },

  enableDynamicSubmit: function() {
    $('#modal').off('keypress')
    $('#modal').on('keypress', 'input', $.debounce(500, function(e) {
      const returnKeycode = 13
      if (e.which == returnKeycode) {
        App.Helpers.preventDefault(e)
        const form = $(this).closest('form')
        // we are handling the ajaxSubmit() of stuff with class 'no-turboboost' elsewhere with jquery.form library.
        if (form.length > 0 && !form.hasClass('no-turboboost')) {
          form.submit()
        } else {
          return false
        }
      }
    }))
  },

  performFormFocus: function(parents, focus) {
    try {
      if (focus){
        App.Forms.focusFirstInput(parents)
      }
    }
    catch(error) {
    }
  },

  focusFirstInput: function(parents) {
    const first_form_input = parents.find('input[type!="hidden"][type!="file"][type!="radio"][type!="checkbox"][readonly!="readonly"], select, textarea').first()
    first_form_input.data('focus', true)
    App.Forms.focusElement(first_form_input)
  },

  focusElement: function(element) {
    const el = $(element)
    if ((el.is("input") && el.attr("type") == "text") || el.is("textarea")) {
      el.focus()
      App.Forms.moveCursorToEndOfInput(el)
    }
    else {
      el.focus()
    }
  },

  moveCursorToEndOfInput: function(element) {
    const el = $(element)[0]
    if (typeof(el.selectionStart) == "number") {
      el.selectionEnd = el.value.length
      el.selectionStart = el.selectionEnd
    }
    else if (typeof(el.createTextRange) != "undefined") {
      el.focus()
      const range = el.createTextRange()
      range.collapse(false)
      range.select()
    }
  },

}

$(document).on('turbolinks:load turboboost:complete', function() {
  App.Forms.initialize()
});
