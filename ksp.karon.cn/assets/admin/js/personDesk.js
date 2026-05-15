/**
 * 证件超期检查
 */
var CertificateCheck = {
    /**
     * 检查当前人员是否有超期证件
     */
    checkExpiredCertificates: function() {
        $.ajax({
            type: 'post',
            url: 'HrCertificateRegister_checkExpired',
            dataType: 'json',
            success: function(res) {
                if(res.status == '1') {
                    // 查询成功
                    var expiredList = res.data;
                    if(expiredList && expiredList.length > 0) {
                        
                        
                        // 构建提示消息
                        var message = '';
                        
                        // 遍历超期证件列表
                        for(var i = 0; i < expiredList.length; i++) {
                            var cert = expiredList[i];
                            // 获取提示次数
                            var count = cert.count || 0;
                            
                            // 根据提示次数确定标题和图标
                            var title = '证件超期提醒';
                            var icon = 0; // 默认提示图标
                            
                            if(count > 6) {
                                title = '【紧急】证件超期提醒';
                                icon = 2; // 警告图标
                            } else if(count > 2) {
                                title = '【重要】证件超期提醒';
                                icon = 0;
                            }
                            var certName = cert.qualificationname || '未知证书';
                            var endDate = cert.endDate || '未知日期';
                            
                            // 根据提示次数显示不同的提示语
                            if(count > 6) {
                                // 超过第6次：紧急提示
                                message += '• <strong style="color: #ff0000;">请立即更新【 ' + certName + '】</strong><br/>';
                                message += '&nbsp;&nbsp;&nbsp;&nbsp;有效期至：' + endDate + '<br/><br/>';
                            } else if(count > 2) {
                                // 超过第2次：重要提示
                                message += '• <strong style="color: #ff6600;">请尽快更新 【' + certName + '】</strong><br/>';
                                message += '&nbsp;&nbsp;&nbsp;&nbsp;有效期至：' + endDate + '<br/>';
                                message += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ff6600;">如未及时更新，下次登录账号将无法办理其他业务。</span><br/><br/>';
                            } else {
                                // 第1-2次：普通提示
                                message += '• 请尽快更新 【' + certName + '】<br/>';
                                message += '&nbsp;&nbsp;&nbsp;&nbsp;有效期至：' + endDate + '<br/><br/>';
                            }
                            // 添加底部提示
                            if(count > 6) {
                                message += '<div style="color: #ff0000; font-weight: bold; margin-top: 10px;">⚠ 请立即在【人事管理】-【证件信息】中点击续签，以免影响办公账号使用！如有问题请联系人力行政中心。</div>';
                            } else if(count > 2) {
                                message += '<div style="color: #ff6600; margin-top: 10px;">⚠ 请尽快在【人事管理】-【证件信息】中点击续签，以免影响办公账号使用！如有问题请联系人力行政中心。</div>';
                            } else {
                                message += '<div style="margin-top: 10px;">请尽快在【人事管理】-【证件信息】中点击续签。如有问题请联系人力行政中心。</div>';
                            }
                        }
                        
                        
                        
                        // 使用layer弹窗提示
                        layer.alert(message, {
                            title: title,
                            icon: icon,
                            skin: 'layer-ext-moon',
                            area: ['500px', 'auto']
                        });
                    }
                } else {
                    // 查询失败
                    console.error('查询超期证件失败：' + res.statusText);
                }
            },
            error: function(xhr) {
                console.error('查询超期证件异常：' + xhr.status + ', ' + xhr.statusText);
            }
        });
    }
};

/**
 * 页面加载完成后自动检查超期证件
 */
 $(document).ready(function() {
     // 自动检查超期证件（可选，如果需要页面加载时自动检查）
      CertificateCheck.checkExpiredCertificates();
 });

