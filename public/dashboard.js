let taskData = document.getElementById('task-card').getAttribute('data-value');
let tasks = JSON.parse(taskData);
console.log(tasks)
let totalTasks = tasks.length;
let totalInProgressTasks = 0;
let totalCompleteTasks = 0;
let totalNotStartedTasks = 0;

tasks.forEach(task => {
    console.log(task.status)
   if(task.status == "in-progress"){ 
    totalInProgressTasks++
   } else if(task.status == "complete"){
    totalCompleteTasks +1
   }else if(task.status == "not started"){
    totalNotStartedTasks +=1;
   }
})

document.getElementById("total").textContent = totalTasks
document.getElementById("not-started").textContent = totalNotStartedTasks
document.getElementById("in-progress").textContent = totalInProgressTasks
document.getElementById("complete").textContent = totalCompleteTasks
document.getElementById("sub-title").textContent = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})

//grab btn for pojects and redirect to a single project view 