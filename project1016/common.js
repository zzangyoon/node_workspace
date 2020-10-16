/*
프로그램 개발시 전반적으로 사용될 공통 기능을 .js로 정의해놓자
특히 node.js 에서는 이러한 자바스트립트 라이브러리를 가리켜 모듈이라 한다
[사용자 정의 모듈]
*/

//메시지 출력후 URL 재접속  (재사용위해 모듈(라이브러리)로 뺴기)
exports.getMsgURL = function(msg, url){
    var tag = "<script>";
    tag += "alert('"+msg+"');";
    tag += "location.href='"+url+"';";
    tag += "</script>";

    return tag;
}