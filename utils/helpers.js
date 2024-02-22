module.exports = {
    counter: (index) => {
        return index +1;
    }, 
    json: (content) => {
        return JSON.stringify(content)
    },
    toStringDate: (date) => {
        return new Date(date).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
    },
    firstInital: (obj) => {
        return obj.email.charAt(0).toUpperCase()
    }, 
    stringCompare: (string1, string2, options) => {
        if(string1 == string2){return options.fn(this)}
        return options.inverse(this)
    }, 
    findProjectName: (obj, taskId) => {
        console.log(obj)
        console.log(taskId)
        // obj.forEach(p => {
        //     p.tasks.forEach(t => {
        //         if(t._id === taskId){
        //             return p.title
        //         }
        //     })
        // })
    }
}