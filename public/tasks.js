
//updating background color of status and priority based on value
let taskPriorities = document.getElementsByClassName('task-box-priorites')
let taskStatuses = document.getElementsByClassName('task-box-status')

for(let i = 0; i < taskPriorities.length; i++){
    let p = taskPriorities[i].textContent
    if(p === "Critical"){
        taskPriorities[i].classList.add('red')
    } else if(p === "High"){
        taskPriorities[i].classList.add('orange')
    } else if(p === "Medium"){
        taskPriorities[i].classList.add('blue')
    }else if(p === "Minor"){
        taskPriorities[i].classList.add('green')
    }
}

for(let i = 0; i < taskStatuses.length; i++){
    let s= taskStatuses[i].textContent
    if(s === "Complete"){
        taskStatuses[i].classList.add('green')
    } else if(s === "Not started"){
        taskStatuses[i].classList.add('orange')
    } else if(s === "In progress"){
        taskStatuses[i].classList.add('blue')
    }
}

//setting porgress bar
let taskData = document.getElementById("progress-section").getAttribute('data-value')
let tasks = JSON.parse(taskData)
let completedTaskprogressbar = document.getElementById("task-complete")
let completedTaskprogressbarText = document.getElementById("task-c-text")

console.log(tasks)

let comp = 0;
let total = tasks.length;

tasks.forEach( task => {
    if(task.status == "Complete"){
        comp+=1
    }
})

completedTaskprogressbar.setAttribute('style', `width: ${(comp/total || 0)*100}%`)
completedTaskprogressbarText.textContent = `${Math.round((comp/total || 0)*100)}% of tasks completed`

//getting project data
let projectData = document.getElementById("tasks-container").getAttribute('data-value')
let projects = JSON.parse(projectData);

//setting project name in task card
let taskProjectTitles = document.getElementsByClassName('task-project-title');

for(let i = 0; i < taskProjectTitles.length; i++){
    let t = taskProjectTitles[i]
    
    projects.forEach(p => {
       p.tasks.forEach(t2 => {
        if(t2 == t.getAttribute('data-id')){
            t.textContent = p.title
        }
       })
    })
}

//delete a task function
const handleTaskDelete = async(taskId) => {
let projectId;
projects.forEach(p => {
    if(p.tasks.includes(taskId)) 
    projectId = p._id
})

    const res = await fetch(`/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',   
    })
    if(res.ok){
        location.reload()
    }else {
        alert(res.statusText)
    }
}


//delete task
let taskDeletebtns = document.getElementsByClassName('delete-task')

for(let i = 0; i < taskDeletebtns.length; i++){
    let currDeleteBtn = taskDeletebtns[i]
    let currId = currDeleteBtn.getAttribute('data-id')
    currDeleteBtn.addEventListener('click', () => {handleTaskDelete(currId)})
}

//update a task
const updateTaskProjectData = document.getElementById('update-task-assignees');
const updateTaskProjects = JSON.parse(updateTaskProjectData.getAttribute('data-value'))


let selectedTask;

let updateTaskBtns = document.getElementsByClassName('update-task')

for(let i = 0; i < updateTaskBtns.length; i++){
    let btn = updateTaskBtns[i]
    btn.addEventListener('click', () => {
        selectedTask = JSON.parse(btn.getAttribute('data-value'))
        let projcetAssociatedWithTask;
        //set defalut value of form to selected task data
        let updateTaskTitle = document.getElementById
        ('update-task-title')
        let updateTaskDescription = document.getElementById('update-task-description')

        updateTaskTitle.setAttribute('value', selectedTask.title)
        updateTaskDescription.setAttribute('value', selectedTask.description)

        projects.forEach(p => {
            p.tasks.forEach(t => {
                if(t === selectedTask._id){
                    projcetAssociatedWithTask = p;
                }
            })
        })

        // setting default project
        let projectDefalutforTask = document.getElementById('project-with-update-task')

        projectDefalutforTask.textContent = projcetAssociatedWithTask.title;
        projectDefalutforTask.setAttribute('value', projcetAssociatedWithTask._id)

        //setting defalut status
        let status = document.getElementById('update-task-status')

        for(let i = 0; i < status.options.length; i++){
            if(status.options[i].value == selectedTask.status){
                status.options[i].selected = true
            }
        }

        //setting defalut priority
        let priority = document.getElementById('update-task-priority')

        for(let i = 0; i < priority.options.length; i++){
            if(priority.options[i].value == selectedTask.priority){
                priority.options[i].selected = true
            }
        }

        //setting defulat date 
        let updateDate = document.getElementById('datepicker2')
        let updateTaskDefaultDate = new Date(selectedTask.dueDate).toLocaleDateString('en-US')
        updateDate.setAttribute('data-date', updateTaskDefaultDate)

        
       //setting default assignees
       let updateTaskAssignees = document.getElementById('update-task-assignees')
        
        if(document.getElementsByClassName('udpate-assignee-form-list')){
            let all = document.getElementsByClassName('update-assignee-form-list')
            for(let i= 0; i < all.length; i++){
                all[i].remove()
                if(all[all.length-1]){
                all[all.length-1].remove()
                }
            }
        }

        if(projcetAssociatedWithTask){
            projcetAssociatedWithTask.collaborators.forEach(col => {
                let formDiv = document.createElement('div');
                formDiv.classList.add("form-check", "update-assignee-form-list")
                let input = document.createElement('input');
                input.setAttribute('type', 'checkbox')
                input.setAttribute('value', col._id)
                input.setAttribute('id', col._id)
                input.classList.add('form-check-input')
                input.classList.add('task-checkbox')
                selectedTask.assignees.forEach(u => {
                    if(u._id === col._id){
                        input.checked = true
                    }
                })
                let label = document.createElement('label')
                label.setAttribute('for', col._id)
                label.classList.add('form-check-label')
                label.textContent = col.email
                formDiv.appendChild(input)
                formDiv.appendChild(label)
                updateTaskAssignees.appendChild(formDiv)
            })
        }

    })
}


//update task
let updateTaskSubmitBtn = document.getElementById('update-task-submit')

updateTaskSubmitBtn.addEventListener('click', async () => {
    let projectId = document.getElementById('update-task-project').value
    let title = document.getElementById('update-task-title').value
    let description = document.getElementById('update-task-description').value
    let priority = document.getElementById('update-task-priority').value
    let status = document.getElementById('update-task-status').value
    let dueDate = document.getElementById('datepicker2').value
    let assignees = [];
    document.querySelectorAll(".task-checkbox:checked").forEach(node => assignees.push(node.value))

    if(projectId && title) {
        const res = await fetch(`/projects/${projectId}/tasks/${selectedTask._id}`, {
            method:'PUT', 
            body: JSON.stringify({title, description ,priority, status, dueDate, assignees}), 
            headers: {'Content-Type': 'application/json'}
        })

        if(res.ok) {
            location.reload()
        } else {
            alert(res.statusText)
        }
    }
   

})


//figuer out bug when adding a task on the tack page 
//weiredness with assingges being added
//ex. adding only self to a project that has multiple collaborators