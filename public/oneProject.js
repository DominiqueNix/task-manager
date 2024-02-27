
//adding background colors for status and priority based on value
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

// getting task data for the project
let taskData = document.getElementById('progress-section').getAttribute('data-value');
let allProjectTasks = JSON.parse(taskData);

// setting progress bar based on total tasks vs tasks complete
let completedTaskprogressbar = document.getElementById("project-task-complete")
let completedTaskprogressbarText = document.getElementById("project-task-c-text")

let comp = 0;
    let total = allProjectTasks.length;

allProjectTasks.forEach( task => {
    if(task.status == "Complete"){
        comp+=1
    }
})

completedTaskprogressbar.setAttribute('style', `width: ${(comp/total || 0)*100}%`)
completedTaskprogressbarText.textContent = `${Math.round((comp/total || 0)*100)}% of tasks completed`


//delete project function
const handleProjectDelete = async(projectId) => {
        const res = await fetch(`/projects/${projectId}`, {
            method: 'DELETE',   
        })
        if(res.ok){
            document.location.replace('/dashboard')
        }else {
            alert(res.statusText)
        }
    }
    
//delete a project  
let projectDeletebtn = document.getElementById('delete-project')
let currId = document.getElementById("one-project-title").getAttribute('data-value')
projectDeletebtn.addEventListener('click', () => {handleProjectDelete(currId)})


//update project

//default edit permissions
let collabCheckBox = document.getElementById('update-only-owner-edit');
let editPermissionsUpdate = collabCheckBox.getAttribute('data-value');

if(editPermissionsUpdate === "true"){
    collabCheckBox.checked = false
    
} else {
    collabCheckBox.checked = true
}

//default collabs
let currProjectCollabsHTML = document.getElementById('update-chosen-collaborators')
let currProjectCollabs = JSON.parse(currProjectCollabsHTML.getAttribute('data-value'))
let currProjectUser = JSON.parse(currProjectCollabsHTML.getAttribute('data-user'))

let projectUpdateCollaborators = []

currProjectCollabs.forEach(col => {
    if(col.email !== currProjectUser){
    projectUpdateCollaborators.push(col)
    }
})



//autocomplete for collaborators
const removeUpdateProjectCollaborator = (val) => {
    let removedCollab;
    users.forEach(u => {
        if(u.email === val.textContent){
            removedCollab= u._id
        }
    })
    const removed = projectUpdateCollaborators.indexOf(removedCollab)
    projectUpdateCollaborators.splice(removed, 1)
    currProjectCollabsHTML.removeChild(val)
}
let allUsers = [];
let allUsersEmail = []

document.getElementById('update-project').addEventListener('click', async () => {
    const res = await fetch('/dashboard/users')
    if(res.ok) {
        allUsers = await res.json()
        allUsers.forEach(u => {
            if(u.email !== currentUser){
            allUsersEmail.push(u.email)
            }
        })
    } else {
        alert(res.statusText)
    }
})

const updateAutocompleteMatch = (input) => {
    if(input == '') {
        return []
    }

    let reg = new RegExp(input)

    return allUsersEmail.filter((term) => {
        if(term.match(reg)) {
            return term;
        }
    })
}

const updateShowResults = (val) => {
    res = document.getElementById("update-result")
    res.innerHTML = '';
    let ul = document.createElement('ul')
    let terms = updateAutocompleteMatch(val)
    for(i=0; i < terms.length; i++) {
        let item = document.createElement('li')
        item.textContent = terms[i]
        item.setAttribute('onClick', "updateAddCollaborator(this)")
        ul.appendChild(item)
    }
    res.appendChild(ul)
}

//adding collaborator html pill
 projectUpdateCollaborators.forEach(col => {
        let span = document.createElement('span');
        span.classList.add('d-inline-flex')
        span.classList.add("badge", "badge-pill", "bg-secondary", "m-2", "p-2", "collab")
        span.textContent = col.email
        let closeBtn = document.createElement('div')
        closeBtn.classList.add('remove-collab')
        closeBtn.innerHTML = "<i class='bx bx-x-circle'></i>"
        closeBtn.setAttribute("onClick", "removeUpdateProjectCollaborator(this.parentElement)")
        span.appendChild(closeBtn)
        currProjectCollabsHTML.appendChild(span)
    }) 

const updateAddCollaborator = (val) => {
    let newCollab;
    allUsers.forEach(u => {
        if(u.email === val.textContent){
            newCollab = u
        }
    })
    projectUpdateCollaborators.push(newCollab)
    let span = document.createElement('span');
    span.classList.add('d-inline-flex')
    span.classList.add("badge", "badge-pill", "bg-secondary", "m-2", "p-2", "collab")
    span.textContent = val.textContent
    let closeBtn = document.createElement('div')
    closeBtn.classList.add('remove-collab')
    closeBtn.innerHTML = "<i class='bx bx-x-circle'></i>"
    closeBtn.setAttribute("onClick", "removeUpdateProjectCollaborator(this.parentElement)")
    span.appendChild(closeBtn)
    currProjectCollabsHTML.appendChild(span)
}

//update project
document.getElementById('update-project-submit').addEventListener('click', async() => {
    
    let title = document.getElementById('update-project-title').value.trim();
    let description = document.getElementById('update-project-description').value.trim();
    let checkVal = document.getElementById('update-only-owner-edit').checked
    let onlyOwnerEdit = !checkVal;
    let collaborators = []
    projectUpdateCollaborators.forEach(coll => collaborators.push(coll._id))

    if(title) {
        const res = await fetch(`/projects/${currId}`, {
            method:'PUT', 
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