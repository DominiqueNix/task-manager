
//getting task data from handlebars page
let taskCard = document.getElementById('task-card')
let tasks;

if(taskCard) {
//setting task data
let taskData = taskCard.getAttribute('data-value');
tasks = JSON.parse(taskData);

//calculating the total tasks based on status for task status section
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
}
 //getting project data 
let taskCheckbox =  document.getElementById('task-assignees');

if(taskCheckbox){

let projectData = taskCheckbox.getAttribute('data-value');

//settign project data
let projects = JSON.parse(projectData);

projects.forEach(p => {
    //setting project progress bar 
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
}

//caluculating the next 5 upcoming tasks based on task due date
let upcomingTasks = [];

if(taskCard){
 upcomingTasks = tasks.sort((d1, d2) => (new Date(d1.dueDate).getTime() > new Date(d2.dueDate).getTime()) ? 1 : (new Date(d1.dueDate).getTime() < new Date(d2.dueDate).getTime()) ? -1 : 0).splice(0, 5)
}
console.log(upcomingTasks)
let tBody = document.getElementById("dash-task-table")


//create upcoming task table
upcomingTasks.forEach(t => {
    let tr = document.createElement('tr')
    tr.classList.add("m-2")
    let title = document.createElement('td')
    title.innerHTML = `<div class="cell-content">${t.title}</div>`
    title.classList.add("title-row")

    let description = document.createElement('td')
    description.innerHTML = `<div class="cell-content description">${t.description}</div>`
    description.classList.add("desciption-row")

    let dueDate = document.createElement('td')
    dueDate.innerHTML = `<div class="cell-content">${new Date(t.dueDate).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})}</div>`
    
    let status =document.createElement('td')
    status.innerHTML= `<div class="cell-content status justify-content-center">${t.status}</div>`
    
    let priority = document.createElement('td')
    priority.innerHTML= `<div class="cell-content  priority justify-content-center">${t.priority}</div>`

    let assignees = document.createElement('td')
    let assigneesDiv = document.createElement('div')
    assigneesDiv.classList.add("cell-content")

    
    t.assignees.forEach(a => {
        let aDiv = document.createElement('div')
        aDiv.classList.add("m-1")
        aDiv.innerHTML = `<button type="button" class="btn btn-secondary rounded-circle" data-toggle="tooltip" data-placement="top" title=${a.email}>${a.email.charAt(0).toUpperCase()}</button>`
        assigneesDiv.appendChild(aDiv)
    })

    assignees.appendChild(assigneesDiv)

    tr.appendChild(title);
    tr.appendChild(description);
    tr.appendChild(dueDate);
    tr.appendChild(status);
    tr.appendChild(priority);
    tr.appendChild(assignees)
    tBody.appendChild(tr)
})

// generating backgound colors for status and priority on upcomig task tabel based on value
let priority = document.getElementsByClassName('priority')
let statuss = document.getElementsByClassName('status')

for(let i = 0; i < priority.length; i++){
    let p = priority[i].textContent
    if(p === "Critical"){
        priority[i].classList.add('red')
    } else if(p === "High"){
        priority[i].classList.add('orange')
    } else if(p === "Medium"){
        priority[i].classList.add('blue')
    }else if(p === "Minor"){
        priority[i].classList.add('green')
    }
}

for(let i = 0; i < statuss.length; i++){
    let s= statuss[i].textContent
    if(s === "Complete"){
        statuss[i].classList.add('green')
    } else if(s === "Not started"){
        statuss[i].classList.add('orange')
    } else if(s === "In progress"){
        statuss[i].classList.add('blue')
    }
}

