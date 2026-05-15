(function($){
    $.fn.dbutton = function(state){
        var $el = $(this);
        if('loading' === state) {
            $el.data('stateText', $el.html());
            $el.prop('disabled', true).html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
        }else if('reset' === state) {
            $el.prop('disabled', false).html( $el.data('stateText') ).removeClass('disabled');
        }
    }
})(jQuery);

(function($, window){
    var Obj = function(callback) {
        var timer;
        $(window).on('resize', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                if(typeof callback === 'function') 
                    callback.call(this);
            }, 500);
        });
    };

    $.extend({
        onResize: function(callback) {
            new Obj(callback);
        }
    })
})(jQuery, window);

var App = function() {

    var isIE = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;
    var layerIndexArray = [];

    var handleInit = function() {
        isIE = !!window.ActiveXObject || "ActiveXObject" in window;
        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);
    };

    var handleSidebar = function() {
        if(showHideLeft){
            $('body').toggleClass('side-hide');
        }
    };

    var handleScrollers = function() {
        App.initSlimScroll('.scroller');
        $.onResize(function(){
            App.initSlimScroll('.scroller');
        });
    };

    var handleDataTables = function() {
        App.initDataTable('.dataTable');
    };

    var handleFormValidation = function() {
        App.initFormValidation('.validation');
    };

    var handleiCheck = function() {
        App.initICheck();
    };

    var handleDistpicker = function() {
        App.initDistpicker('.distpicker');
    };

    var handleCheckAll = function() {
        $(document).on('ifChanged', '.check-all', function() {
            if($(this).prop('checked'))
                $('input[name='+$(this).attr('data-name')+']').iCheck('check');
            else
                $('input[name='+$(this).attr('data-name')+']').iCheck('uncheck');
        }).on('ifChanged', '.icheck', function(){
            $(this).trigger('change');
            if($(this).hasClass('tb-row-checkbox')) {
                $(this).parents('.tb-row:first').toggleClass('selected', $(this).prop('checked'));
            }
        });
    };

    var handleCheckedRow = function() {
        $(document).on('click', '.tb-row', function(e) {
            e.stopPropagation();
            var str = $(this).hasClass('selected') ? 'uncheck' : 'check';
            $(this).toggleClass('selected').find('.tb-row-checkbox').iCheck(str);
        });
    };

    var handleSideNav = function() {
        $('.side-nav>ul>li>a').on('click', function(e){
            if($(this).next().length){
                e.preventDefault();
                var $this = $(this.parentNode),
                    $sub = $this.children('ul');
                if($this.hasClass('loading')) return;
                $this.addClass('loading');
                if($this.hasClass('open')) {
                    $sub.slideUp(300, function(){
                        $this.removeClass('open');
                        $this.removeClass('loading');
                        $sub.removeAttr('style');
                    });
                }else{

                    var $other = $this.siblings('.open');
                    if($other.length) {
                        $other.children('ul').slideUp(300, function(){
                            $other.removeClass('open');
                            $other.removeClass('loading');
                            $(this).removeAttr('style');
                        });
                    }

                    $sub.slideDown(300, function(){
                        $this.addClass('open');
                        $this.removeClass('loading');
                        $sub.removeAttr('style');
                    });
                }
            }
        });
    };

    var handleEventDelegate = function() {
        $(document).on('click', '.side-toggle', function(){
            handleSidebar();
        }).on('click', 'button[form]', function(){
            if(isIE) {
                $("#"+this.getAttribute('form')).trigger('submit');
            }
        });
    };

    var AjaxProgress = function() {
        var timer = null;
        var progressValue = 0;

        var Progress = function() {
            var isOpen = false;
            return {
                create: function() {
                    if(isOpen) {
                        this.setProgress(0);
                    }else{
                        isOpen = true;
                        this.$mask = $('<div class="progress-mask"></div>');
                        this.$box = $('<div class="progress-box"></div>').appendTo(this.$mask);
                        this.$wrap = $('<div class="progress"></div>').appendTo(this.$box);
                        this.$progress = $('<div class="progress-bar" role="progressbar"></div>').appendTo(this.$wrap);
                        $('body').append(this.$mask);
                    }
                },
                setProgress: function(v) {
                    this.$progress.css('width', v+'%').text(v+'%');
                },
                remove: function() {
                    isOpen = false;
                    this.$mask.remove();
                }
            }
        }();

        var doing = function() {
            progressValue+=8;
            if(progressValue >= 90) {
                clearInterval(timer);
            }
            Progress.setProgress(progressValue);
        };

        return {
            start: function() {
                progressValue = 0;
                clearInterval(timer);
                Progress.create();

                timer = setInterval(doing, 300);
            },
            stop: function(callback) {
                var base = this;
                clearInterval(timer);
                if(typeof callback == 'function') {
                    Progress.setProgress(100);
                    setTimeout(function() {
                        Progress.remove();
                        callback.call(base);
                    }, 500);
                }else{
                    Progress.remove();
                }
            }
        }
    }();

    var FreezeHead = function() {
        return {
            init: function(el) {
                this.$elem = $(el);
                if(this.$elem.data('initialized')) return;
                this.$elem.data('initialized', 1);
                if(typeof el === 'string')
                    this.$elem.removeClass(el.substr(1));
                this.create();
                this.update();
                this.response();
            },
            create: function() {
                this.$elem.parents('.table-responsive:first').css('margin-bottom', '20px');
                this.$head = this.$elem.css('margin-bottom', '0').clone();
                this.$elem.before(this.$head);
                this.$head.children('tbody').remove();
                this.$scroll = $('<div class="scroller"></div>').insertAfter(this.$elem);
                this.$elem.children('thead').remove();
                this.$scroll.append(this.$elem);
            },
            response: function() {
                var self = this;
                $.onResize(function() {
                    self.update();
                });
            },
            updateCol: function() {
                var self = this, $col;
                self.$colgroup = $('<colgroup></colgroup>');
                self.$elem.children().children(':first').children().each(function() {
                    $col = $('<col/>').css('width', $(this).width()+'px');
                    self.$colgroup.append( $col );
                });
                self.$elem.prepend(self.$colgroup);
                self.$head.prepend(self.$colgroup);
            },
            update: function() {
                this.$scroll.data('newHeight', $(window).height()-295);
                App.initSlimScroll('.scroller');
            }
        }
    }();

    var ScrollFixed = function() {
        var Obj = function(el) {
            this.$elem = $(el);
            this.elemHeight = this.$elem.innerHeight();
            this.$elem.height(this.elemHeight);
            this.direction = this.$elem.data('direction') || 'top';
            this.value = this.$elem.data('value') || 0;
            this.distance = this.$elem.data('distance') || 0;
            this.winHeight = $(window).height();
            this.update();
            this.listener();
            this.response();
        };
        Obj.prototype = {
            listener: function() {
                var self = this;
                $(window).on('scroll', function() {
                    self.update();
                })
            },
            update: function() {
                var self = this;
                if(this.direction === 'top') {
                    if(self.$elem.offset().top < $(document).scrollTop()+self.distance) {
                        self.$elem.addClass('scroll-fixed');
                        self.$elem.children().css({
                            'top': self.value+'px',
                            'width': self.$elem.width()+'px',
                            'padding-top': '15px'
                        });
                    }else{
                        self.$elem.removeClass('scroll-fixed');
                        self.$elem.children().removeAttr('style');
                    }
                } else if(this.direction === 'bottom') {
                    if(self.$elem.offset().top+self.elemHeight > $(document).scrollTop()+self.winHeight-self.distance) {
                        self.$elem.addClass('scroll-fixed');
                        self.$elem.children().css({
                            'bottom': self.value+'px',
                            'width': self.$elem.width()+'px',
                            'padding-bottom': '15px'
                        });
                    }else{
                        self.$elem.removeClass('scroll-fixed');
                        self.$elem.children().removeAttr('style');
                    }
                }
            },
            response: function() {
                var self = this;
                $.onResize(function() {
                    self.winHeight = $(window).height();
                    if(self.$elem.hasClass('scroll-fixed')) {
                        self.$elem.children().css({
                            'width': self.$elem.width()+'px'
                        });
                    }
                });
            }
        };

        return {
            init: function(el) {
                $(el).each(function() {
                    if($(this).data('initialized')) return true;
                    $(this).data('initialized', 1);
                    new Obj(this);
                })
            }
        }
    }();

    var TableScrollHead = function() {
        return {
            init: function(el) {
                this.$elem = $(el);
                if(this.$elem.data('initialized')) return;
                this.$elem.data('initialized', 1);
                if(typeof el === 'string')
                    this.$elem.removeClass(el.substr(1));
                this.create();
            },
            create: function() {
                this.$head = this.$elem.clone();
                this.$elem.before(this.$head);
                this.$head.css('margin-bottom', '0').children('tbody').remove();
                this.$elem.children('thead').remove();

                this.$head.wrap('<div />').parent().wrap(function() {
                    return '<div class="scroll-fixed-bar" data-value="104" data-distance="124"></div>';
                });
            }
        }
    }();

    var initMenu = function() {
        var $menu = $('#topMenu'), $childs = $menu.children('ul').children(), w = 0;
        $childs.each(function() {
            w += $(this).innerWidth();
        })
        $menu.width(w);
        /*$menu.draggable({
            axis: 'x',
            appendTo: 'body',
            containment: false
        });*/
        var draging = false, down = false, start = 0, left = 0;
        $('.menu-handle').on('mousedown', function(e) {
            down = true;
            start = e.pageX;
        });

        $(window).resize(function() {
            if(left!=0) {
                left = 0;
                $menu.css('left', 0);
            }
        })

        $(document).on('mousemove', function(e) {
            if(down) {
                if(Math.abs(e.pageX-start) > 10) {
                    draging = true;
                    $menu.addClass('draging');
                }
            }
            if(draging) {
                e.stopPropagation();
                left = left+(e.pageX-start);
                start = e.pageX;
                $menu.css('left', left+"px");
            }
        }).on('mouseup', function() {
            if(down) down = false;
            if(draging) {
                draging = false;
                $menu.removeClass('draging');
                if(left > 0) {
                    left = 0;
                    $menu.addClass('transition').css('left', "0");
                    $menu.on('transitionend', function(){
                        $menu.removeClass('transition')
                    })
                } else if($menu.innerWidth() < $menu.parent().innerWidth()) {
                    if(left < 0) {
                        left = 0;
                        $menu.addClass('transition').css('left', "0");
                        $menu.on('transitionend', function(){
                            $menu.removeClass('transition')
                        })
                    }
                } else if($menu.innerWidth()+left < $menu.parent().innerWidth()){
                    left = $menu.parent().innerWidth() - $menu.innerWidth();
                    $menu.addClass('transition').css('left', left+"px");
                    $menu.on('transitionend', function(){
                        $menu.removeClass('transition')
                    })
                }
            }
        });
    };

    return {
        init: function() {
            handleInit();
            handleSideNav();
            handleScrollers();
            handleiCheck();
            handleCheckAll();
            handleCheckedRow();
            handleEventDelegate();
            initMenu();
        },
        goTop: function() {
            $('html,body').scrollTop(0);
        },
        initSlimScroll: function(el) {
            if (!$().slimScroll) {
                return;
            }

            $(el).each(function() {
                var height = $(this).data('newHeight') || $(window).height()-50;
                if ($(this).data("initialized") && $(this).data("height")==height) {
                    return;
                }

                $(this).slimScroll({
                    height: height
                });

                $(this).data("initialized", "1");
                $(this).data("height", height);
            });
        },
        initDataTable: function(el) {
            if (!$().DataTable) {
                return;
            }
            $(el).each(function() {
                if ($(this).data("initialized")) {
                    return;
                }
                $(this).DataTable({
                    scrollY: '50vh',
                    //scrollCollapse: true,
                    paging: false,
                    info: false,
                    searching: false,
                    ordering: false
                });
                $(this).data("initialized", "1");
            });
        },
        initFormValidation: function(el) {
            if (!$().formValidation) {
                return;
            }
            $(el).each(function() {
                if ($(this).data("initialized")) {
                    return;
                }
                $(this).formValidation({
                    locale: 'zh_CN'
                }).on('success.form.fv', function(e){
                    if('function' === typeof App.formSubmit) {
                        App.formSubmit(e);
                    }
                });
                $(this).data("initialized", "1");
            });
        },
        initICheck: function() {
            if (!$().iCheck) {
                return;
            }

            $('.icheck').each(function() {
                var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-blue';
                var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-blue';

                if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                    $(this).iCheck({
                        checkboxClass: checkboxClass,
                        radioClass: radioClass,
                        insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                    });
                } else {
                    $(this).iCheck({
                        checkboxClass: checkboxClass,
                        radioClass: radioClass
                    });
                }
            });
        },
        initDistpicker: function(el) {
            if (!$().distpicker) {
                return;
            }
            
            $(el).each(function() {
                if ($(this).data("initialized")) {
                    return;
                }
                $(this).distpicker({placeholder:false});
                $(this).data("initialized", "1");
            });
        },
        initLayDate: function() {
            if (typeof lay !== 'function') {
                return;
            }
            lay('.laydate').each(function(){
                if ($(this).data("initialized")) {
                    return;
                }
                laydate.render({
                    elem: this
                    ,trigger: 'click'
//                    	,type: 'datetime',
                    ,done: function(el) {
                        var $this = $(this.elem[0]);
                        setTimeout(function(){
                            $this.trigger('input');
                            $this.trigger('blur');
                        }, 200)
                    } 
                });
                $(this).data("initialized", "1");
            });
        },
        initLaydateTime: function() {
            if (typeof lay !== 'function') {
                return;
            }
            lay('.laydatetime').each(function(){
                var $this = $(this);
                if ($this.data("initialized")) {
                    return;
                }
                laydate.render({
                    elem: this
                    ,trigger: 'click'
                    ,type: 'datetime'
                    ,done: function(a,b) {
                        // 解决日期选择后无法触发表单验证
                        setTimeout(function(){
                            $this.trigger('input')
                        }, 200)
                    }
                });
                $this.data("initialized", "1");
            });
        },
        initLaydateYear: function() {
            if (typeof lay !== 'function') {
                return;
            }
            lay('.laydateyear').each(function(){
                var $this = $(this);
                if ($this.data("initialized")) {
                    return;
                }
                laydate.render({
                    elem: this
                    ,trigger: 'click'
                    ,type: 'year'
                    ,done: function(a,b) {
                        // 解决日期选择后无法触发表单验证
                        setTimeout(function(){
                            $this.trigger('input')
                        }, 200)
                    }
                });
                $this.data("initialized", "1");
            });
        },
        initLaydateYearMonth:function() {
            if (typeof lay !== 'function') {
                return;
            }
            lay('.laydateyearmonth').each(function(){
                var $this = $(this);
                if ($this.data("initialized")) {
                    return;
                }
                laydate.render({
                    elem: this
                    ,trigger: 'click'
                    ,type: 'month'
                    ,done: function(a,b) {
                        // 解决日期选择后无法触发表单验证
                        setTimeout(function(){
                            $this.trigger('input')
                        }, 200)
                    }
                });
                $this.data("initialized", "1");
            });
        },
        initLayTime: function() {
            if (typeof lay !== 'function') {
                return;
            }
            lay('.laydatetime').each(function(){
                var $this = $(this);
                if ($this.data("initialized")) {
                    return;
                }
                laydate.render({
                    elem: this
                    ,trigger: 'click'
                    ,type: 'time'
                    ,done: function(a,b) {
                        // 解决日期选择后无法触发表单验证
                        setTimeout(function(){
                            $this.trigger('input')
                        }, 200)
                    }
                });
                $this.data("initialized", "1");
            });
        },
        initSummernote: function(el) {
            $(el).summernote({
                lang: 'zh-CN'
                ,toolbar: [
                    ['font', ['clear', 'bold', 'italic', 'underline', 'strikethrough', 'color']],
                    ['fontname', ['fontname', 'superscript', 'subscript', 'height']],
                    ['para', ['style', 'ul', 'ol', 'paragraph']],
                    ['insert', ['hr', 'table', 'link', 'picture', 'video']],
                    ['view', ['fullscreen']]
                ]
            });
        },
        layerSuccess: function(layero, index) {
            if('object' === typeof layer) {
                layerIndexArray.push(index);
            }
        },
        layerEnd: function() {
            if('object' === typeof layer) {
                layerIndexArray.pop();
            }
        },
        layerClose: function() {
            if('object' === typeof layer) {
                layer.close(layerIndexArray[layerIndexArray.length - 1]);
            }
            flagV=true;
        },
        getCodeGroupObject: function(obj) {
            if('object' === typeof obj) {
                return obj;
            }
            if('string' === typeof obj && ''!=obj){
                return eval(obj);
            }
            return null;
        },
        getCodeGroupName: function(obj, val){
            obj = this.getCodeGroupObject(obj);
            if(!obj || !val) {
                return '';
            }
            var vals = [];
            var arr = val.split(',');
            if(arr.length){
                for(var i=0; i<obj.length; i++){
                    for(var j=0,l=arr.length; j<l; j++){
                        if(obj[i][0]==arr[j]){
                            vals.push(obj[i][1]);
                        }
                    }
                }
            }
            return vals.join('、');
        },
        getCodeGroupOption: function(obj, val) {
            obj = this.getCodeGroupObject(obj);
            if(obj == null) {
                return '';
            }
            var option = [];
            for(var i=0,l=obj.length; i<l; i++){
                if(obj[i][0]!=undefined && obj[i][0]==val){
                    option.push('<option value='+obj[i][0]+' selected>'+obj[i][1]+'</option>');
                }else{
                    option.push('<option value='+obj[i][0]+'>'+obj[i][1]+'</option>');
                }
            }
            return option.join('');
        },
        scrollbox: function(el, val) {
            var val = val || 0;
            $(el).height($(window).height() - val);
            $.onResize(function() {
                $(el).height($(window).height() - val);
            })
        },
        ajaxProgress: AjaxProgress,
        freezeHead: FreezeHead,
        scrollFixed: ScrollFixed,
        tableScrollHead: TableScrollHead,
        initLayerSiteDir:function(dom){
            layer.open({
              type: 1,
              title: '目录',
              shade:0,
              area: ['190px', '300px'],
              closeBtn: 0,
              maxmin: true,
              resize:false,//禁止拉伸
              offset: 'r',//快捷设置右边缘坐标
              content: dom //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
        }
    }
}();
var i=1;
var idd='fileGroup';
function  addfileDiv(id){
// 	console.log(i);
	var ids=i+idd+"";
	var divHtml='<div class="row" id="'+ids+'">'
	+'<div class="col-md-6">'
	+'<div class="form-group">'
	+'<label class="control-label">上传附件：</label>'
	+'<div class="fv-control">'
	+'<input type="file" class="fileclasss" name="file" >'
	+'<i class="fa fa-fw fa-close" style="cursor: pointer;" onclick=deleteFileDiv(&apos;'+ids+'&apos;) title="删除"></i>'
	+'<i class="fa fa-fw fa-plus-square" style="cursor: pointer;" title="增加" onclick=addfileDiv(&apos;'+ids+'&apos;)></i>'
	+'</div>'
	+'</div>'
	+'</div>'
	+'</div>';
	$("#"+id).after(divHtml);
	i++;
}
function deleteFileDiv(id){
	if(id==idd){
		var obj = document.getElementById('fileOnly') ; 
		obj.outerHTML=obj.outerHTML;
	}else{
	$("#"+id).remove();
	}
}
function deleteFinFile(id){
	var data={id:id};
	//询问框
	layer.confirm('删除后将无法恢复，您确定删除所选附件？', {
	  btn: ['确定','取消'] //按钮
	},
	function(){
		$.ajax({
		type: 'post',
		url:'FinContract_removeFile',
		contentType: "application/json; charset=utf-8",
		data:JSON.stringify(data),
		dataType: 'json',
		success: function(res) {
            if(res.status == "1") {
                layer.msg(res.statusText);
                $("#"+id).remove();
            }else{
                layer.alert(res.statusText);
            }
        }
	})
	}
	);
}
//生成随机数(数字与大写字母)
function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
//         console.log(res);
    
    return res;
}

/**
** randomWord 产生任意长度随机数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** 
*/
function randomNum(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        if(i==0&&arr[pos]=='0'){
        	str += '1';
        }else{
        	str +=arr[pos];
        }
    }
    return str;
}
/**
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** 
*/
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}



 function valueModify(s){
    s=s.replace(/,/g,'');
    if(/[^0-9\.]/.test(s)) return ""; 
    s=s.replace(/^(\d*)$/,"$1."); 
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1"); 
    s=s.replace(".",","); 
    var re=/(\d)(\d{3},)/; 
    while(re.test(s)) 
    s=s.replace(re,"$1,$2"); 
    s=s.replace(/,(\d\d)$/,".$1"); 
	s = s.replace(/^\./,"0."); 
	return  s;
} 

//判断JSON数组是否存在指定KEY的值
function inJSONAarryByKey(arr, key, value){
	var flag = -1;
	if(arr!=null && typeof arr === 'object') {
		for(var i=0,l=arr.length; i<l; i++) {
			if(arr[i][key] === value) {
				flag = i;
				break;
			}
		}
	}
	return flag;
}


    function showAjaxLogin (win,userName){
        var url = 'loginAjax';
        if(userName!=null && userName!="undefined" && userName!="" && userName!="null"){
            url=url+'?userName='+userName;
        }
        var openAjaxLogin = layer.open({
            type: 2,
            title: "您已超时，请重新登录",
            area: ['360px', '280px'],
            content: url,
            closeBtn:0,
            btn: ['立即登录'],
            yes: function(index, layo) {
                document.getElementById('layui-layer-iframe'+index).contentWindow.ajaxLogin(function(){
                    if(win) win.location.reload();
                });
            }
        });
    }


    function lockLogin (){
        var openAjaxLogin = layer.open({
            type: 2,
            title: "锁定系统",
            area: ['400px', '300px'],
            content: 'logout?islock=true',
            closeBtn:0,
            btn: ['立即登录'],
            yes: function(index, layo) {
                document.getElementById('layui-layer-iframe'+index).contentWindow.ajaxLogin(function(){
                    try {
                        if(win) win.location.reload();
                    }catch(e){}
                });
            },
        });
    }
    
function updatePassWord (){
//    var openAjaxLogin = layer.open({
    	layer.open({
        type: 2,
        title: "修改密码",
        area: ['376px', '473px'],
        content: 'PubUserInfo_updatePassWord',
        closeBtn:0,
        btn: ['关闭'],
        yes: function(index, layo) {
        	layer.close(index);
        }
    });
}
    
function onlineUser(){
    var openAjaxLogin = layer.open({
        type: 2,
        title: "在线用户",
        area: ['600px', '500px'],
        content: 'onlineUserInfo',
        closeBtn:0,
        btn: ['关闭'] 
    });
}

var flagV=true;
function toNewUrl(url){

    if(!flagV){
    layer.confirm('数据未保存，是否要离开？', {
        btn: ['离开','留下'] //按钮
        ,icon:3, title:'提醒'
    }, function(index){
        flagV=true;
        layer.close(index);
        window.location.href = url;
    },function(){
        
    })

  }else{
       window.location.href = url;
  }
	
	
}

function checktips(context,elem){
	layer.tips(context, elem, {
         tips: [1, '#0FA6D8'], //设置tips方向和颜色 类型：Number/Array，默认：2 tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
         tipsMore: false, //是否允许多个tips 类型：Boolean，默认：false 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
         time:2000  //2秒后销毁，还有其他的基础参数可以设置。。。。这里就不添加了
});
}

//报表
function exportSystemReport(id,title){ 
  var params={
    "title":title,
    "flag": 1,
    "id":""+id+""
  };
  Base.loadContent("PubEcharts_view",params,title,null);

}



function switchNet(){     
     $.ajax({
        type:'GET',
        url:'userChangeDept?flag=100', 
        dataType:'json',
        success:function(res){
            if(res.status==1){ 
                layer.alert("切换到"+res.tip+"成功!", {
                    btn:['确定'] ,
                    yes:function(){
                        window.location.reload();
                    }
                })
            }
        }
    })
}


//金额千分位显示
function comdify(n){
　　var re=/\d{1,3}(?=(\d{3})+$)/g;
　　var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
　　return n1;
}


function openDetailDiv(url,id){

     var params={
    "title":"查询详情",
    "flag": 20,
    "id":""+id+""
      };
      Base.loadContent(url,params,"",null);
}

function getRoundTypeId(){
	var code = "";
    for(var i = 1;i <= 5;i++){
        const num = Math.floor(Math.random()*10);
        code += num;
    }
    var timestamp = (new Date()).getTime();
    code += timestamp;
//     console.log(code)
    return code;
}
function  adjustSpecialBtn(id,type,tableName){//type为1时设置调整费用，为0时，取消调整费用
    var params={id:id,type:type,tableName:tableName}
    $.ajax({
        type: 'post',
        url: 'FinBorrowerInfo_adjustSpecial',
       data:JSON.stringify(params),
       contentType: "application/json; charset=utf-8",
            dataType: 'json',
        success: function(res) {
            console.log(res)
            if(type==1){
                
                 layer.msg("设置成功")
            }else{
                
                 layer.msg("取消成功")
            }
            Base.list();
        },
        error: function(xhr) {
            if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
        }
    });
 }

 function getPushError(id){
    var data={id:id};
        $.ajax({
        type: 'post',
        url:'FinApplyForBill_getYYlogById',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
        dataType: 'json',
        success: function(res) {
            console.log(res.result)
            if(res.result!=null && res.result.Msg!=null && typeof(res.result.Msg)!='undefined'){
                    alert(res.result.Msg);
            }else{
                alert(res.result);
            }
              
        
        }
    });
 }