var pageBehavior = require('../behavior/page')
Component({
    behaviors: [pageBehavior],
    properties: {
        left:{
            type: null,
            value: 0
        },
    },
    data: {
        visible: false,
        actions: [

            {
                name: '确认',
                color: '#19be6b'
            }
        ],
        time_limit_left_desc:'',
        time_limit_left_arr:null,
        time:{
            day:0,
            hour:0,
            minute:0
        }
    },
    attached() {
        this.timelimit(this.data.left);
    },
    methods: {
        change_text() {
            if (!this.data.canEdit) {
                return;
            }

            this.setData({
                visible: true
            });
        },
        handleClick ({ detail }) {
            var timeleft = parseInt(this.data.time.day * 3600 * 24) + parseInt(this.data.time.hour * 3600) + parseInt(this.data.time.minute * 60);
            this.timelimit(timeleft);

            this.triggerEvent('changetmpdata', {key:'time_limit_left',value:timeleft})

            this.setData({
                visible: false
            });
        },
        tapInput1(event){
            this.data.time.day = event.detail.value;
        },
        tapInput2(event){
            this.data.time.hour = event.detail.value;
        },
        tapInput3(event){
            this.data.time.minute = event.detail.value;
        },
        timelimit: function(left) {
            var time_limit_left = parseInt(left);
            var time_limit_left_desc = '';
            var time_limit_left_arr = null;
            if (time_limit_left > 0) {
                if (this.Interval) {
                    clearInterval(this.Interval);
                }

                this.Interval = setInterval(function () {
                    time_limit_left -= 1;
                    var day = parseInt(time_limit_left / 3600 / 24);
                    var hour = parseInt ((time_limit_left - day * 3600 * 24) / 3600);
                    var min = parseInt ((time_limit_left - day * 3600 * 24 - hour * 3600) / 60);
                    var sec = parseInt (time_limit_left - day * 3600 * 24 - hour * 3600 - min * 60);
                    time_limit_left_desc = day + '天' + hour + '时' + min + '分' + sec + '秒';
                    time_limit_left_arr = {day:day,hour:hour,min:min,sec:sec};
                    this.setData({
                        time_limit_left_desc : time_limit_left_desc,
                        time_limit_left_arr : time_limit_left_arr,
                    });

                    if (time_limit_left <= 0) {
                        clearInterval(this.Interval);
                    }
                }.bind(this),1000);
            } else {
                this.setData({
                    time_limit_left_desc : '活动已结束',
                    time_limit_left_arr : null
                });
            }
        }

    }
});
