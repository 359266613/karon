(function($, document) {

    var friends = [];
    store.remove('friends')
    if(store.get('friends')) {
        //friends = store.get('friends');
    }

    layerc.zIndex = 6666;
    var $container,
        chatStack = [],
        setTop = function(index) {
            layerc.setZindex($('#layui-layer'+index));
        },
        /* 创建联系人容器 */
        createHtml = function() {
            $container = $('<div class="lately-bar"></div>');
            $container.html('<div class="lately-header">'
                + '<span class="lately-close" data-lately="close">&times;</span>'
                + '<div class="lately-title">最近联系人</div>'
                + '</div>'
                + '<div class="lately-body">'
                + '<div class="lately-scroll"></div></div>');
            $(document.body).append($container);
        },
        /* 更新本地联系人 */
        updateFriends = function(data) {
            var flag = true;
            for ( var j=0, len=data.length; j < len; j++) {
                flag = true;
                for (var i = 0, l = friends.length; i < l; i++) {
                    if(data[j].id === friends[i].id) {
                        friends[i] = data[j];
                        flag = false;
                        break;
                    }
                }
                if(flag) {
                    friends.push(data[j]);
                }
            }
            store.set('friends', friends, new Date().getTime() + 24*60*60*1000);
            update();
        },
        /* 更新联系人列表 */
        update = function(data) {
            var arr = [];
            if('object' === typeof friends) {
                for (var i = friends.length-1; i >= 0; i--) {
                    arr.push('<div class="lately-item" data-lately="user" data-id="'+friends[i].id+'">'
                        +'<div class="lately-item-avatar"><img src="'+friends[i].avatar+'" width="40" height="40"></div>'
                        //timeago暂时未用,不启用
                        //+'<div class="lately-item-time">'+timeago().format(friends[i].time, 'zh_CN')+'</div>'
                        +'<div class="lately-item-name">'+friends[i].name+'</div>'
                        +'<div class="lately-item-wrap-up">'+friends[i].message+'</div>'
                        +'</div>');
                }
            }
            $container.find('.lately-scroll').html(arr.join(''));
        },
        /* 获取联系人，同时获取最后一次通信记录 */
        getData = function() {
            $.ajax({
                type: 'get',
                url: 'http://120.78.216.113:9086/users',
                cache: false,
                success: function(res) {
                    if(res.status) {
                        updateFriends(res.list);
                    }
                }
            })
        },
        /* 事件绑定 */
        bind = function() {
            $('[data-lately="close"]').on('click', function() {
                $container.toggleClass('open');
            });
            $container.on('click', '.lately-item', function() {
                var $this = $(this), 
                    userId = $this.data('id'), 
                    flag = false;
                if(!userId) {
                    console.log('没有找到ID')
                    return;
                }
                for (var i = chatStack.length - 1; i >= 0; i--) {
                    if(chatStack[i].userId === userId) {
                        setTop(chatStack[i].index);
                        layerc.restore(chatStack[i].index);
                        flag = true;
                        break;
                    }
                }
                if(flag) return;
                openChat(userId);
            });
        },
        /* 打开聊天窗口 */
        openChat = function(userId) {
            layerc.open({
                skin: 'layer-chat',
                type: 2,
                title: '&nbsp;',
                maxmin: true,
                shade: false,
                zIndex: layerc.zIndex,
                area: ['600px', '460px'],
                content: 'PubShortMessage_showMessagePage?id='+userId,
                success: function(layero, index) {
                    layerc.setTop(layero);
                    chatStack.push({
                        userId: userId,
                        index: index
                    })
                },
                end: function(index) {
                    for (var i = 0, l = chatStack.length; i < l; i++) {
                        if(Number(chatStack[i].index) === Number(index)) {
                            chatStack.splice(i, 1);
                            break;
                        }
                    }
                },
                min: function(layero) {
                    layero.addClass('layer-minimize');
                    var body = layerc.getChildFrame('body', layero.attr('times'));
                    body.addClass('chat-minimize')
                },
                restore: function(layero) {
                    layero.removeClass('layer-minimize');
                    var body = layerc.getChildFrame('body', layero.attr('times'));
                    body.removeClass('chat-minimize')
                }
            })
        };

    /* 弹出消息提示 */
    var showNotify = function(obj) {
        $.notify(obj, {
            // settings
            element: 'body',
            position: null,
            type: "info",
            allow_dismiss: true,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 5000,
            timer: 1000,
            url_target: '_blank',
            mouse_over: null,
            animate: {
                enter: 'animated fadeInUp',
                exit: 'animated fadeOut'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: 'image',
            template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<div class="notify-table" data-notify="show" data-id="{3}"><div class="notify-left" data-notify="icon"></div> ' +
                '<div class="notify-right"><div class="title" data-notify="title">{1}</div> ' +
                '<div class="message" data-notify="message">{2}</div></div></div>' +
                '</div>'
        });
    };

    window.chatRoom = {
        setTop: setTop,
        getFriendInfo: function(id) {
            for (var i = friends.length - 1; i >= 0; i--) {
                if(Number(friends[i].id) === Number(id)) {
                    return friends[i];
                }
            }
        }
    }

    var Lately = function() {
        createHtml();
        //getData();
        bind();
    };

    new Lately();

    /* 定时获取新消息 */
    (function() {
        var getMessage = function() {
            $.ajax({
                type: 'get',
                url: 'PubShortMessage_topOne',
                cache: false,
                success: function(res) {
                    console.log("res.list=="+res.list.length);
                    if(res.list!=null) {
                        updateFriends(res.list);
                        for(var i=0,l=res.list.length; i<l; i++) {
                            showNotify({
                                icon: res.list[i].avatar,
                                title: res.list[i].name,
                                message: res.list[i].message,
                                url: res.list[i].id
                            });
                        }
                        setTimeout(getMessage, 30000)
                    }
                }
            })
        };

        // setTimeout(getMessage, 30000)
        getMessage();
    })();

    $(document).on('click', '[data-notify="show"]', function() {
        var $this = $(this), 
            userId = $this.data('id'), 
            flag = false;
        if(!userId) {
            console.log('没有找到ID')
            return;
        }
        for (var i = chatStack.length - 1; i >= 0; i--) {
            if(chatStack[i].userId === userId) {
                setTop(chatStack[i].index);
                layerc.restore(chatStack[i].index);
                flag = true;
                break;
            }
        }
        if(flag) return;
        openChat(userId);
    });

    $('[data-toggle="message"]').on('click', function() {
        $('.lately-bar').toggleClass('open')
    });

})(jQuery, document)