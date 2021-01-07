let projectAndTaskArray = [];
let recentlyCreatedArray = [];
let scheduleContentArray = [];

let userAjaxObject = new UserAjax();
let siteAjaxObject = new SiteAjax(projectAndTaskArray, recentlyCreatedArray);
let siteAuxObject = new SiteAuxillary(projectAndTaskArray, recentlyCreatedArray);

$(document).ready(async function() {
     if(window.location.pathname === "/project/") {
          console.log("about to populate divs");
          $("#dateHeading").html("Today is " + (new Date()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
          siteAjaxObject.populateDivs();
     }
     else if(window.location.pathname === "/") {
          console.log("check if authorized");
          $.ajax({
               type: "GET",
               url: "/isauthorized"
          }).done(function(response) {
               if (response.msg === '') {
                    window.location.replace("/project/");
               }
               else {
                    window.location.replace("/signin");
               }
          });
     }
     else if(window.location.pathname === "/schedule/") {
          let scheduleObject = new Schedule(scheduleContentArray, $("#schedule").height(), $("#schedule").width()*0.99);
          siteAjaxObject.removeElements("scheduleTaskContainer", "schedule");
          for(let i = 0; i < 7; i++) {
               $("#scheduleTaskContainer").append($("<div>").attr("id", `day${i}`));
          }
          await scheduleObject.retrieveUserInfo();
          console.log(scheduleContentArray);
          scheduleObject.initialize();
          scheduleObject.populate();
     }
});

$(window).resize(async function(event) {
     if(window.location.pathname === "/schedule/") {
          let scheduleObject = new Schedule(scheduleContentArray, $("#schedule").height(), $("#schedule").width());
          siteAjaxObject.removeElements("scheduleTaskContainer", "schedule");
          for (let i = 0; i < 7; i++) {
               $("#scheduleTaskContainer").append($("<div>").attr("id", `day${i}`));
          }
          scheduleObject.initialize();
          scheduleObject.populate();
     }
});

$("#newUser fieldset #inputPassword").attr("type", "password");
$("#signInUser fieldset #inputPassword").attr("type", "password");

$("#btnAddUser").on("click", function(event) {userAjaxObject.add();});
$("#btnSignInUser").on("click", function(event) {userAjaxObject.login();});
$("#btnLogOut").on("click", function(event) {userAjaxObject.logout();});
$("#btnLogOutSchedule").on("click", function(event) {userAjaxObject.logout();});

$("#btnAddProject").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.add("project");
});
$("#btnAddTask").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.add("task");
});
$("#btnAddProjectTask").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.add("projectTask", $(this).attr("rel"));
});
$("#btnAddEvent").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.add("event");
});
$("#btnUpdateProject").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.update("project", $(this).attr("rel"));
});
$("#btnUpdateTask").on("click", function(event) {
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.update("task", $(this).attr("rel"));
});
$("#btnUpdateProjectTask").on("click", function(event){
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.update("projectTask", $(this).attr("rel"));
});
$("#btnUpdateEvent").on("click", function(event){
     siteAuxObject.closeModal($(this).parent().parent().attr("id"));
     siteAjaxObject.update("event", $(this).attr("rel"));
});

$("#btnSearchName").on("click", function(event) {siteAjaxObject.search("name");});
$("#btnSearchDate").on("click", function(event) {siteAjaxObject.search("deadline");});

$(".dateSelector").each(function() {$(this).on("click", (event) => siteAuxObject.openCalendar(`${this.id}`))});
$(".modalClose").each(function() {$(this).on("click", (event) => siteAuxObject.closeModal(`${$(this).parent().attr("id")}`))});
//$(".modalClose").each(function() {$(this).on("click", (event) => console.log($(this).parent().attr("id")))});
/* $("#addTask .modalClose").on("click", (event) => siteAuxObject.closeModal("add", "Task"));
$("#addProject .modalClose").on("click", (event) => siteAuxObject.closeModal("add", "ProjectTask")); */

$("#projectList").on("change", "#container div.project #taskContainer div fieldset .activitycheckbox", (function(event) {
     if($(this).is(":checked")) {
          siteAjaxObject.changeStatusProjectTask($(this).parent().parent().parent().parent().parent().parent().attr("id"), $(this).parent().parent().parent().parent().attr("id"), $(this).attr("data-link"), true);
     }
     else {
          siteAjaxObject.changeStatusProjectTask($(this).parent().parent().parent().parent().parent().parent().attr("id"), $(this).parent().parent().parent().parent().attr("id"), $(this).attr("data-link"), false);
     }
}));
$("#projectList").on("change", "#container div.task fieldset .activitycheckbox", function(event) {
     if($(this).is(":checked")) {
          siteAjaxObject.delete("task", $(this).attr("data-link"), true);
     }
});
$("#recentlyCreatedList").on("change", "#container div.project #taskContainer div fieldset .activitycheckbox", function(event) {
     if($(this).is(":checked")) {
          siteAjaxObject.changeStatusProjectTask($(this).parent().parent().parent().parent().parent().parent().attr("id"), $(this).parent().parent().parent().parent().attr("id"), $(this).attr("data-link"), true);
     }
     else {
          siteAjaxObject.changeStatusProjectTask($(this).parent().parent().parent().parent().parent().parent().attr("id"), $(this).parent().parent().parent().parent().attr("id"), $(this).attr("data-link"), false);
     }
});
$("#recentlyCreatedList").on("change", "#container div.task fieldset .activitycheckbox", function(event) {
     if($(this).is(":checked")) {
          siteAjaxObject.delete("task", $(this).attr("data-link"), true);
     }
});
$("#projectList").on("click", "#addProjectLink", function(event){siteAuxObject.openModal("addProject");});
$("#projectList").on("click", "#addTaskLink", function(event){siteAuxObject.openModal("addTask");});
$("#projectList").on("click", "#addEventLink", function(event){siteAuxObject.openModal("addEvent");});
$("#projectList").on("click", "#container div.project a.linkAddProjectTask", function(event) {siteAuxObject.openModal("addProjectTask", $(this).attr("rel"));});
$("#projectList").on("click", "div.project a.linkUpdateProject", function(event) {
     siteAuxObject.openModal("updateProject", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("project", `#${$(this).parent().parent().attr("id")}`, "#projectList");
});
$("#projectList").on("click", "#container div.task a.linkUpdateTask", function(event) {
     siteAuxObject.openModal("updateTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("task", `#${$(this).parent().attr("id")}`, "#projectList");
});
$("#projectList").on("click", "#container div.projectTask a.linkUpdateProjectTask", function(event) {
     siteAuxObject.openModal("updateProjectTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("projectTask", `#${$(this).parent().attr("id")}`, "#projectList");
});
$("#projectList").on("click", "#container div.event a.linkUpdateEvent", function(event) {
     siteAuxObject.openModal("updateEvent", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("event", `#${$(this).parent().parent().attr("id")}`, "#projectList");
});

//$("#projectList").on("click", "#container div.projectTask a.linkUpdateProjectTask", function(event) {siteAjaxObject.update("projecttask", $(this).attr("rel"), contentArray);});

$("#projectList").on("click", "#container div.project a.linkDeleteProject", function(event) {siteAjaxObject.delete("project", $(this).attr("rel"));});
$("#projectList").on("click", "#container div.task a.linkDeleteTask", function(event) {siteAjaxObject.delete("task", $(this).attr("rel"));});
$("#projectList").on("click", "#container div.projectTask a.linkDeleteProjectTask", function(event) {siteAjaxObject.delete("projecttask", $(this).attr("rel"));});
$("#projectList").on("click", "#container div.event a.linkDeleteEvent", function(event) {siteAjaxObject.delete("event", $(this).attr("rel"));});

$("#projectList").on("click", "#container div.project .pastTaskBtn", function(event) {siteAuxObject.showAllProjectTasks(`#${$(this).parent().parent().parent().parent().attr("id")} #${$(this).parent().parent().parent().attr("id")} #${$(this).parent().parent().attr("id")}`);});
$("#projectList").on("click", "#container div.project .hidePastTaskBtn", function(event) {siteAuxObject.showCurrentProjectTasks(`#${$(this).parent().parent().parent().parent().attr("id")} #${$(this).parent().parent().parent().attr("id")} #${$(this).parent().parent().attr("id")}`);});

//$("#projectList").on("click", "#container div.project a.linkAddProjectTask", function(event){siteAjaxObject.add("projectTask", contentArray, $(this).attr("rel"));});

$("#recentlyCreatedList").on("click", "#container div.project a.linkAddProjectTask", function(event) {siteAuxObject.openModal("addProjectTask", $(this).attr("rel"));});
$("#recentlyCreatedList").on("click", "div.project a.linkUpdateProject", function(event) {
     siteAuxObject.openModal("updateProject", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("project", `#${$(this).parent().parent().attr("id")}`, "#recentlyCreatedList");
});
$("#recentlyCreatedList").on("click", "#container div.projectTask a.linkUpdateProjectTask", function(event) {
     siteAuxObject.openModal("updateProjectTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("projectTask", `#${$(this).parent().attr("id")}`, "#recentlyCreatedList");
});
$("#recentlyCreatedList").on("click", "#container div.task a.linkUpdateTask", function(event) {
     siteAuxObject.openModal("updateTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("task", `#${$(this).parent().attr("id")}`, "#recentlyCreatedList");
});

$("#recentlyCreatedList").on("click", "#container div.project a.linkDeleteProject", function(event) {siteAjaxObject.delete("project", $(this).attr("rel"));});
$("#recentlyCreatedList").on("click", "#container div.task a.linkDeleteTask", function(event) {siteAjaxObject.delete("task", $(this).attr("rel"));});

$("#recentlyCreatedList").on("click", "#container div.project .pastTaskBtn", function(event) {siteAuxObject.showAllProjectTasks(`#${$(this).parent().parent().parent().parent().attr("id")} #${$(this).parent().parent().parent().attr("id")} #${$(this).parent().parent().attr("id")}`);});
$("#recentlyCreatedList").on("click", "#container div.project .hidePastTaskBtn", function(event) {siteAuxObject.showCurrentProjectTasks(`#${$(this).parent().parent().parent().parent().attr("id")} #${$(this).parent().parent().parent().attr("id")} #${$(this).parent().parent().attr("id")}`);});

$("#schedule").on("click", "#scheduleTaskContainer div div a.linkUpdateProjectTask", function(event) {
     console.log("logged");
     siteAuxObject.openModal("updateProjectTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("projectTask", `#${$(this).parent().attr("id")}`, "#recentlyCreatedList");
});
$("#schedule").on("click", "#scheduleTaskContainer div div a.linkUpdateTask", function(event) {
     siteAuxObject.openModal("updateTask", $(this).attr("rel"));
     siteAuxObject.prefillUpdateModal("task", `#${$(this).parent().attr("id")}`, "#recentlyCreatedList");
});