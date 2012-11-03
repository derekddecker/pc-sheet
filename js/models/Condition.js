var Condition = DataObject.extend({
    init : (function(hash){
        this._super( hash );
    }),
    defaults:{
        "Name" : '',
        "Effect" : '',
        "Duration" : [],
        "CastBy" : {}, //CastBy is the person that set the effect
        "SaveEnds" : false,
        "Ongoing" : false,
        "Sustainable" : false
    }
});