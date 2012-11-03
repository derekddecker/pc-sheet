var Defense = DataObject.extend({

    init: (function(hash){
        this._super( hash );
    }),

    defaults: {
        "Name" : 'AC',
        "Score" : 0,
        "TenPlusHalf" : 0,
        "ArmorAbilityBonus" : 0,
        "ClassBonus" : 0,
        "FeatBonus" : 0,
        "Enh" : 0,
        "Misc" : [
            {
                "Score":0,
                "LinkType":'',
                "LinkId":null
            }
        ]
    },

    setName : (function(def){ if($.inArray(def,DefenseUtil.ValidDefenses) !== -1) this.Name = def; }),

    getTotalMisc : (function(){
        var rtn = 0;
        for(var i in this.Misc)
            rtn += parseInt(this.Misc[i].Score);
        return rtn;
    })

});