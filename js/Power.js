var Power = DataObject.extend({
    init : (function(hash){
        this._super( hash );
        this.ClassName = 'Power';
    }),
    defaults:{
        "Name" : 'Power',
        "Description" : '',
        "Type" : PowerTypes['At-Will']
    },
    changed: (function(){
        Util.trace(this, ' CHANGED!')
    })
});