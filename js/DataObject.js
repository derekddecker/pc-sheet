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

             //declare all the instance variables
            if(typeof this['set'+i] !== 'undefined'){
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
    })
});