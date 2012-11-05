var Player = DataObject.extend({

    init : (function(hash){
        this._super( hash );
        this.ClassName = 'Player';
        this.changed();
    }),

    defaults : {
        "RealName" : '',

        "CharacterName" : '',

        "Level" : 0,

        "Conditions" : [],

        "ParagonPath" : '',

        "EpicDestiny" : '',

        "Deity" : '',

        "HP" : 0,

        "MaxHP" : 0,

        "Class" : new Class('Warlord'),

        "Race" : 'Dragonborn',

        "Experience" : 0,

        "Size" : 0,

        "Age" : 0,

        "Gender" : 0,

        "Height" : 0,

        "Weight" : 0,

        "Alignment" : 0,

        "Diety" : 0,

        "Party" : 0,

        "Initiative" : 0,

        "Defenses" : [
            new Defense({"Name":'AC'}),
            new Defense({"Name":'FORT'}),
            new Defense({"Name":'REF'}),
            new Defense({"Name":'WILL'})
        ],

        "Skills" : [
            new Skill({"SkillName":'Acrobatics'}),
            new Skill({"SkillName":'Arcana'}),
            new Skill({"SkillName":'Athletics'}),
            new Skill({"SkillName":'Bluff'}),
            new Skill({"SkillName":'Diplomacy'}),
            new Skill({"SkillName":'Dungeoneering'}),
            new Skill({"SkillName":'Endurance'}),
            new Skill({"SkillName":'Heal'}),
            new Skill({"SkillName":'History'}),
            new Skill({"SkillName":'Insight'}),
            new Skill({"SkillName":'Intimidate'}),
            new Skill({"SkillName":'Nature'}),
            new Skill({"SkillName":'Perception'}),
            new Skill({"SkillName":'Religion'}),
            new Skill({"SkillName":'Stealth'}),
            new Skill({"SkillName":'Streetwise'}),
            new Skill({"SkillName":'Thievery'})
        ],

        "AbilityScores" : [
            new AbilityScore({"Ability":"Strength"}),
            new AbilityScore({"Ability":"Constitution"}),
            new AbilityScore({"Ability":"Dexterity"}),
            new AbilityScore({"Ability":"Intelligence"}),
            new AbilityScore({"Ability":"Wisdom"}),
            new AbilityScore({"Ability":"Charisma"})
        ],

        "PassivePerception" : 0,

        "PassiveInsight" : 0
    },

    "CalculateInitiative" : (function(){
        this.Initiative.Score =
            parseInt(this.getAbilityScoreWithName('Dexterity').Modifier) +
            parseInt(this.getHalfLevel()) +
            parseInt(this.Initiative.Misc);
       // Util.trace('Calculating initiative for',this,
       //     this.getAbilityScoreWithName('Dexterity').Modifier + ' + ' + this.getHalfLevel() + ' + ' + this.Initiative.Misc + ' = ' + this.Initiative.Score);
    }),

    "CalculateAbilityScore" : (function(){
       Util.trace('Recalculating ability scores.',this);
        for(var ability in this.AbilityScores){
            this.AbilityScores[ability].ModifierPlusHalfLevel = parseInt(this.AbilityScores[ability].Modifier)+parseInt(this.getHalfLevel());
            this.AbilityScores[ability].CalculateScore();
        }
    }),

    "CalculateSkills" : (function(){
        for(var CurrentSkill in this.Skills){
            var skill = this.Skills[CurrentSkill],
                total = 0;

            if(skill.Trained) total += 5;
            total += parseInt(skill.ArmorPenalty);
            total += parseInt(skill.Misc);

            if(this.getAbilityScoreWithName( SkillUtil.SkillAbilityMap[skill.SkillName] ) !== false)
                skill.ModifierPlusHalfLevel = this.getAbilityScoreWithName( SkillUtil.SkillAbilityMap[skill.SkillName] ).ModifierPlusHalfLevel;

            skill.Bonus = total + parseInt(skill.ModifierPlusHalfLevel);
        }
        return true;
    }),

    "changed" : (function(){
        this.Level = PlayerUtil.CalculateLevel(this.Experience);
        this.CalculateAbilityScore();
        this.CalculateSkills();
        this.CalculateDefenses();
        this.CalculateInitiative();
    }),

    "CalculateDefenses" : (function(){
        for(var defense in this.Defenses){
            var defense = this.Defenses[defense];
            defense.TenPlusHalf = parseInt(this.getHalfLevel()) + 10;

            switch(defense.Name.toLowerCase()){
                case 'fort':{
                    if(this.getAbilityScoreWithName('Strength').Modifier >= this.getAbilityScoreWithName('Constitution').Modifier)
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Strength').Modifier;
                    else
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Constitution').Modifier;
                    break;
                }
                case 'ref':{
                    if(this.getAbilityScoreWithName('Dexterity').Modifier >= this.getAbilityScoreWithName('Intelligence').Modifier)
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Dexterity').Modifier;
                    else
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Intelligence').Modifier;
                    break;
                }
                case 'will':{
                    if(this.getAbilityScoreWithName('Wisdom').Modifier >= this.getAbilityScoreWithName('Charisma').Modifier)
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Wisdom').Modifier;
                    else
                        defense.ArmorAbilityBonus = this.getAbilityScoreWithName('Charisma').Modifier;
                    break;
                }
            }
            defense.Score = parseInt(defense.TenPlusHalf) +
                parseInt(defense.ArmorAbilityBonus) +
                parseInt(defense.ClassBonus) +
                parseInt(defense.FeatBonus) +
                parseInt(defense.Enh) +
                parseInt(defense.getTotalMisc());
        }
    }),

//    "addDefense" : (function(obj){
//        var o = (obj instanceof window.Defense) ?
//            obj : (typeof obj === 'object') ? new window.Defense(obj) : false;
//
//        if(o) this.addNestedObject(o, 'Defenses', 'Name');
//        return this;
//    }),
//
//    "setDefenses" : (function(array){
//        for(var i in array){
//            this.addDefense( array[i] );
//        }
//    }),

//    "addAbilityScore" : (function(obj){
//        var o = (obj instanceof window.AbilityScore) ?
//            obj : (obj.hasOwnProperty('Ability')) ? new window.AbilityScore(obj) : false;
//
//        if(o)this.addNestedObject(o, 'AbilityScores', 'Ability');
//        return this;
//    }),
//
//    "setAbilityScores" : (function(array){
//        for(var i in array){
//            this.addAbilityScore( array[i] );
//        }
//    }),

//    "setSkills" : (function(array){
//        for(var i in array){
//            this.addSkill( array[i] );
//        }
//    }),
//
//    "addSkill" : (function(obj){
//        var o = (obj instanceof window.Skill) ?
//            obj : (typeof obj === 'object') ? new window.Skill(obj) : false;
//       // Util.trace(obj)
//        if(o) this.addNestedObject(o, 'Skills', 'SkillName');
//        return this;
//    }),
//
//    "setClass":(function(classs){
//        if($.inArray(classs, PlayerUtil.ValidClasses) !== -1) this.Class = classs;
//        else Util.trace('Invalid Class '+classs)
//    }),
//
//    "setRace": (function(race){
//        if($.inArray(race, PlayerUtil.ValidRaces) !== -1) this.Race = race;
//        else Util.trace('Invalid Race '+race)
//    }),

    "getHalfLevel" : (function(){ return Math.floor(this.Level/2); }),

    "getAbilityScoreWithName" : (function(name){
        for(var Ability in this.AbilityScores)
            if(this.AbilityScores[Ability].Ability == name)
                return this.AbilityScores[Ability];
        return false;
    }),

    "getSkillWithName" : (function(name){
        for(var Skill in this.Skills)
            if(this.Skills[Skill].SkillName == name)
                return this.Skills[Skill];
        return false;
    }),

    "toString" : (function(){
        return this.CharacterName;
    })

});