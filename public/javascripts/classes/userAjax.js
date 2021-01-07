/**
 * @classdesc This is the class used to make ajax calls for user account authorization.
 * @class
 */
class UserAjax {

     /**
      * This function is the constructor function for a UserAjax object.
      */
     constructor() {
     }

     /**
      * Gathers inputted information to send HTTP POST request to create new user in database
      */
     add() {
          console.log("accessed user add function");
          let userData = {
               "email" : $("#newUser fieldset input#inputEmail").val(),
               "password" : $("#newUser fieldset input#inputPassword").val()
          };
          $.ajax({
               type: "POST",
               data: userData,
               url: "/register",
               dataType: "JSON"
          }).done(function(response) {
               if (response.msg === '') {
                    $("#newUser fieldset input").val("");
                    alert("User successfully added");
                    console.log("new user added");
               }
               else {
                    alert(`<p>${response.msg}</p>`);
                    console.log(`ERROR ${JSON.stringify(response.msg)}`);
               }
          });
     }

     /**
      * Gathers inputted information to send a HTTP POST request to authorize user access to an account
      */
     login() {
          console.log("accessed user login function");
          let userData = {
               "email" : $("#signInUser fieldset input#inputEmail").val(),
               "password" : $("#signInUser fieldset input#inputPassword").val()
          };
          $.ajax({
               type : "POST",
               data : userData,
               url : "/login",
               dataType : "JSON"
          }).done(function(response) {
               if (response.msg === '') {
                    window.location.replace("/project/");
                    console.log("User login successful");
               }
               else {
                    $("#signInUser fieldset input").val("");
                    alert("Username or password is incorrect");
                    console.log(`ERROR ${JSON.stringify(response.msg)}`);
               }
          });
     }

     /**
      * Sends HTTP POST request to database to log user out
      */
     logout() {
          console.log("accessed user logout function");
          $.ajax({
               type : "POST",
               url : "/logout"
          }).done(function(response) {
               if (response.msg === "") {
                    window.location.replace("/signin");
               }
               else {
                    $("body").append("<p>an uhoh has occurred somewhere</p>");
                    console.log(`${JSON.stringify(response.msg)}`)
               }
          });
     }
}