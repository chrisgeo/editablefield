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
    };
    
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
                template = TEMPLATES[type];
            
            this.set(STATE, STATES.editing);
            host.setContent(Y.substitute(template, {value: content}));
            host.detach('click');
            host.on('clickoutside', this._renderToEditable, this);
            host.one(':first-child').focus();
        },
        _renderToEditable: function(){
            var host = this.get('host'),
                type = this.get('type'),
                content = this._getContent(type);
                
            this.set(STATE, STATES.editable);
            host.setContent(content);
            host.detach('clickoutside');
            host.on('click', this._renderToEdit, this);
        },
        _getContent: function(type){
            var host = this.get('host'),
                node;
            switch(type){
                case 'textarea':
                    node = host.one('textarea');
                    break;
                default:
                    node = host.one('input[type='+type+']');
                    break;
            }
            
            return node.get('value');
        },
        _findTemplate: function(type){
                return this.TEMPLATES[type];
        }
    });
    
    Y.namespace('Plugin');
    Y.Plugin.EditableField = EditableField;
    
},'0.1', {requires: ['node', 'event', 'plugin', 'substitute', 'gallery-outside-events']});

YUI().use('node', 'editable-field', function(Y){
    Y.one('.editable').plug({fn: Y.Plugin.EditableField, cfg: {type: 'textarea'}});
});