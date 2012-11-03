var PlayerUtil = {

    "ValidClasses" : ['Cleric','Fighter','Paladin','Ranger','Rogue','Warlock','Warlord','Wizard','Warden'],

    "ValidRaces" : ['Dragonborn','Dwarf','Eladrin','Elf','Half-Elf','Halfling','Human','Tiefling','Wilden','Goliath','Warforged'],

    "ExperienceToLevelMap" : {
        1 : 1000,
        2 : 2250,
        3 : 3750,
        4 : 5500,
        5 : 7500,
        6 : 10000,
        7 : 13000,
        8 : 16500,
        9 : 20500,
        10 : 26000,
        12 : 32000,
        13 : 39000,
        14 : 47000,
        15 : 57000,
        16 : 69000,
        17 : 83000,
        18 : 99000,
        19 : 119000,
        20 : 143000,
        21 : 175000,
        22 : 210000,
        23 : 255000,
        24 : 310000,
        25 : 375000,
        26 : 450000,
        27 : 550000,
        28 : 675000,
        29 : 825000,
        30 : 1000000
    },

    "CalculateLevel" : (function(exp){
        return (function(a){
            var lastExperience = 0,
                lastLevel = 0;
            for(var level in a.ExperienceToLevelMap){
                if(exp <= 0 || (exp > lastExperience && exp <= a.ExperienceToLevelMap[level]) || level == 30) return level;
                lastExperience = a.ExperienceToLevelMap[level];
                lastLevel = level;
            }
        })(this);
    })
};