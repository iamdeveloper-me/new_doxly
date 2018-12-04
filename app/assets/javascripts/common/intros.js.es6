App.Intros = {

  initialize: function() {
    App.Intros.bindIntroWorkingGroup();
  },

  bindIntroWorkingGroup: function() {
    const roleId = $('.role-group').first().data('id')
    const orgId  = $('.entity-group').first().data('id')
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: "Welcome to the Working Group List! Add all members of the deal teams that will be participating in the negotiation of the transaction (i.e. Buyer, Seller, Buyer’s Counsel, Seller’s Counsel, Investment Banker, Accountant, etc.)."
        },
        {
          element: `#role-${roleId}`,
          intro: "Your law firm has been automatically added to the Working Group List.",
          position: 'top'
        },
        {
          element: `#role-edit-${roleId}`,
          intro: "Click the pencil and select \"Edit Role\" to change the name for the role, i.e. Buyer’s Counsel. To delete a role, click the pencil and select \"Delete Role\"",
          position: 'left'
        },
        {
          element: `#add-individual-${roleId}`,
          intro: "To add members to your organization, make sure the carrot for the organization is selected and then click here. Names of existing members of the team will pop up and can be added. New members can be added by typing in the first name, last name, email and title. For law firms, title can be partner, associate, paralegal, etc.",
          position: 'top'
        },
        {
          intro: "Members of the Working Group List can be given access to the deal at your discretion or just added to the list to keep track of contact information by not selecting \"Send the deal invitation email\" when adding members.",
        },
        {
          element: '#add-role',
          intro: "Add additional roles to a deal by clicking \"Add Role\".",
          position: 'left'
        },
        {
          element: `#add-indivuals-or-entities-${roleId}`,
          intro: "Add individuals or entities into each role. Roles can have more than one member.",
          position: 'top'
        },
        {
          element: `#delete-${orgId}`,
          intro: "To delete a member, individual, or organization from a role, click the delete icon at the end of the row",
          position: 'left'
        },
        {
          intro: "Information included on the Working Group List can be viewed by everyone, except clients, added to the deal."
        }
      ],

      showStepNumbers: false,
      exitOnEsc: true,
      showBullets: false,
      scrollToElement: true,
      exitOnOverlayClick: false,
      nextLabel: 'Next',
      prevLabel: 'Prev',
      skipLabel: 'End',
      doneLabel: 'Done'
    })

    window.addEventListener('turbolinks:load', function() {
      if ($('.content.roles.is_owning_entity').is(':visible')) {
        $.ajax({
          url: 'roles/completed_working_group_intro',
          type: 'GET',
          success: function(data) {
            if(!data) {
              intro.start().onbeforechange(function(){
              }).onexit(function() {
                $.ajax({
                  url: 'roles/completed_working_group_intro',
                  type: 'PUT'
                });
              }).oncomplete(function() {
                $.ajax({
                  url: 'roles/completed_working_group_intro',
                  type: 'PUT'
                });
              })
            }
          }
        })
      }
    });
  }
}

$(document).on('turbolinks:load', function() {
  App.Intros.initialize()
});
