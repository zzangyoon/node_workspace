/* 5. http 모듈로 웹서버 구축하기 */
var http = require("http");
var fs = require("fs"); //File System 모듈 (파일을 읽거나 쓸 수 있는 모듈)


//서버는 클라이언트의 요청이 들어오면, 반드시 응답을 해야한다 > http 메커니즘
//만약 응답을 안하면? 클라이언트가 서버의 응답을 무한정 기다리므로 무한대기상태에 빠진다
//서버객체를 생성
//서버 객체 생성시, 요청정보와 응답정보를 구성할 수 있는 request, response 객체가 매개변수로 전달될 수 있다
var server = http.createServer(function(request, response){
    //request 객체로는 클라이언트의 요청 정보를 처리할 수 있고,
    //response 객체로는 클라이언트에게 전송할 응답 정보를 구성할 수 있다
    console.log("클라이언트의 요청을 받았습니다");

    //컨텐츠 전송(클라이언트의 브라우저가 받게될 내용)
    //HTTP 상태코드 중 200은 정상처리를 의미한다(즉, 서버에서 클라이언트의 요청을 정상적으로 처리했다는 상태코드)
    //누가 정한건가? W3C 표준에 의해 정해진 것이다
    //참고로 500은 심각한 서버의 에러, 404는 요청한 자원을 찾을 수 없을때
    var tag="";
    response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});   //편지봉투 구성하기!!
    /*
    tag+="<html>";
    tag+="<head>";
    tag+="</head>";
    tag+="<body>";
    tag+="<input type=\"text\" />";
    tag+="<button>가입</button>";
    tag+="</body>";
    tag+="</html>";
    */

    //서버에 있는 파일을 읽어들여 클라이언트에게 전송한다!!!
    
    fs.readFile("./회원폼유효성체크.html", "utf-8", function(error, data){
        response.end(data); //클라이언트에게 응답정보 전송
    });
    

    //이미지를 클라이언트에게 보내되, 파일을 읽어서 처리해보기
    //참고로 이미지의 경우 content-type은 image/png, image/jpeg, image/gif 등이다
    /*
    response.writeHead(200, {"Content-Type":"image/png;"});     //편지봉투 구성
    fs.readFile("../images/nation/1.png", function(error, data){
        response.end(data);
    });
    */

});

//접속자를 감지
/*
server.on("connection", function(){
    console.log("접속자 감지");
})
*/


//서버가동
/*
모든 네트워크 프로그램은 포트번호가 있어야 한다
왜? 하나의 os 내에서 수많은 네트워크 프로그램들간 엉키지 않기 위해...
ex) 오라클 1521 포트, mysql 3306 포트
*/
server.listen(7777, function(){
    console.log("Server is running at 7777 port...");
});