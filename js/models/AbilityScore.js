var AbilityScore = DataObject.extend({
    init : (function(hash){
        this._super( hash );
    }),
    defaults : {
        "Score" : 0,
        "BaseScore" : 0,
        "Ability" : 'Strength',
        "Modifier" : 0,
        "ModifierPlusHalfLevel" : 0
    },
    "CalculateScore" : (function(){
        this.Score = parseInt(this.BaseScore) + parseInt(this.ModifierPlusHalfLevel);
    }),

    "setAbility" : (function(abil){ if($.inArray(abil,AbilityScoreUtil.ValidAbilities) !== -1) this.Ability = abil; })
});