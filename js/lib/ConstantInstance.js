var ConstantInstance =  DataObject.extend({
    init : (function(int, options){
        this.ClassName = options.ClassName
        if(!isNaN(parseInt(int))){
            this.val = parseInt(int)
            this.text = Classes[parseInt(int)]
        }else{
            this.val = Classes[int]
            this.text = int
        }
    }),
    "toString" : (function(){
        return this.text;
    }),
    "each" : (function(){ return window[this.Constant].each() })
})