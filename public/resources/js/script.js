
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
      name :$('#name').val(),
      content : $('#content').val()
    }
    console.log(formData);

    $.ajax({
      url: originURL + actionString ,
      method: 'POST',
      data: formData ,
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


  $('#viewComments').on("click", function(e){
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    



    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data){
      alert(data);
         var noteName = `<strong> Name : ${data.note.name} </strong>`;  
         var noteContent = `Note : ${data.note.content}`; 

         var deleteButton = `<span class="badge">
         <form id="form-delete-{{_id}}" method="post">
           <input class="btn-small delete-comment-button" data-id="{{_id}}" type="submit" value="Delete" style="color: white; background-color: red; border-color: red;">
         </form>
       </span>`;
        


       
          $(`#name-${thisId}`).append(noteName);
          $(`#content-${thisId}`).append(noteContent).append(deleteButton);
          $(`#noContent-${thisId}`).text('');
          
      


         console.log(data.note.name);
         console.log(data.note.content);
    });
  });


});

