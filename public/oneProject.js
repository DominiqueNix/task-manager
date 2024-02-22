let priority = document.getElementsByClassName('priority')
let statuss = document.getElementsByClassName('status')
console.log(priority)

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

let taskData = document.getElementById('progress-section').getAttribute('data-value');
let allProjectTasks = JSON.parse(taskData);

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

