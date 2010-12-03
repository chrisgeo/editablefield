//TODO: expand area to fit width of object
//TODO: support select/option
//TODO: \r|\n|\r|\n-> <br />
//TODO: checkbox == wikimarkup?
YUI.add('editable-field', function(Y){
    var _EDIT_CLASS = 'yui3-editable-field',
    STATE = 'state',
    STATES = {
        editing: 'editing',
        editable: 'editable'
    },
    editableField = null,
    TEMPLATES = {
        text: '<input name="{name}"  type="text" class="{classes}" value="{value}" />',
        textarea: '<textarea class="{classes}">{value}</textarea>',
        option: '<option value="{value}">{display_value}</option>',
        select: '<select name="{name}" class="{classes}">{options}</select>',
        radio: '<input name="{name}"  type="radio" class="{classes}" value="{value}" />',
        checkbox: '<input name="{name}" type="checkbox" class="{classes}" value="{value}" />'
    },
    SELECTORS = {
        textarea: 'textarea',
        input: 'input[type={type}]'
    },
    _REPLACE = "replace";
    
    var EditableField = function(config){
        config.host.on('click', this._renderToEdit, this);
        EditableField.superclass.constructor.apply(this, arguments);
    };
    
    EditableField.NS = 'ef';
    
    EditableField.NAME = 'editable-field';
        
    EditableField.ATTRS = {
        state: {
            value: 'editable'
        },
        type: {
            value: 'text',
            validator: function(val, name){
                return TEMPLATES[val] ? true : false;
            }
        }
    };
    
    Y.extend(EditableField, Y.Plugin.Base, {
        _renderToEdit: function(){
           var host = this.get('host'),
                type = this.get('type'),
                content = host.getContent(),
                template = TEMPLATES[type],
                child = Y.Node.create(Y.substitute(template, {value: content}));
            
            this._setUpChild(child, host);
            this.set(STATE, STATES.editing);
            
            host.insert(child, _REPLACE);
            host.detach('click');
            host.on('clickoutside', this._renderToEditable, this);
            child.focus();
        },
        _renderToEditable: function(){
            var host = this.get('host'),
                type = this.get('type'),
                content = this._getContent(type);
                
            this.set(STATE, STATES.editable);
            //TODO match host to child h/w
            host.setContent(content);
            host.detach('clickoutside');
            host.on('click', this._renderToEdit, this);
        },
        _getContent: function(type){
            var host = this.get('host'),
                node;
            switch(type){
                case 'textarea':
                    node = host.one(SELECTORS.textarea);
                    break;
                default:
                    node = host.one(Y.substitute(SELECTORS.input, {type: type}));
                    break;
            }
            
            return node.get('value');
        },
        _findTemplate: function(type){
                return this.TEMPLATES[type];
        },
        _setUpChild: function(child, parent){
            child.setStyle('width', parent.getStyle('width'));
            child.setStyle('height', parent.getStyle('height'));
        }
    });
    
    Y.namespace('Plugin');
    Y.Plugin.EditableField = EditableField;
    
},'0.1', {requires: ['node', 'event', 'plugin', 'substitute', 'gallery-outside-events']});