var Util = (function(){

    return {

        debug : true,

        trace : (function(){
            if("console" in window && this.debug) console.log(arguments);
        }),

        GetHashFromSerializedArray: (function(data){
            var hash = {};
            for(var i in data){
                hash[data[i].name] = data[i].value;
            }
            return hash;
        }),

        'Validate' : {
            'Numeric' : (function(val){
                return !isNaN( parseInt(val) );
            }),
            'PositiveNumber' : (function(val){
                if(!this.Numeric(val)) return false;
                if(parseInt(val) <= 0) return false;
                return true;
            })
        },

        'GetObjectSize': (function(obj){
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }),

        GetPropertyFromChain: (function(obj, chainString){
            if(chainString)
            {
                var chain = chainString.split('.'), result = obj;
                for(var i in chain){
                    result = (typeof chain[i] === 'function') ? result[chain[i]]() : result[chain[i]];
                }
                return result;
            }
            return obj;
        }),

        'joinOnProperty' : (function(delimiter, array, property){
            var arr = [];
            for(var i in array){
                arr.push( Util.GetPropertyFromChain(array[i], property) );
            }
            return arr.join(delimiter);
        })

    }

})();