var PowerTypes = new Constant({
        1 : "At-Will",
        2 : "Encounter",
        3 : "Utility",
        4 : "Daily"
    }),

    PowerType = ConstantInstance.extend({
        "init" : (function(int){
            this._super(int, {
                "ClassName" : 'PowerType',
                "Constant" : 'PowerTypes'
            })
        })
    })