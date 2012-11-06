var Player = DataObject.extend({

    init : (function(hash){
        this.ClassName = 'Player';
        Util.trace('here',this)
        this._super( hash );
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

        "CharacterClass" : 'Warlord',

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
            {"Name":'AC'},
            {"Name":'FORT'},
            {"Name":'REF'},
            {"Name":'WILL'}
        ],

        "Skills" : [
            {"SkillName":'Acrobatics'},
            {"SkillName":'Arcana'},
            {"SkillName":'Athletics'},
            {"SkillName":'Bluff'},
            {"SkillName":'Diplomacy'},
            {"SkillName":'Dungeoneering'},
            {"SkillName":'Endurance'},
            {"SkillName":'Heal'},
            {"SkillName":'History'},
            {"SkillName":'Insight'},
            {"SkillName":'Intimidate'},
            {"SkillName":'Nature'},
            {"SkillName":'Perception'},
            {"SkillName":'Religion'},
            {"SkillName":'Stealth'},
            {"SkillName":'Streetwise'},
            {"SkillName":'Thievery'}
        ],

        "AbilityScores" : [
            {"Ability":"Strength"},
            {"Ability":"Constitution"},
            {"Ability":"Dexterity"},
            {"Ability":"Intelligence"},
            {"Ability":"Wisdom"},
            {"Ability":"Charisma"}
        ],

        "PassivePerception" : 0,

        "PassiveInsight" : 0,

        "Gold" : '',

        "MagicItems" : '', //string for now

         "OtherEquipment" : '' //string for now
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