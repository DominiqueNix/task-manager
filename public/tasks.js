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

