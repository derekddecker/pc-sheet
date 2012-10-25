
$(function(){
    var TmplCache = {},
        horizontalCenter = Math.floor(window.innerWidth/2),
        verticalCenter = Math.floor(window.innerHeight/2),
        markdownConverter = new Markdown.getSanitizingConverter(),
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
                $_cloned_el = $_el.clone(), //clone the element
                maximizedHeight = .9,
                maximizedWidth = .9,
                fullSizeHeight = 0,
                fullSizeWidth = 0;

            //leave the actual element where it is, but visibility hidden
            $_el.css({"visibility":'hidden'})

            //find the elements current position, make it absolute
            $_cloned_el.data('original_el', $_el).bind('click',function(){ Minimize(this)}).css({"position":'absolute',"height":$_el.innerHeight(),"width":$_el.innerWidth(),"left":$_el.offset().left+'px',"top":$_el.offset().top+'px'});

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
        PrepareCard = (function(card){
            if(card.hasClass('at-will')) card.append(NewCardType('At-Will'))
            if(card.hasClass('encounter')) card.append(NewCardType('Encounter'))
            if(card.hasClass('utility')) card.append(NewCardType('Utility'))
            if(card.hasClass('daily')) card.append(NewCardType('Daily'))
        }),
        StackCards = (function(){
            $('.card-table-col').each(function(){
                var offset = 0;
                $(this).find('.card').each(function(){
                    $(this).css({'top':offset});
                    offset += 20;
                })
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
            'CardTable': (function(result){}),
            'Card': (function(result){
                result.bind('click',function(){ Maximize(this) })
                PrepareCard(result);

                var _description = result.find('.description'),
                    preConvertedMarkdown = _description.text();
                _description.empty().append(markdownConverter.makeHtml(preConvertedMarkdown));
            })
        },

        Layout = {
            "init" : (function(callback){
                RenderTemplate('CardTable', {}, function(result){
                    $('#wrapper').append(result)
                    callback();
                })
            })
        },

        AddCardToTable = (function(_power){
            RenderTemplate('Card', _power, function(result){
                $('#card-table').find('#'+PowerTypes.getCssClassForType(_power.Type)+'-powers').append(result)
            })
        }),

        Fixtures = {
            "init" : (function(){
                for(var i in CharacterSheet.Powers){
                    var _power = CharacterSheet.Powers[i];
                    AddCardToTable(_power);
                }
                StackCards();
            })
        },

        OnReady = (function(){
            Layout.init(Fixtures.init)
        })

    LoadTemplates(OnReady)
})