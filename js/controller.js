$(function(){
    var Debug = (function(){
            var enabled = true;

            return {
                enabled:enabled,
                init:(function(){
                    if(enabled){
                        Templates.render('Debug', null, function(result){
                            result.find('#debug-save-config').bind('click',DataStore.SaveConfig)
                            result.find('#debug-load-config').bind('click',DataStore.LoadConfig)
                            result.find('#debug-erase-config').bind('click',DataStore.EraseConfig)
                            $('body').append(result)
                        })
                    }
                })
            }
        })(),
        DataStore = (function(){

            var available = !(typeof(localStorage) == 'undefined'),
                localStorageName = 'pc-sheet',
                SaveConfig = (function(character_sheet){
                    if(!available) alert('Your browser does not support HTML5 localStorage. Try upgrading.');
                    else{
                        try {
                            localStorage.setItem(localStorageName, PCSHEET.stringify() );
                            alert('Successfully saved pc-sheet');
                        } catch (e) {
                            alert(e.message)
                        }
                    }
                }),
                LoadConfig = (function(){
                    try{
                        window.PCSHEET = new CharacterSheet(JSON.parse(localStorage.getItem(localStorageName)))
                        Layout.clear_and_init(Fixtures.init)
                    }catch(e){ alert(e.message) }
                }),
                EraseConfig = (function(){
                    try{  localStorage.removeItem(localStorageName); }catch(e){ alert(e.message) }
                    LoadConfig()
                })

            return {
                available: available,
                SaveConfig: SaveConfig,
                LoadConfig: LoadConfig,
                EraseConfig: EraseConfig
            }
        })(),
        horizontalCenter = Math.floor(window.innerWidth/2),
        verticalCenter = Math.floor(window.innerHeight/2),
        markdownConverter = new Markdown.getSanitizingConverter(),
        PowerCards = (function(){
            var Minimize = (function(what){
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

                    var _description = card.find('.description'),
                        preConvertedMarkdown = _description.text();
                    _description.empty().append(markdownConverter.makeHtml(preConvertedMarkdown));
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
                AddCardToTable = (function(_power){
                    Templates.render('Card', _power, function(result){
                        $('#card-table').find('#'+PowerTypes.getCssClassForType(_power.Type)+'-powers').append(result)
                    })
                })

            return {
                prepare: PrepareCard,
                stack: StackCards,
                add_to_table: AddCardToTable,
                maximize: Maximize,
                minimize: Minimize
            }
        })(),
        Templates = (function(){
            var TmplCache = {},
                Load =
                    (function(callback){
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

                        //bind the object to the top level element of the result
                        result.find('form.editable').find('.editable-field').data('obj', Object);

                        //make editable props editable
                        DataBinding.make_editable(result)

                        var postRenderCallback = TmplList[TemplateName]( result, Object, Params );
                        if(Callback) Callback( result, postRenderCallback );
                    }),
                    TmplList = {
                        'Debug': (function(result){}),
                        'CardTable': (function(result){}),
                        'Card': (function(result, cardObject){
                            result.bind('click',function(){ PowerCards.maximize(this) })
                            PowerCards.prepare(result);
                        })
                    }
            return {
                load: Load,
                render: RenderTemplate,
            }
        })(),
        DataBinding = (function(){

            var get_editable_element_properties = (function(el){

                    var original_element = $(el),
                        editable_object = original_element.data('obj'),
                        object_property_name = original_element.data('property') || $(original_element.data('previous-element')).data('property');

                    return {
                        "original_element" : original_element,
                        "editable_object" : editable_object,
                        "input_element" : '',
                        "input_type" : original_element.data('input-type') || original_element[0].tagName,
                        "object_property_name" : object_property_name || original_element.attr('name'),
                        "object_property_value" : original_element.val() || editable_object[object_property_name]
                    }
                }),
                make_element_editable = (function(el){

                    var el_props = get_editable_element_properties(el);

                    switch(el_props.input_type){
                        case 'textarea':
                            input_element = '<textarea>' + el_props.object_property_value + '</textarea>'
                            break;
                        case 'select':
                            input_element = '<select></select>'
                        default:
                            input_element = '<input name="' + el_props.object_property_name + '" type="'+ el_props.input_type +'" value="' + el_props.object_property_value + '"/>'
                            break;
                    }

                    var new_element = $(input_element).bind('click', function(e){e.stopPropagation()}).data('obj', $(el).data('obj'))

                    new_element.data('previous-element', el);

                    el_props.original_element.replaceWith(new_element)
                }),
                update_callbacks = {
                    "Power" : {
                        "Description" : (function(element){
                            //re-render the markdown
                            var _description = element,
                                preConvertedMarkdown = _description.text();
                            _description.empty().append(markdownConverter.makeHtml(preConvertedMarkdown));
                        })
                    }
                },
                restore_uneditable_state = (function(el){

                    var el_props = get_editable_element_properties(el),
                        uneditable_element = $(el_props.original_element.data('previous-element')).data('obj', $(el).data('obj') ).text(el_props.editable_object[el_props.object_property_name]);

                    $(el).replaceWith( uneditable_element );

                    //post update callback
                    if(typeof update_callbacks[el_props.editable_object.ClassName][el_props.object_property_name] === 'function')
                        update_callbacks[el_props.editable_object.ClassName][el_props.object_property_name](uneditable_element)

                }),
                edit_button = '<div class="edit-control"><a href="javascript:;"><img src="assets/images/edit_icon.gif" /></a></div>',
                properties_updated = (function(){
                    event.stopPropagation();
                    var objects_to_trigger_change_on = [],
                        parent_form = $(this).parents('form.editable:first');

                    parent_form.find('input,select,textarea').each(function(){
                        var el_props = get_editable_element_properties(this),
                            original_object = el_props.editable_object,
                            add_to_change_list = true,
                            property_changed = false;

                        if(original_object.hasOwnProperty(el_props.object_property_name))
                        {
                            if(original_object[el_props.object_property_name] !== el_props.object_property_value)
                            {
                                original_object[el_props.object_property_name] = el_props.object_property_value;
                                property_changed = true;
                            }
                        }

                        if(property_changed)
                        {
                            for(var i in objects_to_trigger_change_on)
                            {
                                if(objects_to_trigger_change_on[i] === original_object)
                                {
                                    add_to_change_list = false;
                                }
                            }
                            if(add_to_change_list)
                            {
                                objects_to_trigger_change_on.push(original_object)
                            }
                        }
                        restore_uneditable_state(this)
                    })
                    for(var i in objects_to_trigger_change_on){
                        if(typeof objects_to_trigger_change_on[i].changed === 'function')
                            objects_to_trigger_change_on[i].changed();
                    }

                    parent_form.find('button.update').remove();
                    make_editable(parent_form)

                }),
                update_button = $('<button class="update">Update</button>').bind('click', properties_updated),
                edit_button_clicked = (function(event){
                    event.stopPropagation();

                    $(this).hide().parents('form.editable:first').append(update_button.clone(true)).find('.editable-field').each(function(){
                        make_element_editable(this);
                    })
                }),
                add_edit_button = (function(el){
                    var pencil_icon = $(edit_button).bind('click', edit_button_clicked)
                    $(el).append(pencil_icon)
                }),
                make_editable = (function($el){
                    var editables = $el.find('form.editable');

                    if($el.hasClass('editable') && $el[0].tagName == 'FORM') editables.push($el)

                    editables.each(function(){
                        $(this).bind('submit', function(event){ event.preventDefault(); })
                        add_edit_button(this)
                    })
                })

             return {
                 "make_editable" : make_editable
             }
        })(),
        Layout = (function(){
            var body = $('body'),
                init = (function(callback){
                            prepareBackground()
                            body.append('<div id="wrapper"></div>');
                            Templates.render('CardTable', {}, function(result){
                                $('#wrapper').append(result)
                                callback();
                            })
                            Debug.init()
                        }),
                prepareBackground = (function(){
                    body.append('<div id="background"><img src="assets/images/7820parchment.jpg" class="stretch" alt="" /></div>')
                })

            return {
                "init" : init,
                "clear_and_init": (function(callback){
                    $('body').empty()
                    init(callback)
                })
            }
        })(),
        Fixtures = {
            "init" : (function(){
                for(var i in PCSHEET.Powers){
                    var _power = PCSHEET.Powers[i];
                    PowerCards.add_to_table(_power);
                }
                PowerCards.stack();
            })
        },
        LayoutReadyCallback = (function(){
            Fixtures.init()
        }),
        OnReady = (function(){
            Layout.init(LayoutReadyCallback)
        })

    Templates.load(OnReady)
})