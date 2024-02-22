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
    }
}