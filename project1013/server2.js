/* 2. 웹서버 구축하기 */
var http = require("http");
var url = require("url");   //내장모듈
var mysql = require("mysql");   //외부모듈
var fs = require("fs");     //file system 내장모듈

var con;    //접속 성공시 그 정보를 보유한 객체, 이 객체가 있어야 접속된 상태에서 쿼리문을 수행할 수 있다

//서버객체 생성
var server = http.createServer(function(request, response){

    //클라이언트가 원하는 것이 무엇인지를 구분하기 위한 url 분석
    console.log("클라이언트의 요청 url ", request.url); //한줄로 되어있다 즉, 구분을 못한다
    //섞여있는 url을 분석(parsing)하기 위해서는 전담 모듈을 이용하자!!! url 내장모듈
    var parseObj = url.parse(request.url, true);     //분석시작
    //분석시, true를 매개변수로 전달하면, 파라미터들을 {json}으로 묶어준다
    //장점? json은 객체표기법으로, 데이터들을 .점찍고 마치 객체다루듯 접근할 수 있기 때문에 직관성이 높아진다
    //즉, 다루기 쉬워진다 (배열보다 낫다)
    console.log("url 분석결과 : ", parseObj);

    response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
    if(parseObj.pathname=="/member/registForm"){    //회원가입 양식디자인 폼을 원하면...
    fs.readFile("./registForm.html", "utf-8", function(error, data){
        if(error){
            console.log("읽기 실패", error);
        }else{
            response.end(data);     //html 파일을 읽어들인 결과문자열을 클라이언트의 응답정보로 저장
        }
    });

    }else if(parseObj.pathname=="/member/regist"){    //회원가입을 원하면...(내가 지어낸 것 : /member/regist)
        //mysql에 insert 할 예정
        //response.end("회원등록을 합니다");
        //클라이언트의 브라우저에서 전송되어온 파라미터(변수)들을 받아보자
        var param = parseObj.query;     //파라미터를 보유한 json 객체

        var sql = "insert into member2(uid, password, uname, phone, email, receive, addr, memo)";
        sql+="values(?,?,?,?,?,?,?,?)";     //바인드 변수를 이용

        con.query(sql, [param.uid, 
                param.password, 
                param.uname, 
                param.phone, 
                param.email, 
                param.receive, 
                param.addr, 
                param.memo
        ], function(error, result, fields){
            if(error){
                console.log("등록 실패", error);
            }else{
                var msg="<script>";
                msg+="alert('가입성공');";
                msg+="location.href='/member/list';";   //<a href="">동일
                // /member/list 로 재접속(클라이언트가 지정한 주소로 재접속함)
                msg+="</script>";

                response.end(msg);      //응답정보 구성
            }

        });     //쿼리수행

    
    }else if(parseObj.pathname=="/member/list"){ //회원목록을 원하면...
        //mysql에 select 할 예정
        var sql="select * from member2";
        con.query(sql, function(error, record, fields){
            if(error){
                console.log("가져오기 실패", error);
            }else{
                var tag="<table border='1px' width='80%'>";
                tag+="<tr>";
                tag+="<td>member2_id</td>";
                tag+="<td>uid</td>";
                tag+="<td>password</td>";
                tag+="<td>uname</td>";
                tag+="<td>phone</td>";
                tag+="<td>email</td>";
                tag+="<td>receive</td>";
                tag+="<td>addr</td>";
                tag+="<td>memo</td>";
                tag+="</tr>";

                console.log("select문의 결과 record: ", record);
                for(var i=0; i<record.length; i++){
                    var json = record[i];   //배열의 각 요소마다 회원정보 json 추출
                    tag+="<tr>";
                    tag+="<td>"+json.member2_id+"</td>";
                    tag+="<td>"+json.uid+"</td>";
                    tag+="<td>"+json.password+"</td>";
                    tag+="<td>"+json.uname+"</td>";
                    tag+="<td>"+json.phone+"</td>";
                    tag+="<td>"+json.email+"</td>";
                    tag+="<td>"+json.receive+"</td>";
                    tag+="<td>"+json.addr+"</td>";
                    tag+="<td>"+json.memo+"</td>";
                    tag+="</tr>";
                }
                tag+="</table>";
                response.end(tag);
            }
        });

        //response.end("회원목록을 가져옵니다");
    }else if(parseObj.pathname=="/member/del"){  //회원탈퇴를 원하면...
        response.end("회원을 삭제합니다");
    }else if(parseObj.pathname=="/member/edit"){ //회원수정을 원하면...
        response.end("회원정보를 수정합니다");
    }
});

//mysql 접속
function connectDB(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}


//서버 가동
server.listen(9999, function(){
    console.log("Web Server is running at port 9999...");
    connectDB();
});
