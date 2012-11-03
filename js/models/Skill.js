var Skill = DataObject.extend({
    init: (function(hash){
        this._super( hash );
    }),
    defaults: {
        "Bonus" : 0,
        "SkillName" : 'Acrobatics',
        "ModifierPlusHalfLevel" : 0,
        "Trained" : false,
        "ArmorPenalty" : 0,
        "Misc" : 0
    },

    isValidSkill : (function(){ return this.SkillName !== ''; }),

    setSkillName : (function(skillname){
        if($.inArray(skillname, SkillUtil.ValidSkillNames) !== -1) this.SkillName = skillname;
        else Util.trace('Invalid Skill Name '+skillname)
    })
});