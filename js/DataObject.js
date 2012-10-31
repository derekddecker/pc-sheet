var DataObject =  Class.extend({
    init : (function(hash){

        var defaults = $.extend({}, this.defaults);

        for(var i in defaults)
        {
            if(defaults[i] instanceof DataObject && !$.isArray( defaults[i] )) defaults[i] = $.extend({},defaults[i]); //make sure we get a unique instance.
            if(typeof this[i] == 'undefined')
            {
                switch(typeof defaults[i])
                {
                    case 'object':{
                        if($.isArray(defaults[i]))
                        {
                            this[i] = [];
                            if(typeof this['set'+i] !== 'undefined'){
                                this['set'+i](defaults[i]);
                            }else{
                                //Util.trace('Setting', i, defaults[i])
                                this[i] = defaults[i];
                            }
                        }
                        else this[i] = defaults[i];
                        break;
                    }
                    default:{
                        this[i] = defaults[i];
                        break;
                    }
                }
            }
        }

        for(var i in hash)
        {
            if(hash[i] instanceof DataObject && !$.isArray( hash[i] ))
                hash[i] = $.extend({},hash[i]); //make sure we get a unique instance.

            /**
             * // Try to guess nested object instantiation
             *
             * This makes it so we don't have to configure
             * each setter method for nested arrays of objects.
             *
             * For example, if a Chart instance has an array of People properties,
             * simply name the property 'Peoples' (note the 's' for primitive pluralization)
             * and ensure that you have a class name of People available. We will then assume
             * a JSON object literal coming in in a 'Peoples' property should be an instance of
             * a People class. This way we retain all expected method availability of that class
             * type.
             */
            if(typeof window[i.substr(0, i.length-1)] !== 'undefined' && (new window[i.substr(0, i.length-1)]) instanceof DataObject === true)
            {
                this[i] = []
                for(var j in hash[i])
                {
                    var nested_object = new window[i.substr(0, i.length-1)](hash[i][j])
                    this[i].push( nested_object )
                }
            }
            //declare all the instance variables
            else if(typeof this['set'+i] !== 'undefined'){
                this['set'+i](hash[i]);
            }else{
                this[i] = hash[i];
            }
        }
    }),
    addNestedObject : (function(object, propertyName, removeOn){

           // this.removeNestedObject(object, propertyName, removeOn); //remove if already set
            var keyExists = false;
            if(removeOn)
            {
                for(var obje in this[propertyName]){
                    if(this[propertyName][obje][removeOn] === object[removeOn]){
                        this[propertyName][obje] = object;
                        keyExists = true;
                        break;
                    }
                }
            }else{
                for(var obje in this[propertyName]){
                    if(this[propertyName][obje] === object){
                        this[propertyName][obje] = object;
                        keyExists = true;
                        break;
                    }
                }
            }

            //Util.trace(object, propertyName, this[propertyName]);
            if(!keyExists) this[propertyName].push(object);
    }),

    removeNestedObject : (function(object, propertyName, removeOn){
        var newArr = [];
        if(removeOn)
        {
            for(var obje in this[propertyName]){
                if(this[propertyName][obje][removeOn] !== object[removeOn]){
                    newArr.push( this[propertyName][obje] );
                }
            }
        }else{
            for(var obje in this[propertyName]){
                if(this[propertyName][obje] !== object){
                    newArr.push( this[propertyName][obje] );
                }
            }
        }
        this[propertyName] = newArr;
        return;
    }),

    stringify : (function(){
        return JSON.stringify(this);
    }),

    //this
    clone : (function(){
        return new window[this.ClassName]( JSON.parse( this.stringify() ) );
    }),

    changed : (function(){})
});