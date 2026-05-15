console.log(111)
let cookieString = document.cookie
//console.log('cookieString',cookieString)
// 解析 cookie 字符串
var cookies = cookieString.split(';');

// 查找并提取 userCompanyType 的值
var userCompanyType;
for (var i = 0; i < cookies.length; i++) {
  var cookie = cookies[i].trim();
  if (cookie.startsWith('userCompanyType=')) {
    userCompanyType = cookie.substring('userCompanyType='.length);
    console.log(userCompanyType)
    break;
  }
}
if(userCompanyType==1){
    document.querySelector('.page-title-fixed ~ .main-content').style.background = 'none';
}