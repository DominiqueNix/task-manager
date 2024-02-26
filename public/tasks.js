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
let taskData = document.getElementById("progress-section").getAttribute('data-value')
let tasks = JSON.parse(taskData)
let completedTaskprogressbar = document.getElementById("task-complete")
let completedTaskprogressbarText = document.getElementById("task-c-text")

let comp = 0;
let total = tasks.length;

tasks.forEach( task => {
    if(task.status == "Complete"){
        comp+=1
    }
})


completedTaskprogressbar.setAttribute('style', `width: ${(comp/total || 0)*100}%`)
completedTaskprogressbarText.textContent = `${Math.round((comp/total || 0)*100)}% of tasks completed`

let projectData = document.getElementById("tasks-container").getAttribute('data-value')
let projects = JSON.parse(projectData);

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


let taskDeletebtns = document.getElementsByClassName('delete-task')

for(let i = 0; i < taskDeletebtns.length; i++){
    let currDeleteBtn = taskDeletebtns[i]
    let currId = currDeleteBtn.getAttribute('data-id')
    currDeleteBtn.addEventListener('click', () => {handleTaskDelete(currId)})
}

//update a task

//instead of passing id, pass project data, then just reuse code from dashbaord to get selected proejct and assgnees 
//for select values, just add selected = true for the corrent drop down defalut
//past through task data => then set then values for all component
const updateTaskProjectData = document.getElementById('update-task-assignees');

const updateTaskProjects = JSON.parse(updateTaskProjectData.getAttribute('data-value'))


let selectedTask;

let updateTaskBtns = document.getElementsByClassName('update-task')
console.log(updateTaskBtns)

for(let i = 0; i < updateTaskBtns.length; i++){
    let btn = updateTaskBtns[i]
    
    btn.addEventListener('click', () => {
        selectedTask = JSON.parse(btn.getAttribute('data-value'))
        let projcetAssociatedWithTask;
        //set defalut value fo form to selected task data
        // let updateTaskProjectId = selectedProject._id
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
        let projectDefalutforTask = document.getElementsByClassName('project-with-update-task')

        for(let i = 0; i < projectDefalutforTask.length; i++){
            if(projectDefalutforTask[i].value == projcetAssociatedWithTask._id){
                projectDefalutforTask[i].selected = true;
            }
        }

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

        // let updateDate = document.getElementById('datepicker2')

        // new Datepicker(updateDate, {
        //     autoclose: true,  
        //     todayHighlight: true, 
        //     todayBtn : "linked" 
        // })
        // .value.trim()
        // let status = document.getElementById('update-task-status').value.trim()
        // let dueDate = document.getElementById('update-due-date').value
        // let assignees = []
        // document.querySelectorAll(".task-checkbox:checked").forEach(node => assignees.push(node.value))
    })
}



