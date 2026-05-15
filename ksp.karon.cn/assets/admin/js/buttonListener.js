var flagV=true;

var Base = function() {

    var history = [];
    var viewStack = [];
    var $pageActions = $('.page-actions');

    // 事件委托
    var handleDelegate = function() {
        $(document)
         // 管理员强制删除流程
        .on('click', '[role=adminforceCallBack]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.adminforceCallBack( $(this).data('id') );
        })
        // 添加
        .on('click', '[role=insert]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.insert();
        })
        .on('click', '[role=insertProject]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.insertProject();
        })
        .on('click', '[role=roleRights]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.roleRights( $(this).data('id') );
        })
        //上传培训成员明细
        .on('click','[role=uploadExcelForTrain]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.uploadExcelForTrain( $(this).data('id'));
        })
        //上传本部门绩效
        .on('click','[role=uploadExcelForAchieve]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.uploadExcelForAchieve( $(this).data('id'));
        })
        //查看合同详情页面新建提成
        .on('click','[role=createCommission]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.createCommission( $(this).data('id'));
        })
        //查看明细
         .on('click', '[role=referDetail]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.referDetail( $(this).data('id') );
        })
        //添加可查询合同人员
        .on('click','[role=addEmpsForContract]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.addEmpsForContract( $(this).data('id'));
        })
        //添加可查询合同人员
        .on('click','[role=insertEmpstaff]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.insertEmpstaff( $(this).data('id'));
        })
        .on('click','[role=addTaskorder]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.addTaskorder( $(this).data('id'));
        })
          .on('click','[role=addJob]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.addJob( $(this).data('id'));
        })
                   .on('click','[role=updateJob]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.updateJob( $(this).data('id'));
        })
           .on('click','[role=dealWithJob]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.dealWithJob( $(this).data('id'));
        })
        .on('click','[role=insertReceivablesPlan]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.insertReceivablesPlan( $(this).data('id'));
        })
        .on('click', '[role=insertAudit]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.insertAudit( $(this).data('id') );
        })
        // 财务修改发票是否作废
        .on('click', '[role=updateForFinance]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.updateForFinance( $(this).data('id') );
        })
        // 人力行政修改是否为关键人员
        .on('click', '[role=updateForKeyPerson]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.updateForKeyPerson( $(this).data('id') );
        })
        //导出到excel
        .on('click','[role=exportExcel]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.exportExcel( $(this).data('id'));
        })
        //证书补贴
        .on('click','[role=secordInitiate]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.secordInitiate( $(this).data('id'));
        })
        //批量打印
        .on('click','[role=batchPrint]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.batchPrint( $(this).data('id'));
        })
            //excel导入到数据库
        .on('click','[role=importExcel]',function(e){
            e.preventDefault();
            e.stopPropagation();
            Base.importExcel();
        })
        // 修改
        .on('click', '[role=update]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.update( $(this).data('id') );
        })
        // 修改
        .on('click', '[role=updateBillInfo]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.updateBillInfo( $(this).data('id') );
        })
        .on('click', '[role=startWorkFlow]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.startWorkFlow( $(this).data('id') );
        })
        .on('click', '[role=segmentation]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.segmentation( $(this).data('id') );
        })
        .on('click', '[role=startWorkFlowNew]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.startWorkFlowNew( $(this).data('id') );
        })

        .on('click', '[role=doWork]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.doWork( $(this).data('id') );
        })



        .on('click', '[role=asignRole]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.asignRole( $(this).data('id') );
        }) 
        .on('click', '[role=wxdownload]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.wxdownload();
        }) 

        // 删除
        .on('click', '[role=remove]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.remove( $(this).data('id') );
        })
        // 查看
        .on('click', '[role=view]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.view( $(this).data('id') );
        })
        // 查看
        .on('click', '[role=viewByDataId]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.viewByDataId( $(this).data('id') );
        })

        //流程设计查看
        .on('click', '[role=flowdesign]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.flowdesign( $(this).data('id') );
        })

        //流程设计查看
        .on('click', '[role=check]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.check( $(this).data('id') );
        })

        // 返回
        .on('click', '[role=cancel]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.goback();
        })
        // 关闭弹窗
        .on('click', '[role=layerClose]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            App.layerClose();
        })
        // 搜索
        .on('click', '[role=search]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.list(1);
        })
        // 分页
        .on('click', '[data-page]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.list($(this).data('page'));
        })
        // 选择器
        .on('click', '[role=openSelector]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this); 
            var param = encodeURIComponent($this.attr('data-param'));
            Base.openSelector($(this).data('url')+'&param='+param, $this.data('title'), function(arr, index) {
                var val=[], showVal = [];
                for(var i=0,l=arr.length; i<l; i++) {
                    val.push(arr[i].id);
                    showVal.push('<span class="label">'+arr[i].name+'</span>');
                }
                $this.attr('data-param', JSON.stringify(arr));
                //param = encodeURIComponent(JSON.stringify(arr));
                $this.find('.form-control-labels').html(showVal.join(''));
                $this.find('input').val(val.join(','));
                layer.close(index);
                try{  //回调方法2018-2-26 xurun
                    selectorCallback(arr,$this.data('url'),$this);
                }catch(e){}
            });
        }).on('click','[role=viewProjectDetail]',function(e){
              
            e.preventDefault();
            e.stopPropagation();
            var id=$(this).data('id');
//          page_config.view.params.flag=3;

            var title="【查看】项目详情";
//            page_config.view.params.id=id;
//            page_config.view.params.isviewdata="true";
            var params={title: title, flag: 3, mid: 664, id: id, isviewdata: "true"};
            Base.loadContent('ReceivablesContractPlan_view', params, title, page_config.options);
    })
        // 监听查询参数
        .on('input keyup', '[data-params-input]', Base.updateParams)
        .on('input change', '[data-params-input]', Base.updateParams)
        .on('change', '[data-params-select]', Base.updateParams)
        .on('change', '[data-params-select-multiple]', Base.updateParamsMultiple)
        .on('change', '[data-params-checkbox]', Base.updateParamsCheckbox)
        // 双击行
        .on('dblclick', '.tr-view', function(e) {
            e.preventDefault();
            e.stopPropagation();
            Base.view( $(this).data('id') );
        }).on('dblclick', '.tr-viewcustom', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var id=$(this).data('id'),
            time=$(this).data('params');
            page_config.view.params.time=time;
            Base.view(id);
        });
    };

    return {
        init: function() {
            App.init();

            handleDelegate();

            history.push('list');

            this.list(1);
            
            $('body').css("font-size","12px");
        },
        // 获取历史记录长度
        getHistoryLength: function() {
            return history.length
        },
        // 获取已选择记录ID
        getIds: function(el) {
            var arr = [];
            $(el).each(function(index, element) {
                if($(element).prop('checked')) {
                    arr.push(element.value);
                }
            });
            return arr.join(',');
        },
        // 后退，仅清除历史记录，不重新加载数据
        onlyGoback: function() {
            flagV=true; 
            history.pop();
        },
        // 后退
        goback: function() {
            flagV=true; 
            history.pop();
            this.loadIn( page_config[history[history.length-1]] );
        },
        // 载入
        loadIn: function(data) {
            // console.log(data)
            var self = this;
            var index = layer.load();
            $.ajax({
                type: 'post',
                url: data.url,
                data: {
                    jsonParams: JSON.stringify(data.params)
                },
                dataType: 'html',
                cache: false,
                success: function(res) {
                    $('#ajaxList').html(res);
                    self.showCodeGroup();
                    self.toggleActions();
                    App.goTop();
                },
                error: function(xhr) {
                    if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
                },
                complete: function() {
                    layer.close(index);
                }
            });
        },
        loadIn_list: function(data) {
            var self = this;
            var index = layer.load();
            $.ajax({
                type: 'post',
                url: data.url,
                data: {
                    jsonParams: JSON.stringify(data.params)
                },
                dataType: 'html',
                cache: false,
                success: function(res) {
                    $('#ajaxList').html(res);
                    self.showCodeGroup();
                    $pageActions.children().prop('disabled', false);
                    App.goTop();
                },
                error: function(xhr) {
                    if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
                },
                complete: function() {
                    layer.close(index);
                }
            });
        },
        toggleActions: function() {
           if(history[history.length-1] == 'list') {
                //$pageActions.show();
                $pageActions.children().prop('disabled', false);
           }else{
                //$pageActions.hide();
                $pageActions.children().prop('disabled', true);
           }
        },
        // 列表
        list: function(page) {
            if('undefined'==typeof page_config || !history.length) return;
            var key = history[history.length-1];
            if(!!page) page_config[key].params.page = page; 
            this.loadIn(page_config[key]);
        },
        to_list: function(page) {
            if('undefined'==typeof page_config || !history.length) return;
            var key = 'list';
            if(!!page) page_config[key].params.page = page; 
            this.loadIn_list(page_config[key]);
        },
        // 添加
        insert: function() {
            history.push('insert');
            this.loadIn( page_config.insert );
        },
        // 添加
        insertProject: function() {
            history.push('insertProject');
            this.loadIn( page_config.insertProject );
        },
        //赋权
        roleRights:function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }

            page_config.roleRights.params.id = ids;
            history.push('roleRights');  
            this.loadIn( page_config.roleRights );
        },

        asignRole:function(id){
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            } 
            page_config.asignRole.params.id = ids;
            history.push('asignRole');
            this.loadIn( page_config.asignRole );       
        },
        //上传培训成员
        uploadExcelForTrain: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.uploadExcelForTrain.params.id = ids;
            history.push('uploadExcelForTrain');
            this.loadIn( page_config.uploadExcelForTrain );
        },
      //上传本部门绩效
        uploadExcelForAchieve: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.uploadExcelForAchieve.params.id = ids;
            history.push('uploadExcelForAchieve');
            this.loadIn( page_config.uploadExcelForAchieve );
        },
        createCommission: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.createCommission.params.id = ids;
            history.push('createCommission');
            this.loadIn( page_config.createCommission );
        },
        // 查看明细
        referDetail: function(id) {
            if(page_config.referDetail == undefined) return;
            var ids = id || Base.getIds('[name=ids]');
            var title = "查看详情";
            this.loadContent(page_config.referDetail.url, {id:id,"flag":1},title);
        }, 
      //添加可查询合同人员
        addEmpsForContract: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.addEmpsForContract.params.id = ids;
            history.push('addEmpsForContract');
            this.loadIn( page_config.addEmpsForContract );
        },
        //添加可查询合同人员
        insertEmpstaff: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录');
                return;
            }
            page_config.insertEmpstaff.params.id = ids;
            history.push('insertEmpstaff');
            this.loadIn( page_config.insertEmpstaff );
        },
        addTaskorder: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.addTaskorder.params.id = ids;
            history.push('addTaskorder');
            this.loadIn( page_config.addTaskorder );
        },
        addJob: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.addJob.params.id = ids;
            history.push('addJob');
            this.loadIn( page_config.addJob );
        },
                updateJob: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.updateJob.params.id = ids;
            history.push('updateJob');
            this.loadIn( page_config.updateJob );
        },
        dealWithJob: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.dealWithJob.params.id = ids;
            history.push('dealWithJob');
            this.loadIn( page_config.dealWithJob );
        },
        insertReceivablesPlan: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.insertReceivablesPlan.params.id = ids;
            history.push('insertReceivablesPlan');
            this.loadIn( page_config.insertReceivablesPlan );
        },
        insertAudit: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录');
                return;
            }
            page_config.insertAudit.params.id = ids;
            history.push('insertAudit');
            this.loadIn( page_config.insertAudit );
        },
      //财务修改发票是否作废
        updateForFinance:function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.updateForFinance.params.id = ids;
            history.push('updateForFinance');
            this.loadIn( page_config.updateForFinance );
        },
      //人力行政修改是否为关键人员
        updateForKeyPerson:function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.updateForKeyPerson.params.id = ids;
            history.push('updateForKeyPerson');
            this.loadIn( page_config.updateForKeyPerson );
        },
        //证书补贴
        secordInitiate:function(id) {
            var ids = id || Base.getIds('[name=ids]');
            page_config.secordInitiate.params.id = ids;
            history.push('secordInitiate');
            this.loadIn( page_config.secordInitiate );
        },
        // 修改
        update: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.update.params.id = ids;
            history.push('update');
            this.loadIn( page_config.update );
        },
        // 修改
        updateBillInfo: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.updateBillInfo.params.id = ids;
            history.push('updateBillInfo');
            this.loadIn( page_config.updateBillInfo );
        },
        // 业态设置页面跳转基础数据页面
        updateBaseData: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            page_config.updateBaseData.params.id = ids;
            history.push('updateBaseData');
            this.loadIn( page_config.updateBaseData );
        },
     // 修改
        segmentation: function(id) {
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.segmentation.params.id = ids;
            history.push('segmentation');
            this.loadIn( page_config.segmentation );
        },


    
        check: function(id) {
            var self = this,
                ids = id || Base.getIds('[name=ids]');

            if(!ids) {
                layer.alert('请至少选择一条记录',{icon: 7,title:'提示'});
                return;
            }
            page_config.check.params.id = ids; 
            history.push('check');
            this.loadIn( page_config.check);
            //layer.confirm('审核后将不可再修改，确定要审核吗？', function(index){
            //    layer.close(index);
            //    App.ajaxProgress.start();
            //    $.ajax({
            //        type: 'post',
            //      url: page_config.check.url,
            //        data: {
            //            ids: ids
            //        },
            //        dataType: 'json',
            //        success: function(res) {
            //            App.ajaxProgress.stop();
            //          if(res.status==0){
            //              layer.alert(res.statusText,{icon: 2,title:'审核失败'});
            //              self.list();
            //          }else{
            //              layer.msg('数据已成功审核',{icon:6});
            //              self.list();
            //          }
            //        },
            //        error: function(xhr) {
            //            App.ajaxProgress.stop();
            //          if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
            //        }
            //    });
                
            //});
        },


        // 删除 
        remove: function(id) {
            var self = this,
                ids = id || Base.getIds('[name=ids]');

            if(!ids) {
                layer.alert('请至少选择一条记录',{icon: 7, title:'提示'});
                return;
            }
            page_config.remove.params.id = ids; 
            layer.confirm('删除后不可恢复，确定要删除吗？',{icon: 3, title:'提示'}, function(index){
                layer.close(index);
                App.ajaxProgress.start();
                $.ajax({
                    type: 'post',
                    url: page_config.remove.url,
                    data: {
                        ids: ids
                    },
                    dataType: 'json',
                    success: function(res) {
                        App.ajaxProgress.stop();
                        if(res.status==0){
                            layer.alert(res.statusText,{icon: 2,title:'失败'});
                            self.list();
                        }else{
                            if(res.tip!=""){
                                layer.msg(res.tip,{icon:6,title:'删除结果'});
                            }else{
                                layer.msg('数据已成功删除',{icon:6});
                            }
                            self.list();
                        }
                    },
                    error: function(xhr) {
                        App.ajaxProgress.stop();
                        if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText,{icon: 2,title:'错误'});}else{showAjaxLogin();}
                    }
                });
                
            });
        },

        //导出到excel
        exportExcel: function(id){
            var ids = id || Base.getIds('[name=ids]');
            //page_config.exportExcel.params.dataId = ids;
            window.location.href="PubExcel_excelExport?jsonParams={'flag':1,'id':'"+page_config.exportExcel.params.id+"','dataId':'"+ids+"'}"
            //history.push('exportExcel');  
            //this.loadIn( page_config.exportExcel );            
        },
         //批量打印
        batchPrint: function(id){
            var ids = id || Base.getIds('[name=ids]');
            //page_config.exportExcel.params.dataId = ids;
            window.location.href="WkfWork_batchPrintDiv?jsonParams={'ids':'"+ids+"'}"
            //history.push('exportExcel');  
            //this.loadIn( page_config.exportExcel );            
        },
        //excel导入到数据库
        importExcel: function(){           
            history.push('importExcel');  
            this.loadIn( page_config.importExcel );            
        },
  // 微信数据下载 
        wxdownload: function() { 
            layer.confirm('确认要从微信下载近一天的数据？', function(){
                $.ajax({
                    type: 'post',
                    //url: 'PubRoleInfo_delete?ids='+ids,
                    url: page_config.wxdownload.url,
                    dataType: 'json',
                    success: function(res) {
                        if(res.status==0){                          
                            layer.alert(res.statusText,{icon: 2,title:'失败'});
                            self.list();
                        }else{
                            layer.msg('数据下载成功',{icon:6});
                            self.list();
                        }
                    },
                    error: function(xhr) {
                        if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
                    }
                });
                
            });
        },

        // 载入弹出层内容
        loadContent: function(url, params,title, options) { 
            var index = layer.load();

            var defaults = {
                width: $(window).width()-80,
                height: $(window).height()-80
            };
            var opts = $.extend(defaults, options)
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    jsonParams: JSON.stringify(params)
                },
                dataType: 'html',
                cache: false,
                success: function(res) {
                    var idx = layer.open({
                        type: 1,
                        title:title,
                        shadeClose: true,
                        maxmin: true,
                        resize: true,
                        //area: ['820px', '600px'],
                        area: [opts.width+'px', opts.height+'px'],
                        content: res,
                        closeBtn:2,
                        //btn: ['关闭'],
                        success: App.layerSuccess,
                        end: function(obj, index) {
                            App.layerEnd(); 
                            viewStack.pop();
                        }
                    });
                    viewStack.push({
                        title: title,
                        url: url,
                        params: params,
                        index: idx
                    });
                },
                error: function(xhr) {
                    if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
                },
                complete: function(xhr) {
                    layer.close(index);
                }
            });
        },
        /* 这是刷新对话的内容 */
        reloadContent: function(callback) {
            if(!viewStack.length) return; 
            var data = viewStack[viewStack.length-1];
            var index = layer.load();
            $.ajax({
                type: 'post',
                url: data.url,
                data: {
                    jsonParams: JSON.stringify(data.params)
                },
                dataType: 'html',
                cache: false,
                success: function(res) {
                    $('#layui-layer'+data.index).find('.layui-layer-content').html(res);
                    if(typeof(callback) === 'function') {
                        callback()
                    }
                },
                error: function(xhr) {
                    if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText);}else{showAjaxLogin();}
                },
                complete: function(xhr) {
                    layer.close(index);
                }
            });
        },
        // 查看
        view: function(id) {
            if(page_config.view == undefined) return;
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }

            var title = $("#title"+ids).val(); 

            if(title=="" || title==undefined){
                title=page_config.view.params.title;
            }else{
                title="【查看】"+title;
            }
            page_config.view.params.id=ids;

           
            page_config.view.params.isviewdata="true";
            this.loadContent(page_config.view.url, page_config.view.params, title, page_config.options);
        },
            // 查看
        viewByDataId: function(id) {
            
            if(page_config.viewByDataId == undefined) return;
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条记录',{icon: 7,title:'提示'});
                return;
            }

            var title = $("#title"+ids).val(); 

            if(title=="" || title==undefined){
                title=page_config.viewByDataId.params.title;
            }else{
                title="【查看】"+title;
            } 
            this.loadContent(page_config.viewByDataId.url, {id:ids,"flag":1,"isviewdata":"true"}, title, page_config.options);
        },
    //工作办理
        doWork:function(id){
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一项待办工作',{icon: 7,title:'提示'});
                return;
            } 
            

            var defaults = {
                width: $(window).width()-50,
                height: $(window).height()-50
            };
            
             //this.loadContent(page_config.flowdesign.url, {id:ids,"flag":1},page_config.flowdesign.params.title);
            page_config.doWork.params.id = ids;
            /*history.push('flowdesign');
            this.loadIn( page_config.flowdesign );*/

            var title = $("#title"+ids).val(); 
            if(title==""){
                title = page_config.doWork.params.title;
            }else{
                title="【工作办理】"+title;
            }
            var index = layer.open({
                type: 2,
                title: title,
                maxmin: true, //开启最大化最小化按钮
                area: [defaults.width+'px',defaults.height+'px'],
                content: page_config.doWork.url+'?jsonParams='+encodeURIComponent(JSON.stringify(page_config.doWork.params)),
               // btn: ['保存', '关闭'],
                success: App.layerSuccess,
                end: App.layerEnd
            });
        },


    //启动审批流
        startWorkFlow:function(id){
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条流程',{icon: 7,title:'提示'});
                return;
            }
            //this.loadContent(page_config.flowdesign.url, {id:ids,"flag":1},page_config.flowdesign.params.title);
            page_config.startWorkFlow.params.id = ids;
            /*history.push('flowdesign');
            this.loadIn( page_config.flowdesign );*/


            var defaults = {
                width: $(window).width()-50,
                height: $(window).height()-50
            };

            var title = $("#title"+ids).val();  
            if(title=="" || title==undefined){
                title = page_config.startWorkFlow.params.title;
            }else{
                title="【启动审批流】"+title;
            }
            var index = layer.open({
                type: 2,
                title:title,
                area: [defaults.width+'px', defaults.height+'px'],
                content: page_config.startWorkFlow.url+'&jsonParams='+encodeURIComponent(JSON.stringify(page_config.startWorkFlow.params)),
               // btn: ['保存', '关闭'],
                success: App.layerSuccess,
                maxmin: true, //开启最大化最小化按钮
                end: App.layerEnd
            });
        },



    //启动工作流
        startWorkFlowNew:function(id){
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条表单',{icon: 7,title:'提示'});
                return;
            }
            //this.loadContent(page_config.flowdesign.url, {id:ids,"flag":1},page_config.flowdesign.params.title);
            page_config.startWorkFlowNew.params.flowId = ids;
            /*history.push('flowdesign');
            this.loadIn( page_config.flowdesign );*/


          var defaults = {
                width: $(window).width()-50,
                height: $(window).height()-50
            };

            var title = $("#title"+ids).val(); 
            if(title=="" || title==undefined){
                title = page_config.startWorkFlowNew.params.title;
            }else{
                title="【启动工作流】"+title;
            } 

            var index = layer.open({
                type: 2,
                title: title,
                maxmin: true, //开启最大化最小化按钮
                area: [defaults.width+'px',defaults.height+'px'],
                content: page_config.startWorkFlowNew.url+'&jsonParams='+encodeURIComponent(JSON.stringify(page_config.startWorkFlowNew.params)),
               // btn: ['保存', '关闭'],
                success: App.layerSuccess,
                end: App.layerEnd
            });
        },


        //流程设计与查看
        flowdesign:function(id) {
            if(page_config.view == undefined) return;
            var ids = id || Base.getIds('[name=ids]');
            if(!ids) {
                layer.alert('请选择一条流程',{icon: 7,title:'提示'});
                return;
            }


            var defaults = {
                width: $(window).width()-10,
                height: $(window).height()-10
            };

            //this.loadContent(page_config.flowdesign.url, {id:ids,"flag":1},page_config.flowdesign.params.title);
            page_config.flowdesign.params.id = ids;
            /*history.push('flowdesign');
            this.loadIn( page_config.flowdesign );*/
            var index = layer.open({
                type: 2,
                title: false,
                //shadeClose: true,
                area: [defaults.width+'px', defaults.height+'px'],
                content: page_config.flowdesign.url+'?jsonParams='+encodeURIComponent(JSON.stringify(page_config.flowdesign.params)),
                btn: false,
                closeBtn: 0,
                success: App.layerSuccess,
                end: App.layerEnd
            });
        },

        // 解析代码组
        showCodeGroup: function() {
            $('span[data-status]').each(function() {
                var $this = $(this);
                if($this.data('init')) return true;
                $this.data('init', 1);
                $this.html( App.getCodeGroupName( $this.attr('data-group'), $this.attr('data-status')) );
            });
        },
        // 按钮
        showListButtons: function() {
            $('[data-operate-btns]').each(function() {
                var $this = $(this), str = '';
                if($this.attr('data-operate-btns') != '') {
                    str = $this.attr('data-operate-btns');
                }else{
                    str = operate_btns;
                }
                if(str!='') {
                    var btnCode = str.split(','), btns=[], temp=[];
                    for(var i=0,l=btnCode.length; i<l; i++) {
                        temp = btnCode[i].split('_');
                        btns.push('<button class="btn btn-sm btn-default" type="button" data-id="'+$this.data('operateId')+'" role="'+temp[0]+'" title="'+temp[1]+'">');
                        if(!!temp[2]) {
                            btns.push('<i class="fa fa-fw '+temp[2]+'"></i>');
                        }
                        btns.push('</button>');
                    }
                    $this.html(btns.join('')+$this.html());
                }
            });
        },
        // 更新参数
        updateParams: function(e) {
            e.stopPropagation();
            if(history.length) {
                var $this = $(this);
                var key = history[history.length-1];
                page_config[key]['params'][this.name] = this.value;
                if($this.data('change'))
                    Base.list(1);
            }
        },
        updateParamsMultiple: function(e) {
            e.stopPropagation();
            if(history.length) {
                var $this = $(this);
                var key = history[history.length-1];
                if($this.val()){
                    page_config[key]['params'][this.name] = $this.val().join(",");
                }
                if($this.data('change'))
                    Base.list(1);
            }
        },
        updateParamsCheckbox: function(e) {
            e.stopPropagation();
            if(history.length) {
                var $this = $(this);
                var key = history[history.length-1];
                page_config[key]['params'][this.name] = $this.prop('checked') ? this.value : '';
                if($this.data('change'))
                    Base.list(1);
            }
        },
        // 打开选择器
        openSelector: function(url,title, callback) {
            layer.open({
                type: 2,
                title:title,
                area: ['900px', '580px'],
                maxmin: true, //开启最大化最小化按钮
                content: url,
                success: App.layerSuccess,
                end: App.layerEnd,
                closeBtn:2,
                btn: ['确认选择', '取消'],
                yes: function(index, layero) {
                    var v = document.getElementById('layui-layer-iframe'+index).contentWindow.returnValue();
                    callback.call(this, v, index);
                }
            });
        },
        // 打开一Iframe弹出层
        openLayerIframe: function(url) {
            layer.open({
                type: 2,skin: 'layui-layer-demo', //样式类名
                title: '数据选择',
                area: ['820px', '480px'],
                content: url,  shadeClose: true,

                success: App.layerSuccess,
                end: App.layerEnd
            });
            /*$.ajax({
                type: 'post',
                url: url,
                dataType: 'html',
                cache: false,
                success: function(res) {
                    layer.open({
                        type: 1,
                        title: '查看',
                        area: ['820px', '600px'],
                        content: res,
                        success: App.layerSuccess,
                        end: App.layerEnd
                    });
                },
                error: function(xhr) {
                    layer.alert(xhr.status+', '+xhr.statusText);
                }
            });*/
        },
        selector: function(el) {
            var arr = [];
            $(el).each(function(){
                var $this = $(this);
                arr.push($this.data('data'));
            });
        },
        // 管理员强制撤回流程
        adminforceCallBack: function(id) {
            var self = this,
                ids = id || Base.getIds('[name=ids]');

            if(!ids) {
                layer.alert('请至少选择一条记录',{icon: 7, title:'提示'});
                return;
            }
            page_config.adminforceCallBack.params.id = ids; 
            layer.confirm('流程强制撤回后不可恢复，确定要撤回吗？',{icon: 3, title:'提示'}, function(index){
                layer.close(index);
                App.ajaxProgress.start();
                $.ajax({
                    type: 'post',
                    url: page_config.adminforceCallBack.url,
                    data: {
                        id: ids
                    },
                    dataType: 'json',
                    success: function(res) {
                        App.ajaxProgress.stop();
                        if(res.status==0){
                            layer.alert(res.statusText,{icon: 2,title:'失败'});
                            self.list();
                        }else{
                            if(res.tip!=""){
                                layer.msg(res.tip,{icon:6,title:'删除结果'});
                            }else{
                                layer.msg('流程已删除',{icon:6});
                            }
                            self.list();
                        }
                    },
                    error: function(xhr) {
                        App.ajaxProgress.stop();
                        if(xhr.responseText.indexOf("showAjaxLogin")==-1){layer.alert(xhr.responseText,{icon: 2,title:'错误'});}else{showAjaxLogin();}
                    }
                });
                
            });
        },
    }
}();


$(function(){
    Base.init();
});
var custom=function(){
    return {// 载入弹出层内容
        loadUpload: function(params) { 
//            var indexLoad = layer.load();

            var defaults = {
                width: $(window).width()-60,
                height: $(window).height()-60
            };

                    var idx = layer.open({
                        type: 2,
                        title:params.title,
                        shadeClose: true,
                        maxmin: true,
                        resize: true,
//                        area: ['820px', '600px'],
                        area: [defaults.width+'px', defaults.height+'px'],
                        content: params.url+"?id="+params.id+"&action="+params.action+"&jsonParams="+params.params,
                        end:function(){
                            var data=$("#fileJson").text();
                            params.callback.auto(data);
                            layer.close(idx);
                        }
                    });

        }
    }
}();
function uploadfile(data) {

    var title = "上传附件"; 
    
    data.title=title;
    custom.loadUpload(data);

}
//$(document).on('click','[role=uploadfile]',function(e){
//  e.preventDefault();
//    e.stopPropagation();
//    var id=$(this).data('id'),
//        action=$(this).data('action'),
//        params=$(this).data('params'),
//        url='PubUploadFile_view';
//    var data={id:id,action:action,url:url,params:params};
//    uploadfile(data);
//});
function onclickUpload(e){
    e.preventDefault();
    e.stopPropagation();
    var data=e.data;
    if(data){
        uploadfile(data);
    }else{
        var id=$(this).data('id'),
        action=$(this).data('action'),
        params=$(this).data('params'),
        url='PubUploadFile_view';
        data={id:id,action:action,url:url,params:params,callback:{auto:function(data){
//          console.log(data);
            var zDatas = new Array();
            // 将json转为数组
            if (data != null && data != '') {
                zDatas = eval('(' + data + ')');
            }
            var thHtml="<tr><th>选择文件</th><th>文件类型</th><th style='width:70px;'>操作</th></tr>";
            var trHtml="";
            for(var i=0;i<zDatas.length;i++){
                trHtml+="<tr>" +
                        "<td>" +
                        "<a href='FinContract_downLoad?id="+zDatas[i].jsid+"'>"+zDatas[i].filename+zDatas[i].attachmentsuffix+"</a>";
                          if(zDatas[i].showpreview){
                              trHtml+= "<a class='a_hover' href='#' "
                                 +"onclick=javascript:previewAttachement('"+zDatas[i].jsid+"'," +
                                 "'"+zDatas[i].attachmentsuffix+"','"+zDatas[i].fullpath+"'," +
                                 "'"+zDatas[i].filename+zDatas[i].attachmentsuffix+"')>"
                                +"[预览]</a>";
                          } 
                         
                trHtml+="</td>" +
                        "<td><span data-status='"+zDatas[i].filetype+"' data-group='empfiletype'></td>" +
                        "<td><i class='fa fa-fw fa-close' style='cursor: pointer;' " +
                        "onclick=deleteFinFileForEmp('"+zDatas[i].jsid+"',this) title='删除'></i></td>" +
                        "</tr>";
            }//for
            if(trHtml){
                $("#fileHead").empty();
                $("#fileHead").append(thHtml);
                $("#fileBody").empty();
//              console.log(trHtml);
                $("#fileBody").append(trHtml);
                 Base.showCodeGroup();
            }
        
          }//auto
         }//callback
        };//data
        uploadfile(data);
    }
}
function toNewUrl(url){
    if(!flagV){
    layer.confirm('数据未保存是否要离开？', {
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