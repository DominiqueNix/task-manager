let taskData = document.getElementById('task-card').getAttribute('data-value');
let tasks = JSON.parse(taskData);
let totalTasks = tasks.length;
let totalInProgressTasks = 0;
let totalCompleteTasks = 0;
let totalNotStartedTasks = 0;

tasks.forEach(task => {
   if(task.status == "In progress"){ 
    totalInProgressTasks+=1
   } else if(task.status == "Complete"){
    totalCompleteTasks+=1
   }else if(task.status == "Not started"){
    totalNotStartedTasks+=1
   }
})

document.getElementById("total").textContent = totalTasks
document.getElementById("not-started").textContent = totalNotStartedTasks
document.getElementById("in-progress").textContent = totalInProgressTasks
document.getElementById("complete").textContent = totalCompleteTasks
document.getElementById("sub-title").textContent = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})

//grab all the task divs
let taskCheckbox =  document.getElementById('task-assignees');
let projectData = taskCheckbox.getAttribute('data-value');
let projects = JSON.parse(projectData);

projects.forEach(p => {
    //grab the project from the table
    let tableProject = document.getElementById(`progress-project-${p._id}`)
    let compT = 0;
    let totalT = p.tasks.length
    p.tasks.forEach(t => {
        if(t.status === 'Complete'){
            compT += 1
        }
    })
    tableProject.setAttribute('style', `width: ${(compT/totalT || 0)*100}%`)
})

//sort tasks by upcoming: soonest tasks duw within the next two weeks
for(let i = 0; i < tasks.length-1; i++){

    let currTask = new Date(tasks[i].dueDate).getTime()
    let nextTask = new Date(tasks[i+1].dueDate).getTime()
    let twoWeeksAway = new Date()
    twoWeeksAway.setDate(twoWeeksAway.getDate() +14)
    if(nextTask > currTask && nextTask < twoWeeksAway.getTime()){
        let temp = tasks[i]
        tasks[i] = tasks[i+1]
        tasks[i+1] = temp
    }   
}



//grab btn for pojects and redirect to a single project view 
//updating progress bar in project table

