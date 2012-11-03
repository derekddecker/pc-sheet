var ConditionUtil = {

    "PresetConditions" : [
        {
            "Name" : "Blinded",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You can\'t see any target (your targets have total concealment).</li><li>You take a -10 penalty to Perception checks.</li><li>You can\'t flank an enemy.</li></ul>'
        },
        {
            "Name" : "Dazed",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You can take either a standard action, a move action, or a minor action on your turn (you can also take free actions). You can\'t take immediate actions or opportunity actions.</li><li>You can\'t flank an enemy.</li></ul>'
        },
        {
            "Name" : "Deafened",
            "Effect" : '<ul><li>You can\'t hear anything.</li><li>You take a -10 penalty to Perception checks.</li></ul>'
        },
        {
            "Name" : "Dominated",
            "Effect" : '<ul><li>You\'re dazed.</li><li>The dominating creature chooses you aciton. The only powers it can make you use are at-will powers.</li></ul>'
        },
        {
            "Name" : "Dying",
            "Effect" : '<ul><li>You\'re unconscious.</li><li>You\'re at 0 or negative hit points.</li><li>You make a death saving throw every round.</li></ul>'
        },
        {
            "Name" : "Helpless",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You can be the target of a coup de grace. <em>Note:</em> Usually you\'re helpless because you\'re unconscious.</li></ul>'
        },
        {
            "Name" : "Hunter\'s Quarry",
            "Effect" : '<ul><li>Attacker who set the quarry gets 1D6 additional damage.</li></ul>'
        },
        {
            "Name" : "Immobilized",
            "Effect" : '<ul><li>You can\'t move from you space, although you can teleport and can be forced to move by a pull, a push, or a slide.</li></ul>'
        },
        {
            "Name" : "Marked",
            "SaveEnds" : false,
            "Duration" : 'Markee Dies or effect overriden by another Mark',
            "Effect" : '<ul><li>You take a -2 penalty to attack rolls for any attack that doesn\'t target the creature that marked you.</li></ul>'
        },
        {
            "Name" : "Petrified",
            "Effect" : '<ul><li>You have been turned to sonte.</li><li>You can\'t take actions.</li><li>You gain resist 20 to all damage.</li><li>You are unaware of your surroundings.</li><li>You don\'t age.</li></ul>'
        },
        {
            "Name" : "Poisoned",
            "SaveEnd" : true,
            "Effect" : '<ul><li>You take damage at the beginning of each turn.</li></ul>'
        },
        {
            "Name" : "Prone",
            "Effect" : '<ul><li>You grant combat advantage to enemies making melee attacks against you.</li><li>You get a +2 bonus to all defenses against ranged attacks from nonadjacent enemies.</li><li>You\'re lying on the ground. (If you\'re flying, you safely descend a distance equal to your fly speed. If you don\'t reach the ground, you fall.)</li><li>You take a -2 penalty to attack rolls.</li><li>You can drop prone as a minor action.</li></ul>'
        },
        {
            "Name" : "Restrained",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You\'re immobilized.</li><li>You can\'t be forced to move by a pull, a push, or a slide.</li><li>You take a -2 penalty to attack rolls.</li></ul>'
        },
        {
            "Name" : "Slowed",
            "Effect" : '<ul><li>Your speed becomes 2. This speed applies to all your movement modes, but it does not apply to teleportation or to a pull, a push, or a slide. You can\'t increase your speed above 2, and your speed doesn\'t increase if it was lower than 2. If you\'re slowed while moving, stop moving if you have already moved 2 or more squares.</li></ul>'
        },
        {
            "Name" : "Stunned",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You can\'t take actions.</li><li>You can\'t flank an enemy.</li></ul>'
        },
        {
            "Name" : "Surprised",
            "Effect" : '<ul><li>You grant combat advantage.</li><li>You can\'t take actions, other than free actions.</li><li>You can\'t flank an enemy.</li></ul>'
        },
        {
            "Name" : "Unconscious",
            "Effect" : '<ul><li>You\'re helpless.</li><li>You take a -5 penalty to all defenses.</li><li>You can\'t take actions.</li><li>You fall prone, if possible.</li><li>You can\'t flank an enemy.</li></ul>'
        },
        {
            "Name" : "Weakened",
            "Effect" : '<ul><li>Your attacks deal half damage. Ongoing damage you deal is not affected.</li></ul>'
        }
    ],

    "getConditionWithName" : (function(name){
        for(var c in this.PresetConditions)
        {
            if(this.PresetConditions[c].Name === name)
                return this.PresetConditions[c];
        }
        return false;
    })

};