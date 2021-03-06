/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('FileBot.view.task.TaskController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'FileBot.Node'
    ],

    alias: 'controller.task',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    restoreState: function() {
        var values = Ext.state.Manager.get('formOrganizeFiles')
        if (values) {
            this.getForm().setValues(values)
        }
    },

    saveState: function() {
        var values = this.getForm().getValues()
        Ext.state.Manager.set('formOrganizeFiles', values)
        return values
    },

    onExecute: function() {
        var parameters = this.getExecuteParameters()
        if (parameters) {
            FileBot.Node.requestExecute(parameters)
        }
    },

    onTest: function() {
        var parameters = this.getExecuteParameters()
        if (parameters) {
            // force --action test and then execute normally
            parameters.action = 'test'
            FileBot.Node.requestExecute(parameters)
        }
    },

    onSchedule: function() {
        var parameters = this.getExecuteParameters()
        if (parameters) {
            FileBot.Node.requestSchedule(parameters)
        }
    },

    onDonate: function() {
        Ext.create('Ext.window.Window', {
            bodyCls: ['paypal'],
            html: Ext.manifest.server.html.paypalForm,
            title: '💰 Donate',
            bodyPadding: 10,
            scrollable: false,
            closable: true
        }).show()
    },

    onConfigure: function() {
        Ext.create('Ext.window.Window', {
            id: 'osdbWindow',
            items: [{
                xtype: 'form',
                id: 'osdbForm',
                items: [{
                    xtype: 'hidden',
                    name: 'fn',
                    value: 'configure'
                }, {
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: 'Username',
                    name: 'osdbUser',
                    emptyText: 'username'
                }, {
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: 'Password',
                    name: 'osdbPwd',
                    emptyText: 'password',
                    inputType: 'password'
                }]
            }],
            buttons: [
                { text:'Register', handler: function(btn) {
                    window.open(Ext.manifest.server.url.osdb_register, '_blank')
                }},
                { text:'Login', handler: function(btn) {
                    var form = Ext.getCmp('osdbForm').getForm()
                    if (form.isValid()) {
                        FileBot.Node.requestExecute(form.getValues())
                        Ext.getCmp('osdbWindow').destroy()
                    }
                }}
            ],
            title: 'OpenSubtitles',
            bodyPadding: 10,
            scrollable: false,
            closable: true
        }).show()
    },

    onInfo: function() {
        var parameters = {'fn':'sysinfo'}
        FileBot.Node.requestExecute(parameters)
    },

    onHelp: function() {
        window.open(Ext.manifest.server.url.help, '_blank')
    },

    getExecuteParameters: function() {
        var form = this.getForm()
        if (form.isValid()) {
            return this.saveState()
        }
        return null
    },

    getForm: function() {
        return this.getView().down('form').getForm()
    }

});
