
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

function changeDept(){     
    var openAjaxLogin = layer.open({
        type: 2,
        title: "切换部门",
        area: ['600px', '500px'],
        content: 'userChangeDept',
        closeBtn:0,
        btn: ['关闭'] 
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


function showRefuseInfomation(){        
    var openAjaxLogin = layer.open({
        type: 2,
        title: "信息接收设置",
        area: ['400px', '300px'],
        content: 'PubUserInfo_refuseInfomationSet',
        closeBtn:0,
        btn: ['关闭'] 
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


function helper(tid,gid,pid,mid){    
    var defaults = {
        width: $(window).width()-120,
        height: $(window).height()-100
    };    
    var openAjaxLogin = layer.open({
        type: 2,
        title: "帮助",
        area: [defaults.width+'px', defaults.height+'px'],
        content: 'PubHelper_showHelperList?tid='+tid+'&gid='+gid+'&pid='+pid+'&mid='+mid,
        closeBtn:0,
        maxmin: true,
        btn: ['关闭'] 
    });
}

function toNewUrl(url){
    window.location.href = url;
}

function glodon_processing(){
    var num = 0;
    $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "wkf_processing", 
        //请求成功
        success : function(result) { 
            num = result.data;
        },
        //请求失败，包含具体的错误信息
        error : function(e){
        }
    });
    return num;
}




function glodon_processed(){
    var num = 0;
    $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "wkf_processed", 
        //请求成功
        success : function(result) { 
            num = result.data;
        },
        //请求失败，包含具体的错误信息
        error : function(e){
        }
    });
    return num;
}



function glodon_started(){
    var num = 0;
    $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "wkf_started", 
        //请求成功
        success : function(result) { 
            num = result.data;
        },
        //请求失败，包含具体的错误信息
        error : function(e){
        }
    });
    return num;
}


function loadQQEmail(){
    $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "email_noread", 
        //请求成功
        success : function(result) {
            if(result && result.errcode==0)
                $("#showEmailLi").html("新邮件:"+result.count);
            else
                $("#showEmailLi").html("无");
        },
        //请求失败，包含具体的错误信息
        error : function(e){
            console.log(e.status);
            console.log(e.responseText);
        }
    });
}


function showQQEmail(){
     $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "email_sso", 
        //请求成功
        success : function(result) {
            if(!result)
                layer.alert("错误的邮箱，只支持@sckyzx.com的邮件格式");
            else{
                if(result.errcode==0){
                //window.open(result.login_url);

                    var form = document.createElement('form');
                    form.action = result.login_url;
                    form.target = '_blank';
                    form.method = 'POST';
                    document.body.appendChild(form);
                    form.submit(); 
                }else{
                    layer.alert("错误,原因是："+result.errmsg);
                }
            }
        },
        //请求失败，包含具体的错误信息
        error : function(e){
            console.log(e.status);
            console.log(e.responseText);
        }
    });
}



function previewAttachementWps(id,suffix,path,filename,file_table){
    var width=$(top.window).width()-40;
    var height=$(top.window).height()-40;
    suffix=suffix.toLowerCase();
    if(suffix==".pdf"){
       var url = "/jsp/pdfjs/web/viewer2.html?file=/"+path;
      if(file_table==1){
          url = "/jsp/pdfjs/web/viewer2.html?file=/docCenter/"+path;
      }

       top.layer.open({
            title: ['预览：'+filename, 'font-size:14px;'],
            type: 2,
            area: [width+'px', height+'px'],
            shadeClose: true,
            btn: ['确定'],
            yes: function(index, layero){
                  //按钮【按钮一】的回调
                 top.layer.close(index); //如果设定了yes回调，需进行手工关闭

                },
            end:function(){
            },
            btnAlign: 'c',
            fixed: true, //固定
            maxmin: true,
            content:url
          })



    }else if(suffix=='.doc' ||suffix=='.docx' ||suffix=='.xls' || suffix=='.xlsx' || suffix=='.ppt' || suffix=='.pptx'){
      //  var    widthheight = "width="+width+"px;"+"height="+height+"px;";
      //  POBrowser.openWindowModeless('FinContract_preview?id='+id,widthheight);
      var url="docCenter_checkWps";
      var params="id="+id+"&_w_type=0&file_table="+file_table;//0:代表fin_file_info  1:代表doc_center, 2:wps_file_info
      var title="";
        var defaults = {
             width: $(window).width()-400,
             height: $(window).height()-200
         };
        var opts = $.extend(defaults, null);
        layer.open({
                type: 2,
                title:title,
                area: [opts.width+'px', opts.height+'px'],
            maxmin: true, //开启最大化最小化按钮
                content: url+"?"+params,
                success: App.layerSuccess,
                end: App.layerEnd,
            closeBtn:2,
        });
    }else if(suffix==".bmp" ||suffix==".jpeg" || suffix==".jpg" ||suffix==".gif" ||suffix==".tif" ||suffix==".png"||suffix==".ico"){
        if(file_table==1){
          path="/docCenter/"+path;
        }
         top.layer.open({
              title: ['预览：'+filename, 'font-size:14px;'],
              type: 1,
              area: [width+'px', height+'px'],
              shadeClose: true,
              btn: ['确定'],
              yes: function(index, layero){
                    //按钮【按钮一】的回调
                   top.layer.close(index); //如果设定了yes回调，需进行手工关闭
                    
                  },
              end:function(){
              },
              btnAlign: 'c',
              fixed: true, //固定
              maxmin: true,
              content:"<center><img src="+path+"><br>"+filename+"</center>"
            })
    }else{
        window.location.href="FinContract_downLoad?id="+id;
    }
}
