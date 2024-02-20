let taskData = document.getElementById('task-card').getAttribute('data-value');
let tasks = JSON.parse(taskData);
let totalTasks = tasks.length;
let totalInProgressTasks = 0;
let totalCompleteTasks = 0;
let totalNotStartedTasks = 0;

tasks.forEach(task => {
    // console.log(task.status)
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


//grab submit btn 
//grab all the task divs

let taskCheckbox =  document.getElementById('task-assignees');
let projectData = taskCheckbox.getAttribute('data-value');
let projects = JSON.parse(projectData);

//for the selected project
let projectSelectForm = document.getElementById('task-project')

// let selectedProject= projectSelectForm.options[projectSelectForm.selectedIndex].getAttribute('data-id');

let selectedProject;

projects.forEach(p => {
    if(p._id == projectSelectForm.value){
        selectedProject = p
    }
})


//updated the assginees check box for tasks based on the project chosen
selectedProject.collaborators.forEach(col => {
    let formDiv = document.createElement('div');
    formDiv.classList.add("form-check")
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox')
    input.setAttribute('value', col._id)
    input.setAttribute('id', col._id)
    input.classList.add('form-check-input')
    input.classList.add('task-checkbox')
    let label = document.createElement('label')
    label.setAttribute('for', col._id)
    label.classList.add('form-check-label')
    label.textContent = col.email
    formDiv.appendChild(input)
    formDiv.appendChild(label)
    
    taskCheckbox.appendChild(formDiv)
})

let newTaskSubmit = document.getElementById("new-task-submit")

newTaskSubmit.addEventListener('click', async() =>{
    let projectId = selectedProject._id
    let title = document.getElementById('task-title').value.trim()
    let description = document.getElementById('task-description').value.trim()
    let priority = document.getElementById('task-priority').value.trim()
    let status = document.getElementById('task-status').value.trim()
    let assignees = []
    document.querySelectorAll(".task-checkbox:checked").forEach(node => assignees.push(node.value))
    
    if(title) {
        const res = await fetch(`/projects/${projectId}/tasks`, {
            method:'POST', 
            body: JSON.stringify({title, description, priority, status, assignees}), 
            headers: {'Content-Type': 'application/json'}
        })

        if(res.ok) {
            location.reload()
        } else {
            alert(res.statusText)
        }
    }
})

//grab btn for pojects and redirect to a single project view 