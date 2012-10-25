var PowerTypes = {
    "AtWill" : 1,
    "Encounter" : 2,
    "Utility" : 3,
    "Daily" : 4,

    "getCssClassForType" : (function(val){
        switch(val){
            case 1: return 'at-will'
            case 2: return 'encounter'
            case 3: return 'utility'
            case 4: return 'daily'
            default: return ''
        }
    })
}