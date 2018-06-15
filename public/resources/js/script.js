
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
      name: $('#name').val(),
      content: $('#content').val()
    }
    console.log(formData);

    $.ajax({
      url: originURL + actionString,
      method: 'POST',
      data: formData,
      success: function (response) {
        alert("success!");
        console.log(response);
      },
      error: function (error) {
        console.log(error);
      }
    })
      .done(function () {
        // Refresh the Window after the call is done

        location.reload();
      });
    ;



  });


  $('#viewComments').on("click", function (e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");




    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function (data) {
      alert(data);
      var noteName = `<strong> Name : ${data.note.name} </strong>`;
      var noteContent = `Note : ${data.note.content}`;

      var deleteButton = `<span class="badge">
         <form id="form-delete-{{_id}}" >
           <input class="btn-small delete-comment-button" data-id="{{_id}} class="delete" type="submit" value="Delete" style="color: white; background-color: red; border-color: red;">
         </form>
       </span>`;




      $(`#name-${thisId}`).append(noteName);
      $(`#content-${thisId}`).append(noteContent).append(deleteButton);
      $(`#noContent-${thisId}`).text('');




      console.log(data.note.name);
      console.log(data.note.content);
    });
  });

  // When user clicks the delete button for a note
  $('.collection-item').on("click", ".delete-comment-button", function () {

    // Save the p tag that encloses the button
    var selected = $(this).parent();
    var thisId = $(this).attr("data-id");

    alert(thisId);


    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
      type: "GET",
      url: "/delete/" + selected.attr("data-id"),

      // On successful call
      success: function (response) {
        // Remove the p-tag from the DOM
        selected.remove();
        // Clear the note and title inputs

      }
    });
  });



});

