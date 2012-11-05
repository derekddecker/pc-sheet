(function(d){

    var script_list = [],
    add_js_to_load = (function(path){
        var script_el = d.createElement('script');

        script_el.setAttribute('type','text/javascript')
        script_el.setAttribute('src','js/' + path + '?q=' + Date())

        script_list.push( script_el )
    }),
    clear_load_list = (function(){ script_list = [] }),
    load_js = (function(){
        if(script_list.length > 0){
            var script_to_load = script_list[0]
            script_to_load.onload = function(){ load_js(this) }
            script_to_load.onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    load_js();
                }
            }
            d.getElementsByTagName('head')[0].appendChild( script_to_load )
            script_list.shift()
        }
    }),
    load_dists = (function(){
        var dist = [
            'dist/jquery/jquery.1.8.0.min.js',
            'dist/jquery/jquery.tmpl.min.js',

            'dist/pagedown/Markdown.Converter.js',
            'dist/pagedown/Markdown.Sanitizer.js'
        ]
        for(var i in dist) add_js_to_load( dist[i] )
    }),
    load_libs = (function(){
        var lib = [
            'lib/JSON.js',
            'lib/Class.js',
            'lib/DataObject.js'
        ]
        for(var i in lib) add_js_to_load( lib[i] )
    }),
    load_models = (function(){
        var model = [
            'models/constants/PowerTypes.js',
            'models/constants/Classes.js',
            'models/AbilityScore.js',
            'models/Defense.js',
            'models/Skill.js',
            'models/Condition.js',
            'models/Player.js',
            'models/CharacterSheet.js',
            'models/Power.js'
        ]
        for(var i in model) add_js_to_load( model[i] )
    }),
    load_utils = (function(){
        var util = [
            'util/AbilityScoreUtil.js',
            'util/ConditionUtil.js',
            'util/DefenseUtil.js',
            'util/PlayerUtil.js',
            'util/SkillUtil.js',
            'util/Util.js',
        ]
        for(var i in util) add_js_to_load( util[i] )
    });

    /**
     * Load dist files
     */
    load_dists();

    /**
     * Load lib files
     */
    load_libs();

    /**
     * Load utility files
     */
    load_utils();

    /**
     * Load model files
     */
    load_models();

    /**
     * Load fixtures
     */
    add_js_to_load('Fixtures.js');

    /**
     * Load controller and start this up!
     */
    add_js_to_load('controller.js');

    load_js();

})(document)