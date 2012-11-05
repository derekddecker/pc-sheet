var Classes = {
    options : {
        0:'Cleric',
        1:'Fighter',
        2:'Paladin',
        3:'Ranger',
        4:'Rogue',
        5:'Warlock',
        6:'Warlord',
        7:'Wizard',
        8:'Warden'
    },
    "each" : (function(){
        var r = []
        for(var i in Classes.options){ r.push({"text":Classes.options[i],"val":i}) }
        return r;
    })
},

    Class = DataObject.extend({

        "init" : (function(int){
            if(!isNaN(parseInt(int))){
                this.val = int
                this.text = Classes[int]
            }else{
                this.val = Classes[int]
                this.text = int
            }
        }),
        "toString" : (function(){
            return this.text;
        }),
        "getCssClassForType" : (function(val){
            return (options[val]) ? options[val].toLowerCase() : '';
        })

})