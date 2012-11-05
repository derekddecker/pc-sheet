var Constant =  DataObject.extend({
    init : (function(options){
        this.options = {}
        for(var i in options){ this[options[i]] = i; this[i] = options[i]; this.options[i] = options[i] }
        this._super( options );
    }),
    "getCssClassForType" : (function(val){
        return (this.options[val]) ? this.options[val].toLowerCase() : '';
    }),
    "each" : (function(){
        var r = []
        for(var i in this.options){ r.push({"text":this.options[i],"val":i}) }
        return r;
    })
})