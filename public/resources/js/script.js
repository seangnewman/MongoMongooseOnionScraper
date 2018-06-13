
$(document).ready(function () {



  // Click Listener for FORM SUBMISSION to ADD a comment
  $('.add-comment-button').on('click', function (event) {
    event.preventDefault();

    // Get _id of comment to be deleted
    var articleId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var originURL = window.location.origin;
    const actionString = '/articles/' + articleId;
    const frmAction = "form-add-";
    var formID = $('#' + frmAction + articleId);
    var formData = {
      name :"Testing",
      content : "Testing"
    }
    console.log(actionString);

    $.ajax({
      url: originURL + actionString ,
      method: 'POST',
      data: {name:"testing", content: "testing"},
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.log(error);
      }
    })
      .done(function () {
        // Refresh the Window after the call is done
        console.log('done?');
        alert("done?");
        location.reload();
      });
    ;



  });



});

