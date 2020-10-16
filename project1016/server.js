/*
기존의 http 모듈만으로 구축했던 서버에는 기능상 부족한 점이 많다
문제점 1) 이미지와 같은 정적 파일에 대한 요청 처리가 미비
해결책) http 모듈은 아주 기본적인 서버구축 모듈이므로 이보다 기능을 보강한 모듈로 확장해보자

           http > connect모듈 (http 보완)   >   express모듈 (connect 보완)
*/
var http = require("http");
var fs = require("fs");
var express = require("express");   //http보다 훨씬 더 많은 기능이 보강된 모듈
var static = require("serve-static");   //정적 자원 처리 전담 미들웨어
var mysql = require("mysql");
var ejs = require("ejs");
var common = require("./common.js");

let conStr={
    url:"localhost",
    user:"root",
    password:"1234",
    database:"node"
};
let con;

//express 모듈은 미들웨어라 불리는 함수를 이용하여 기존의 http모듈로는 할 수 없었던
//추가된 기능들을 지원한다 (express 필수라고 봐야 한다)
//참고로 미들웨어는 express 객체의 use() 메서드로 지정할 수 있다
//app.use(사용할 미들웨어);
//오늘 사용할 미들웨어는 static 미들웨어이다 (static은 '정적인'의 의미) 
//전산분야에서 정적이라는 뜻은, 프로그래밍언어처럼 실행시 변경이 가능한 것이 아니라, 고정되어 있는 형태를 의미
//html, images, css파일 프로그래밍 언어가 아니므로 실행타임에 변경이 불가하다
//그래서 자바스크립트와 같은 프로그래밍 언어가 정적으로 제어하기 위해 등장한다
var app = express();    //express 객체생성
//__dirname, __filename (현재 실행중인 node.js 파일의 경로를 반환해준다)
//console.log("현재 실행중인 파일의 디렉토리 경로 : ", __dirname);
app.use(static(__dirname+"/static"));      //정적 자원의 위치를 등록!!!

//form양식으로 전송될때 처리
app.use(express.urlencoded({
    extended:true
}));

//app.use(express.json());    //파라미터를 json 형식으로 받고싶을때 사용할 미들웨어


//요청, 응답을 use() 메서드로 처리해야 한다
//post(매개변수1, 매개변수2) 메서드 매개변수가 2개
//매개변수1 : 요청 URI, 매개변수2 : 처리할 함수
app.post("/notice/regist", function(request, response){
    //response.end("your http method is post");
    //post 방식의 파라미터 3개 받기 (request.body)

    var title = request.body.title;
    var writer = request.body.writer;
    var content = request.body.content;

    console.log("당신이 보낸 제목은 ", title);
    console.log("당신이 보낸 작성자는 ", writer);
    console.log("당신이 보낸 내용은 ", content);

    // mysql에 보내기
    var sql = "insert into notice(title, writer, content)";
    sql += " values(?, ?, ?)";

    con.query(sql, [title, writer, content], function(error, fields){
        if(error){
            console.log("insert 실패", error);
        }else{
            response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
            response.end(common.getMsgURL("등록성공", "/notice/list"));
        }
    });
});

// 목록 가져오기
app.get("/notice/list", function(request, response){
    var sql="select * from notice order by notice_id desc"; //내림차순

    con.query(sql, function(error, record, fields){
        if(error){
            console.log("list error", error);
        }else{
            fs.readFile("./list.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("list.ejs 읽기실패", err);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        noticeArray: record
                    }));            
                }
            });
        }
    });
});

//한건 가져오기 (상세보기)
app.get("/notice/detail", function(request, response){

    //get 방식의 파라미터 받기(request.query)
    var notice_id = request.query.notice_id;
    var sql = "select * from notice where notice_id="+notice_id;  //= 넘어온 id
    con.query(sql, [notice_id], function(error, record, fields){
        if(error){
            console.log("select error", error);
        }else{
            fs.readFile("./detail.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("detail.ejs reading error", err);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                    response.end(ejs.render(data, {
                        notice:record[0]    // 한 건
                    }));
                }
            });
        }
    });
    
    //response.end(sql);

});

//한건 삭제
app.post("/notice/del", function(request, response){
    //파라미터 받기(post 방식)
    var notice_id = request.body.notice_id;
    var sql = "delete from notice where notice_id=?";   //바인드변수 사용

    con.query(sql, [notice_id], function(error, fields){
        if(error){
            console.log("delete fail ", error);
        }else{
            //메시지 출력후, list 요청
            response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            response.end(common.getMsgURL("삭제 성공", "/notice/list"));
        }
    });

});

//수정 > 수정성공 한 후 상세보기로 돌아가기


/*재사용위해 모듈(라이브러리)로 뺴기
//메시지 출력후 URL 재접속 
function getMsgURL(msg, url){
    var tag = "<script>";
    tag += "alert('"+msg+"');";
    tag += "location.href='"+url+"';";
    tag += "</script>";

    return tag;
}
*/

//데이터베이스 접속
function connect(){
    con = mysql.createConnection(conStr);
}

var server = http.createServer(app);    //express 모듈을 이용한 서버!
server.listen(8888, function(){
    console.log("Server using express is running at port 8888...");
    connect();
});



