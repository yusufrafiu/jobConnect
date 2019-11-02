var changePassword = $("#chng-pwd");
var cancelPassword = $('#cx-pswd');
var changeEmail    = $("#chng-email");
var cancelEmail    = $("#cx-email");
var changeAvatar   = $('#chng-avtr');
var cancelAvatar   = $('#cx-avtr');

      function showPasswordForm() {
            $("#pswd-div").show(100);
            changePassword.hide(100);
      }
  
      function hidePasswordForm() {
        $("#pswd-div").hide();
        changePassword.show();
      }

      function showEmailForm() {
            $("#email-div").show(100);
            changeEmail.hide(100);
      }

      function hideEmailForm() {
            $("#email-div").hide();
            changeEmail.show();
      }

      function showAvatarForm() {
            $("#avtr-div").show(100);
            changeAvatar.hide(100);
      }

      function hideAvatarForm() {
            $("#avtr-div").hide();
            changeAvatar.show();
      }

$(document).ready(function() {

      changePassword.on('click', function(e) {
            e.preventDefault();
            showPasswordForm();
      });

      cancelPassword.on('click', function(e) {
            e.preventDefault();
            hidePasswordForm();
            
      });

      changeEmail.on('click', function(e) {
            e.preventDefault();
            showEmailForm();
      });

      cancelEmail.on('click', function(e) {
            e.preventDefault();
            hideEmailForm();
            
      });

      changeAvatar.on('click', function(e) {
            e.preventDefault();
            showAvatarForm();
      });

      cancelAvatar.on('click', function(e) {
            e.preventDefault();
            hideAvatarForm();
            
      });





});