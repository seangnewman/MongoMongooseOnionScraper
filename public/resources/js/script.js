

$(document).ready(function(){
 
 

  // Click Listener for FORM SUBMISSION to ADD a comment
  $('.add-comment-button').on('click', function(event){
    event.preventDefault();
     
    // Get _id of comment to be deleted
    var articleId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var originURL = window.location.origin;
    const actionString = '/articles/add/';
    const frmAction = "form-add-";
    var formID = $('#' + frmAction + articleId );
    
     
    // AJAX Call to delete Comment
    $.ajax({
      url: originURL + actionString + articleId,
      type: 'POST',
      data: formID.serialize(),
      success : function(response){
        console.log("yes!")
      },
      error: function(error){
        console.log("shit!");
      }
    })
    .done(function() {
      // Refresh the Window after the call is done
      console.log('done?');
      alert("done?");
      location.reload();
    });
    ;
    
    // Prevent Default
    return false;

  });
   
 
  
});

