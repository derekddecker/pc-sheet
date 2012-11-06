var ConstantInstance =  DataObject.extend({
    init : (function(hash){
        if(typeof hash !== 'undefined')
        {
            var int = (typeof hash === 'object') ? hash.val : hash
            if(!isNaN(parseInt(int))){
                this.val = parseInt(int)
                this.text = Classes[parseInt(int)]
            }else{
                this.val = Classes[int]
                this.text = int
            }
            this.toString = (function(){return this.text})
            this.each = (function(){ return window[this.Constant].each() })
            this._super(int)
        }
    })
})