var CharacterSheet = DataObject.extend({

    init: (function(hash){
        this._super( hash );
        this.ClassName = 'CharacterSheet';
    }),
    defaults: {
        "Powers" : []
    },
    changed: (function(){
        Util.trace(this)
    })

});