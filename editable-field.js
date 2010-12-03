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
        config.host.on('click', this._editEvent, this);
        EditableField.superclass.constructor.apply(this, arguments);
    }
    
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
        _editEvent: function(){
            var currState = this.get(STATE);
            if(currState == STATES.editable){
                //render correct form element
                this._renderToEdit();
                this.set(STATE, STATES.editing);
            }else if(currState == STATES.editing){
                //render uneditable and back
                this._renderToEditable();
                this.set(STATE, STATES.editable);
            }
        },
        _renderToEdit: function(){
           var host = this.get('host'),
                type = this.get('type'),
                content = host.getContent(),
                template = TEMPLATES[type];
            
            host.setContent(Y.substitute(template, {value: content}));
            
        },
        _renderToEditable: function(){
            var host = this.get('host'),
                type = this.get('type'),
                content = this._getContent(type);
            host.setContent(content);
        },
        _getContent: function(type){
            var host = this.get('host'),
                node;
            switch(type){
                case 'textarea':
                    node = host.one('textarea');
                default:
                    node = host.one('input[type='+type+']');
            }
            
            return node.get('value');
        },
        _findTemplate: function(type){
                return this.TEMPLATES[type];
        }
    });
    
    Y.namespace('Plugin');
    Y.Plugin.EditableField = EditableField;
    
},'0.1', {requires: ['node', 'event', 'plugin', 'substitute']});

YUI().use('node', 'editable-field', function(Y){
    Y.one('.editable').plug({fn: Y.Plugin.EditableField, cfg: {type: 'text'}});
});