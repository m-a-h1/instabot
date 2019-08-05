
module.exports = {
    
timePeriod: (date) => {
    if(date === undefined)
        return Number.POSITIVE_INFINITY
    var currentTime = new Date().getTime();
    var duration = currentTime - date;
    return duration /= (1000*60*60*24)
},

check: (item, list = []) => {
    var exist

    for(let i of list){
        if(list[i] === item){
            exist = true
            break
        }
    }
    return exist
},

isEmpty: (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

};
