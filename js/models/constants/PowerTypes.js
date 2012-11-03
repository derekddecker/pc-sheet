var PowerTypes = (function(){

    var options = {
        1 : "At-Will",
        2 : "Encounter",
        3 : "Utility",
        4 : "Daily"
    }

    var ret = {}
    for(var i in options){ ret[options[i]] = i }
    ret["getCssClassForType"] = (function(val){
        return (options[val]) ? options[val].toLowerCase() : '';
    })
    ret["each"] = (function(){
        var r = []
        for(var i in options){ r.push({"text":options[i],"val":i}) }
        return r;
    })
    Util.trace(ret)
    return ret;
})()