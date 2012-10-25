
$(function(){
    var TmplCache = {},
        horizontalCenter = Math.floor(window.innerWidth/2),
        verticalCenter = Math.floor(window.innerHeight/2),
        Minimize = (function(what){
            var $_full_screen_el = $(what),
                $_original_el = $_full_screen_el.data('original_el');

            //shrink down to original size and to center of screen
            $_full_screen_el.animate({ "height":$_original_el.innerHeight(), "width":$_original_el.innerWidth(), "top":(verticalCenter-($_original_el.innerHeight()/2))+'px', "left":(horizontalCenter-($_original_el.innerWidth()/2))+'px' }).removeClass('fullscreen')

            //move it back into it's original position
            $_full_screen_el.animate({"position":'absolute',"left":$_original_el.offset().left+'px',"top":$_original_el.offset().top+'px'}, function(){

                //make the original element visible
                $_original_el.css({"visibility":'visible'})

                //remove the full screen element
                $_full_screen_el.remove()

            })
        }),
        Maximize = (function(what){
            var $_el = $(what), //cache the element
                $_cloned_el = $_el.clone(),
                maximizedHeight = .9,
                maximizedWidth = .9,
                fullSizeHeight = 0,
                fullSizeWidth = 0; //clone the element

            //leave the actual element where it is, but visibility hidden
            $_el.css({"visibility":'hidden'})

            //find the elements current position, make it absolute
            $_cloned_el.data('original_el', $_el).bind('click',function(){ Minimize(this)}).css({"position":'absolute',"left":$_el.offset().left+'px',"top":$_el.offset().top+'px', "margin":0});

            //append the cloned element to the page
            $('body').append($_cloned_el)

            //let's move the card to the absolute center of the screen
            $_cloned_el.animate({"top":(verticalCenter-($_el.innerHeight()/2))+'px', "left":(horizontalCenter-($_el.innerWidth()/2))+'px'},function(){
                $(this).addClass('fullscreen')

                //calculate dimensions based on screen size and border etc
                fullSizeHeight = parseFloat((window.innerHeight*maximizedHeight)-(parseFloat($_cloned_el.css('border-top-width'))+parseFloat($_cloned_el.css('border-bottom-width'))))+'px';
                fullSizeWidth = parseFloat((window.innerWidth*maximizedWidth)-(parseFloat($_cloned_el.css('border-left-width'))+parseFloat($_cloned_el.css('border-right-width'))))+'px';

                $_cloned_el.animate({ "height":fullSizeHeight, "width":fullSizeWidth, "top": ((window.innerHeight-(window.innerHeight*maximizedHeight))/2)+'px', "left": ((window.innerWidth-(window.innerWidth*maximizedWidth))/2)+'px' })
            })

        }),
        NewCardType = (function(cardType){
            return $('<div class="card-type-subtext">'+cardType+' Power</div>')
        }),
        PrepareCards = (function(){
            $('.card').each(function(){
                var card = $(this)
                if(card.hasClass('at-will')) card.append(NewCardType('At-Will'))
                if(card.hasClass('encounter')) card.append(NewCardType('Encounter'))
                if(card.hasClass('utility')) card.append(NewCardType('Utility'))
                if(card.hasClass('daily')) card.append(NewCardType('Daily'))
            })
        }),

        LoadTemplates = (function(callback){
            $.each(TmplList, function(i){
                var ct = i;

                $.ajax({
                    url:'jqtmpl/'+ct+'.tmpl.html',
                    cache:false,
                    type:'GET',
                    success:function(template){
                        $('head').append('<script type="text/x-jquery-tmpl" id="'+ct+'">'+template+'</script>');
                        TmplCache[ ct ] = template;
                        if(Util.GetObjectSize(TmplList) === Util.GetObjectSize(TmplCache)) callback();
                    }
                })
            })
        }),
        /**
         * @param string TemplateName
         * @param object Object
         * @param function Callback
         */
        RenderTemplate = (function(TemplateName, Object, Callback, Params){
            var result = $.tmpl(TmplCache[ TemplateName ], Object);
            var postRenderCallback = TmplList[TemplateName]( result, Object, Params );
            if(Callback) Callback( result, postRenderCallback );
        }),

        TmplList = {
            'Card': (function(result){

            })
        },

        OnReady = (function(){
            $('.card').bind('click',function(){ Maximize(this) })
            PrepareCards()

            var converter = new Markdown.getSanitizingConverter();

            $('.markdown').each(function(){
                var $_el = $(this),
                    preConvertedMarkdown = $(this).text();

                $_el.empty().append(converter.makeHtml(preConvertedMarkdown));
            })
        })

    LoadTemplates(OnReady)
})