//grab all the task divs
let taskCheckboxMain =  document.getElementById('task-assignees');
let projectDataMail = taskCheckboxMain.getAttribute('data-value');
let projectsMain = JSON.parse(projectDataMail);

// let selectedProject;

// const changeProjectId = (id) => {
//     projectSelectForm.setAttribute('value', id)
//     console.log(projectSelectForm.value)
//     if(projectsMain.length) {
//         projectsMain.forEach(p => {
//         //updating the project the user has selected
//         if(p._id == projectSelectForm.value){
//             selectedProject = p
//         }
//     })
//     }
// }

if(projectsMain.length){ 
//for the selected project
let projectSelectForm = document.getElementById('task-project')

//project not updatating maye so an onlick form this with the 
//function in the html like done with the autocomplete stuff




let selectedProject;

projectSelectForm.addEventListener('click', () => {
    projectsMain.forEach(p => {
    //updating the project the user has selected
    if(p._id == projectSelectForm.value){
        selectedProject = p
    }
})

    if(document.getElementsByClassName('assignee-form-list')){
        let one = document.getElementsByClassName('assignee-form-list')
        console.log("The length of the div is: "+one.length)
        for(let i = 0; i < one.length; i++){
            one[i].remove()
            one[one.length-1].remove()
        }
    }

        selectedProject.collaborators.forEach(col => {
            let formDiv = document.createElement('div');
            formDiv.classList.add("form-check", "assignee-form-list")
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
            
            taskCheckboxMain.appendChild(formDiv)
        })
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
    if(projectId && title) {
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
}

//autocomplete for collaborators 
let chosenCollaborators = document.getElementById("chosen-collaborators")
let currentUser = chosenCollaborators.getAttribute('data-value')
let users = [];
let usersEmail = []

document.getElementById('projectModalBtn').addEventListener('click', async () => {
    const res = await fetch('/dashboard/users')
    if(res.ok) {
        users = await res.json()
        users.forEach(u => {
            if(u.email !== currentUser){
            usersEmail.push(u.email)
            }
        })
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
    let checkVal = document.getElementById('only-owner-edit').checked
    let onlyOwnerEdit = !checkVal;
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