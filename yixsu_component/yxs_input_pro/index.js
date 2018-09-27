Component({
    behaviors: ['wx://form-field'],


    properties: {
        title: {
            type: String
        },
        // text || textarea || password || number
        type: {
            type: String,
            value: 'text'
        },
        disabled: {
            type: Boolean,
            value: false
        },
        placeholder: {
            type: String,
            value: ''
        },
        autofocus: {
            type: Boolean,
            value: false
        },
        mode: {
            type: String,
            value: 'normal'
        },
        right: {
            type: Boolean,
            value: false
        },
        error_info: {
            type: String,
            value: ''
        },
        maxlength: {
            type: Number
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        can_send_code: {
            type: Boolean,
            value: false
        },
        sending: {
            type: Boolean,
            value: false
        },
        no_border: {
            type: Boolean,
            value: false
        },
        icon:{
            type: String,
            value:''
        },
        must:{
            type: Boolean,
            value:false
        }
    },
    data:{
        send_code_str:'获取验证码'
    },

    methods: {
        handleInputChange(event) {
            const { detail = {} } = event;
            const { value = '' } = detail;
            this.setData({ value });

            this.triggerEvent('change', detail);
        },

        handleInputFocus(event) {
            this.triggerEvent('focus', event);
        },

        handleInputBlur(event) {
            this.triggerEvent('blur', event);
        },
        sendcode() {
            if (!this.data.can_send_code || this.data.sending) {
                return ;
            }
            this.timelimit(60);
            this.triggerEvent('sendcode');
        },
        timelimit: function(left) {
            this.setData({
                sending : true
            });
            var time_limit_left = parseInt(left);
            var time_limit_left_desc = '';
            if (time_limit_left > 0) {

                this.Interval = setInterval(function () {
                    time_limit_left -= 1;
                    this.setData({
                        send_code_str : time_limit_left+'后重新获取'
                    });

                    if (time_limit_left <= 0) {
                        this.setData({
                            send_code_str : '获取验证码',
                            sending : false
                        });

                        clearInterval(this.Interval);
                    }
                }.bind(this),1000);
            }
        }
    }
});
