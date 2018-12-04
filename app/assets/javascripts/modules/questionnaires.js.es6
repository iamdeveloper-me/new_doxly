App.Questionnaires = {

  initialize: function() {
    App.Questionnaires.bindShowDependentQuestion()
    App.Questionnaires.bindShowOtherQuestion()
  },

  bindShowDependentQuestion: function() {
    $('.has-dependency').each(function() {
      const dependentQuestion = $(this)
      const questionId = $(this).attr("data-question-id")
      const checkboxOption = $('#' + questionId).find('input[type=checkbox]')
      const selectpickerOptions = $(`#${questionId} option`)

      if(checkboxOption.length > 0) {
        checkboxOption.last().on('change', function() {
          if(this.checked) {
            dependentQuestion.show()
          } else {
            dependentQuestion.hide()
          }
        })
      } else if(selectpickerOptions.length > 0) {
        $('#' + questionId).on('change', function() {
          if($(`#${questionId} option:selected`).text() === "Yes") {
            dependentQuestion.show()
          } else {
            dependentQuestion.hide()
          }
        })
      }
    })
  },

  bindShowOtherQuestion: function() {
    $('.other-option').each(function() {
      const otherOption = $(this).find('input[type=checkbox]').last()

      if (otherOption.is(':checked')){
        const otherQuestion = $(this).closest('.form-group').find('.other-question')
        otherQuestion.show();
      }

      otherOption.on('change', function() {
        const otherQuestion = $(this).closest('.form-group').find('.other-question')
        if(this.checked) {
          otherQuestion.show()
        } else {
          otherQuestion.hide()
        }
      })
    })
  }
}
