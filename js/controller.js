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
                    $_marker_el = $_full_screen_el.data('marker');

                //shrink down to original size and to center of screen
                $_full_screen_el.animate({ "height":$_marker_el.innerHeight(), "width":$_marker_el.innerWidth(), "top":(verticalCenter-($_marker_el.innerHeight()/2))+'px', "left":(horizontalCenter-($_marker_el.innerWidth()/2))+'px' }, function(){
                    $(this).removeClass('fullscreen').unbind('click').bind('click', function(){Maximize(this)})
                    //move it back into it's original position
                    $_full_screen_el.animate({"position":'absolute',"left":$_marker_el.offset().left+'px',"top":$_marker_el.offset().top+'px'}, (function(){
                        //remove the marker
                        $_marker_el.replaceWith($_full_screen_el.attr('style',$_marker_el.attr('style')).css('visibility','visible'))
                    }))
                })

            }),
            Maximize = (function(what){
                var $_el = $(what), //cache the element
                    $_cloned_el = $_el.clone(true), //deep clone the element
                    maximizedHeight = .9,
                    maximizedWidth = .9,
                    fullSizeHeight = 0,
                    fullSizeWidth = 0,
                    $_marker = $_el.clone().css('visibility','hidden');

                //find the elements current position, make it absolute
                $_el.unbind('click').bind('click',function(){ Minimize(this)}).css({"position":'absolute',"height":$_el.innerHeight(),"width":$_el.innerWidth(),"left":$_el.offset().left+'px',"top":$_el.offset().top+'px'});

                //leave a marker element so we can return to this position
                $_el.after($_marker).data('marker',$_marker)

                //append the cloned element to the page
                $('body').append($_el)

                //let's move the card to the absolute center of the screen
                $_el.animate({"top":(verticalCenter-($_el.innerHeight()/2))+'px', "left":(horizontalCenter-($_el.innerWidth()/2))+'px'},function(){
                    $(this).addClass('fullscreen')

                    //calculate dimensions based on screen size and border etc
                    fullSizeHeight = parseFloat((window.innerHeight*maximizedHeight)-(parseFloat($_el.css('border-top-width'))+parseFloat($_el.css('border-bottom-width'))))+'px';
                    fullSizeWidth = parseFloat((window.innerWidth*maximizedWidth)-(parseFloat($_el.css('border-left-width'))+parseFloat($_el.css('border-right-width'))))+'px';

                    $_el.animate({ "height":fullSizeHeight, "width":fullSizeWidth, "top": ((window.innerHeight-(window.innerHeight*maximizedHeight))/2)+'px', "left": ((window.innerWidth-(window.innerWidth*maximizedWidth))/2)+'px' })
                })

            }),
            PrepareCard = (function(card){
                var _description = card.find('.description'),
                    preConvertedMarkdown = _description.text(),
                    cardType = card.find('.card-type-subtext'),
                    cardTypeClass = PowerTypes.getCssClassForType(cardType.text());

                _description.empty().append(markdownConverter.makeHtml(preConvertedMarkdown));

                cardType.text(cardTypeClass + " Power")

                //remove any power type classes, as we could be changing powertype
                for(var i in PowerTypes.each()){
                    card.removeClass( PowerTypes.getCssClassForType( PowerTypes[PowerTypes.each()[i].val] ) )
                }
                card.addClass('card ' + cardTypeClass)
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
                    'Card': (function(result){
                        result.bind('click',function(){ PowerCards.maximize(this) })
                        PowerCards.prepare(result);
                    })
                }
            return {
                load: Load,
                render: RenderTemplate
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
                        "select_options_constant" :original_element.data('options'),
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
                            var input_element = '<textarea>' + el_props.object_property_value + '</textarea>'
                            break;
                        case 'select':
                            var input_element = '<select>',
                                options = window[el_props.select_options_constant].each();
                            for(var i in options)
                            {
                                var option = options[i],
                                    selected = (option.val == el_props.object_property_value) ? 'selected' : ''
                                input_element += '<option value="'+option.val+'" '+selected+'>'+option.text+'</option>'
                            }
                            input_element += '</select>'
                            break;
                        default:
                            var input_element = '<input name="' + el_props.object_property_name + '" type="'+ el_props.input_type +'" value="' + el_props.object_property_value + '"/>'
                            break;
                    }

                    var new_element = $(input_element).bind('click', function(e){e.stopPropagation()}).data('obj', $(el).data('obj'))

                    new_element.data('previous-element', el);

                    el_props.original_element.replaceWith(new_element)
                }),
                update_callbacks = {
                    "Power" : {
                        "all" : (function(element){
                            PowerCards.prepare(element.parents('.card:first'))
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
                properties_updated = (function(event){
                    event.stopPropagation();
                    var objects_to_trigger_change_on = [],
                        all_objects_checked = [],
                        parent_form = $(this).parents('form.editable:first');

                    parent_form.find('input,select,textarea').each(function(){
                        var el_props = get_editable_element_properties(this),
                            original_object = el_props.editable_object,
                            add_to_change_list = true,
                            property_changed = false,
                            add_to_object_list = true;

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
                        for(var i in all_objects_checked)
                        {
                            if(all_objects_checked[i] === original_object)
                            {
                                add_to_object_list = false;
                            }
                        }
                        if(add_to_object_list)
                        {
                            all_objects_checked.push(original_object)
                        }
                        restore_uneditable_state(this)

                    })
                    for(var i in objects_to_trigger_change_on){
                        if(typeof objects_to_trigger_change_on[i].changed === 'function')
                            objects_to_trigger_change_on[i].changed();
                    }
                    for(var i in all_objects_checked){
                        if(typeof update_callbacks[all_objects_checked[i].ClassName]['all'] === 'function'){
                            update_callbacks[all_objects_checked[i].ClassName]['all']($(this))
                        }
                    }

                    parent_form.find('button.update').remove();
                    make_editable(parent_form)
                    parent_form.find('.edit-control').show()

                }),
                update_button = $('<button class="update">Update</button>').bind('click', properties_updated),
                edit_button_clicked = (function(event){
                    event.stopPropagation();

                    Util.trace('Edit button clicked!')

                    $(this).hide().parents('form.editable:first').append(update_button.clone(true)).find('.editable-field').each(function(){
                        make_element_editable(this);
                    })
                }),
                add_edit_button = (function(el){
                    if($(el).find('.edit-control').length === 0)
                    {
                        var pencil_icon = $(edit_button).bind('click', edit_button_clicked)
                        $(el).append(pencil_icon)
                    }
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