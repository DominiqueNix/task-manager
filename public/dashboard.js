let taskData = document.getElementById('task-card').getAttribute('data-value');
let tasks = JSON.parse(taskData);
let totalTasks = tasks.length;
let totalInProgressTasks = 0;
let totalCompleteTasks = 0;
let totalNotStartedTasks = 0;

tasks.forEach(task => {
    // console.log(task.status)
   if(task.status == "In progress"){ 
    totalInProgressTasks+=1
   } else if(task.status == "Complete"){
    totalCompleteTasks+=1
   }else if(task.status == "Not started"){
    totalNotStartedTasks+=1
   }
})
// console.log(totalCompleteTasks)
document.getElementById("total").textContent = totalTasks
document.getElementById("not-started").textContent = totalNotStartedTasks
document.getElementById("in-progress").textContent = totalInProgressTasks
document.getElementById("complete").textContent = totalCompleteTasks
document.getElementById("sub-title").textContent = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})


console.log(new Date("Thu Feb 15 2024 00:00:00 GMT-0600 (Central Standard Time)").toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}))

// console.log("Thu Feb 15 2024 00:00:00 GMT-0600 (Central Standard Time)")
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
    //updating the project the user has selected
    if(p._id == projectSelectForm.value){
        selectedProject = p
    }

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

newTaskSubmit.addEventListener('click', async(e) =>{
    e.preventDefault()
    let projectId = selectedProject._id
    let title = document.getElementById('task-title').value.trim()
    let description = document.getElementById('task-description').value.trim()
    let priority = document.getElementById('task-priority').value.trim()
    let status = document.getElementById('task-status').value.trim()
    let dueDate = document.getElementById('due-date').value
    let assignees = []
    document.querySelectorAll(".task-checkbox:checked").forEach(node => assignees.push(node.value))

    // console.log(projectId)
    // console.log(title)
    // console.log(description)
    // console.log(priority)
    // console.log(status)
    // console.log(dueDate)
    // console.log(assignees)
    if(title) {
        const res = await fetch(`/projects/${projectId}/tasks`, {
            method:'POST', 
            body: JSON.stringify({title, description, priority, status,dueDate ,assignees}), 
            headers: {'Content-Type': 'application/json'}
        })

        if(res.ok) {
            location.reload()
        } else {
            alert(res.statusText)
        }
    }
})

//autocomplete for collaborators 
let users = [];
let usersEmail = []

document.getElementById('projectModalBtn').addEventListener('click', async () => {
    const res = await fetch('/dashboard/users')
    if(res.ok) {
        users = await res.json()
        users.forEach(u => usersEmail.push(u.email))
    } else {
        alert(res.statusText)
    }
})

const autocompleteMatch = (input) => {
    if(input == '') {
        return []
    }

    let reg = new RegExp(input)
    return usersEmail.filter((term) => {
        if(term.match(reg)) {
            return term;
        }
    })
}

const showResults = (val) => {
    res = document.getElementById("result")
    res.innerHTML = '';
    let ul = document.createElement('ul')
    let terms = autocompleteMatch(val)
    for(i=0; i < terms.length; i++) {
        let item = document.createElement('li')
        item.textContent = terms[i]
        item.setAttribute('onClick', "addCollaborator(this)")
        ul.appendChild(item)
    }
    res.appendChild(ul)


}
let projectCollaborators = [];
let chosenCollaborators = document.getElementById("chosen-collaborators")

const addCollaborator = (val) => {
    let newCollab;
    users.forEach(u => {
        if(u.email === val.textContent){
            newCollab = u._id
        }
    })
    projectCollaborators.push(newCollab)
    let span = document.createElement('span');
    span.classList.add('d-inline-flex')
    span.classList.add("badge", "badge-pill", "bg-secondary", "m-2", "p-2", "collab")
    span.textContent = val.textContent
    let closeBtn = document.createElement('div')
    closeBtn.classList.add('remove-collab')
    closeBtn.innerHTML = "<i class='bx bx-x-circle'></i>"
    closeBtn.setAttribute("onClick", "removeProjectCollaborator(this.parentElement)")
    span.appendChild(closeBtn)
    chosenCollaborators.appendChild(span)    
}

const removeProjectCollaborator = (val) => {
    let removedCollab;
    users.forEach(u => {
        if(u.email === val.textContent){
            removedCollab= u._id
        }
    })
    const removed = projectCollaborators.indexOf(removedCollab)
    projectCollaborators.splice(removed, 1)
    chosenCollaborators.removeChild(val)
}

//add new project

document.getElementById('new-project-submit').addEventListener('click', async() => {
    
    let title = document.getElementById('project-title').value.trim();
    let description = document.getElementById('project-description').value.trim();
    let onlyOwnerEdit = document.getElementById('only-owner-edit').checked
    let collaborators = projectCollaborators

    if(title) {
        const res = await fetch(`/projects`, {
            method:'POST', 
            body: JSON.stringify({title, description, onlyOwnerEdit, collaborators}), 
            headers: {'Content-Type': 'application/json'}
        })

        if(res.ok) {
            location.reload()
        } else {
            alert(res.statusText)
        }
    }
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

