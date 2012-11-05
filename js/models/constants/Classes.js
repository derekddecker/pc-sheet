var Classes = new Constant({
        0:'Cleric',
        1:'Fighter',
        2:'Paladin',
        3:'Ranger',
        4:'Rogue',
        5:'Warlock',
        6:'Warlord',
        7:'Wizard',
        8:'Warden'
    }),

    CharacterClass = ConstantInstance.extend({
        "init" : (function(int){
            this._super(int, {
                "ClassName" : 'CharacterClass',
                "Constant" : 'Classes'
            })
        })
    })