///// Called when app launch
$(function() {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#SaveBtn").click(onSaveBtn);
  $("#EditBtn").click(onEditBtn);
  $("#EditTaskBtn").click(onEditTaskBtn);
  $("#UpdateBtn").click(onUpdateBtn);
  $("#UpdateTaskBtn").click(UpdateTaskBtn)
  $("#YesBtn_logout").click(onLogoutBtn);
  $("#YesBtn_Taskdelete").click(deleteTask);
  $("#YesBtn_delete").click(deleteMemo);
  $("#UserUpdateBtn").click(updateUser);
  $("#AddProjBtn").click(AddProject);
  $("#AddTasksBtn").click(addTasks);
  $("#Assignments").click(getMemoList);
    $("#calendarbutton").click(CreateCalendar);


});



var currentMemoID;
var currentTaskID
var MC = monaca.cloud;

function onRegisterBtn()
{
  var email = $("#reg_email").val();
  var password = $("#reg_password").val();
  var age = $("reg_age").val();
console.log(MC);
  MC.User.register(email, password, age)
    .done(function()
    {
      console.log('Registration is success!' + MC.User._oid);
      $.mobile.changePage('#LandingPage');
    })
    .fail(function(err)
    {
        console.log('FAILED');
      alert('Registration failed!');
      console.error(JSON.stringify(err));
    });
}

function onLoginBtn()
{
  var email = $("#login_email").val();
  var password = $("#login_password").val();
  var MC = monaca.cloud;
  MC.User.login(email, password)
    .done(function()
    {
      console.log('login: '  + MC.User._oid);
      getUserList();
      $.mobile.changePage('#LandingPage');
    })
    .fail(function(err)
    {
      alert('Login failed: ' + err.message);
      console.error(JSON.stringify(err));
    });
}

function onLogoutBtn()
{
  MC.User.logout()
    .done(function()
    {
      console.log('Logout is success!');
      $.mobile.changePage('#LoginPage');
    })
    .fail(function(err)
    {
      alert('Logout failed!');
      console.error(JSON.stringify(err));
    });
}

function onSaveBtn()
{
  var title = $("#title").val();
  var content = $("#content").val();
  if (title != '')
  {
    addMemo(title,content);
  }
}

/*function addMemo(title,content) {
  var memo = MC.Collection("Memo");

  memo.insert({ title: title, content: content})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#title").val("");
    $("#content").val("");

    // display a dialog stating that the inserting is success
    $("#okDialog_add").popup("open", {positionTo: "origin"}).click(function(event)
    {
      getMemoList();
      $.mobile.changePage('#ListPage');
    });
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("Collection 'Memo' not found! Please create collection from IDE.");
    } else {
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    }
  })
} */

function AddProject()
{
  var title = $("#title").val();
  var content = $("#content").val();
  if (title != '')
  {
    addProjectfinal(title,content);
  }
}

function addProjectfinal(title,content) {
  var Projects = MC.Collection("Projects");

  Projects.insert({ title: title, content: content})
  .done(function(insertedItem)
  {
    alert('Insert is success!');
    console.log('Assignment successfuly saved!');
      $.mobile.changePage('#LandingPage');
    
    $("#title").val("");
    $("#content").val("");
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("Collection 'Memo' not found! Please create collection from IDE.");
    } else {
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    }
  })
}

function addTasks(asignId){
      var Projects = MC.Collection("Tasks");
    var title= $("#Tasktitle").val();
    var content= $("#Taskcontent").val();
    var assignmentId= $("#assignmentid").val();
    var taskbegin= $("#taskbegin").val();


  Projects.insert({title: title, content:content, AssignmentId:assignmentId, taskbegin:taskbegin})
  .done(function(insertedItem)
  {
    alert('Insert is success!');
    console.log('Assignment successfuly saved!');
      $.mobile.changePage('#LandingPage');
    
    $("#title").val("");
    $("#content").val("");
  })
}

function onShowLink(id,title,content)
{
  currentMemoID = id;
  $("#title_show").text(title);
  //$("#content_show").text(content);
  $.mobile.changePage("#ShowPage");
  GetTasks(id);
  
  
}

function onShowTasksLink(_id, title, content){
    $("#One_Task_show").empty();
    $.mobile.changePage("#ShowTasksPage");
    
    showtask(_id, title, content);  
}

function showtask(_id, title, content){
    //$("#One_Task_show").append(title + content);
    console.log(title);
    console.log(content);
    $("#title_Task_show").text(title);
    $("#content_Task_show").text(content);
    $("#id_Task_show").text(_id);

}

function GetTasks(id){
            var Tasks = monaca.cloud.Collection("Tasks");
            var Criteria = monaca.cloud.Criteria('AssignmentId == "'+id+'"');
            //var id= 0;
            console.log(id);
            $("#assignmentid").val(id);

            Tasks.find(Criteria, "", {propertyNames: ["title", "content"]})
            .done(function(result)
            {
                if(result.totalItems == 0){
                    console.log("no tasks");
                    $("#content_show").empty();
                }else{
                   console.log('Total items found: ' + result.totalItems);
                   console.log('The body of the first item: ' + result.items[0].content);
                   
                   $("#content_show").empty();
                   $.removeData(id);
                   
                   //GetTasks(id).each(function( result ) {
                   for(i = 0; i < result.totalItems; i++) { 
                       var edit= "<a href=''>Edit</a>";
                       var show= "<a href='javascript:onShowLink(\'' + result.items[i].id + '\',\'' + result.items[i].title + '\',\'' + memo.content + '\')' class='show'><h3></h3><p></p></a>";
                //$li = $("<li><a href='javascript:onShowLink(\"" + memo._id + memo.title + memo.content + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtn(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
                     
                    $("#content_show").append("<li><a href='javascript:onShowTasksLink(\"" + result.items[i]._id + "\",\"" +result.items[i].title + "\",\"" + result.items[i].content + "\")' class='show'>" +result.items[i].title+ "</a>  <a href='javascript:DeleteTaskBtn(\"" + result.items[i]._id + "\")' class='delete'>Delete</a></li>");


                    }
               
                }   
                //});
            })
            .fail(function(err)
            {
               console.log("Err#" + err.code +": " + err.message);
            });

        }
        
function CreateCalendar(){
    var cal = monaca.cloud.Collection("Calendar");
    cal.find('',"",{propertyNames: ["Month", "Day"]})
    .done(function(result)
    {
       console.log('Total items found: ' + result.totalItems);
       console.log('The body of the first item: ' + result.items[0].Month);
                  var date= new Date();
                  var year= date.getFullYear();

       for(y=0; y<2; y++){
           //for(v=12; v<19;v++){
           //  var mm= new Date("3/04/2016");
           //  for(v = new Date("02/03/2016"); v <= mm; v.getDate()+1){
           //                    $("#day1-3-20016").append("<p>"+v+"</p>");
           // }
           
//            var start = new Date(" March 2, 2016");
//     var end = new Date("April 5, 2016");
// 
//     while(start < end){
//         var newDate = start.setDate(start.getDate() + 1);
//        start1 = new Date(newDate);
//        var newdate1= start1.getMonth()+"-"+start1.getDay()+"-"+start1.getFullYear();
//        $("#day"+newdate1).append("<p>ii</p>");
// 
//               console.log(newdate1);
//               
//     }

var start = new Date("02/05/2016");
    var end = new Date("03/10/2016");

    while(start < end){

       var newDate = start.setDate(start.getDate() + 1);
       start = new Date(newDate);
       //start.format("YYYY-MM-DD");
        // var day= start.getDay();
        // var month= start.getMonth();
        // var year= start.getFullYear();
        //var sdsa= $.format.date(new Date(), 'dd M yy'));
        //dateid= month+"."+day+"."+year;
            //var d = new Date(dateObject);
            var day = start.getDate();
            var month = start.getMonth();
            var year = start.getFullYear();
        if (day < 10) {
            day = day;
        }
        if (month < 10) {
            month = month;
        }
        var date = month + "-" + day + "-" + year;
    
        console.log(date);
        //console.log(day);
        $("#day"+date).append("<p>ii</p>");

        // console.log(day);


    }
    

            $("#calendar").append("<div id='yr'>"+year);
            //year++;
           for(i = 0; i<12; i++){
               var month= result.items[i].Month;
               var days= result.items[i].Day;
               $("#calendar").append("<div id='month'>"+month);
               
              for(d=1;d<days;d++){
                  //d++;
                  $("#calendar").append("<div id='day"+i+"-"+d+"-"+year+"'>"+d+"</div>");
                  
                  //for(v=210; v<330;v++){
                  //var datepick="150";
                  //$("#day"+v).css({"background-color":"blue"});
                  //}
              }
              $("#calendar").append("</div></div>");
               console.log("hello");
               //                     $("#day").append(i);
               
           }
       }
    })
    .fail(function(err)
    {
       console.log("Err#" + err.code +": " + err.message);
    });
}

function onDeleteBtn(id)
{
  currentMemoID = id;
  $( "#yesNoDialog_delete" ).popup("open", {positionTo: "origin"})
}

function DeleteTaskBtn(_id)
{
    
  currentTaskID = _id;
  console.log(currentTaskID);
  $( "#Task_delete" ).popup("open", {positionTo: "origin"})
}

function deleteTask()
{
    var memo = MC.Collection("Tasks");
    memo.findOne(MC.Criteria("_id==?", [currentTaskID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The memo is deleted!");
          getMemoList();
          $.mobile.changePage("#ListPage");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    });
    var Diary = monaca.cloud.Collection("Tasks");
    console.log(currentTaskID);

    // Diary.findOne('_id == "'+currentTaskID+'"')
    // .done(function(item)
    // {
    //    item.remove()
    //    .done(function()
    //    {
    //       console.log("Yes indeed I like him");
    //    });
    // });
}

function deleteMemo()
{
  console.log('yes');
  var memo = MC.Collection("Projects");
  memo.findOne(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The memo is deleted!");
          getMemoList();
          $.mobile.changePage("#ListPage");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    });
}

function onEditBtn()
{
  var title = $("#title_show").text();
  var content = $("#content_show").text();
  $("#title_edit").val(title);
  $("#content_edit").text(content);
  $.mobile.changePage("#EditPage");
}

function onEditTaskBtn(){
     var title = $("#title_Task_show").text();
   var content = $("#content_Task_show").text();
     var id= $("#id_Task_show").text();
  console.log("the id is="+ id);
  //console.log("the content is="+ content);
  $("#title_Task_edit").val(title);
  $("#content_Task_edit").text(content);
    $("#id_Task_edit").val(id);

  $.mobile.changePage("#EditTaskPage");
}
function UpdateTaskBtn(id){
    var new_title = $("#title_Task_edit").val();
  var new_content = $("#content_Task_edit").val();
    var id = $("#id_Task_edit").val();

console.log(id);
  if (new_title != '') {
    editTaskMemo(id, new_title, new_content);
  }
}

function editTaskMemo(id, new_title, new_content){
  var memo = MC.Collection("Tasks");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
    console.log("edittaskmemo title =" + items.items[0].title);
    //console.log("edittaskmemo content ="+ items.items[0].content);
      items.items[0].title = new_title;
      items.items[0].content = new_content;
      items.items[0].update()
        .done(function(updatedItem)
        {
            $.mobile.changePage("#ListPage");
          console.log('Updating is success!');
          //display a dialog stating that the updating is success
          $( "#okDialogTask_edit" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
          //   //getMemoList();
            $.mobile.changePage("#ListPage");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function onUpdateBtn()
{
  var new_title = $("#title_edit").val();
  var new_content = $("#content_edit").val();
  var id = currentMemoID;
  if (new_title != '') {
    editMemo(id, new_title, new_content);
  }
}

function editMemo(id, new_title, new_content){
  var memo = MC.Collection("Projects");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].title = new_title;
      items.items[0].content = new_content;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //display a dialog stating that the updating is success
          $( "#okDialog_edit" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            getMemoList();
            $.mobile.changePage("#ListPage");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function getMemoList() {
  console.log('Refresh List');
  var MC = monaca.cloud;
  var memo = MC.Collection("Projects");
 
  memo.findMine()
    .done(function(items, totalItems)
    {
        //console.log("all: " + JSON.stringify(items));
      $("#ListPage #TopListView").empty();
      var list = items.items;

      for (var i in list)
      {
        var memo = list[i];
        var asignId = memo._id;
        var d = new Date(memo._createdAt);
        var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        
        $li = $("<li><a href='javascript:onShowLink(\"" + memo._id + "\",\"" + memo.title + "\",\"" + memo.content + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtn(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
        $li.find("h3").text(date);
        $li.find("p").text(memo.title);

        $("#TopListView").prepend($li);
      }
      if (list.length == 0) {
        $li = $("<li>No memo found</li>");
        $("#TopListView").prepend($li);
      }
      $("#ListPage #TopListView").listview("refresh");
    })
  .fail(function(err){
    if (err.code == -32602) {
      alert("Collection 'Memo' not found! Please create collection from IDE.");
    } else {
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    }
  });
}

function getUserList() {
   console.log('blahblahbla');
   var username = monaca.cloud.User.getProperty("age");
   monaca.cloud.User.login("Login", "login")
    .then(function()
    {
       return monaca.cloud.User.getProperty("age");
    })
    .then(function(age)
    {
       console.log(age);
       console.log(username);
    })
}

function updateUser(){
      var UpdAge = $("#upd_age").val();
      var UpdEmail = $("#upd_email").val();
      var UpdPassword= $("#upd_password").val();
      var updLogin=$("#upd_login").val();

        monaca.cloud.User.login(updLogin, UpdPassword)
    .then(function()
    {
       return monaca.cloud.User.saveProperties({"age": UpdAge,"email":UpdEmail });
       alert('Your details are updated!');
       $.mobile.changePage('#LandingPage');

    })
    .done(function()
    {
       cosole.log('Your nickname and email were changed');
              alert('Your details are updated!');

    })
}