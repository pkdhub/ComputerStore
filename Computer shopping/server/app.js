//功能:服务器程序
//1:引入四个模块
const express = require("express"); //web服务器模块
const mysql = require("mysql");//mysql模块
const session = require("express-session");//session模块
const cors = require("cors");//跨域
//2:创建连接池
var pool = mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"xz",
    port:3306,
    connectionLimit:15
})
//3:创建web服务器
var server = express();
//4:配置跨域模块
//4.1:允许程序列表 脚手架
//4.2:每次请求验证
server.use(cors({
    origin:["http://127.0.0.1:8080","http://localhost:8080"],
    credentials:true 
}))
//5:指定静态资源目录 public
server.use(express.static("public"));
//6:配置session对象
server.use(session({
    secret:"128位安全字符串",//加密条件
    resave:true,//每次请求更新数据
    saveUninitialized:true,//保存初始化数据
}));
//7:为服务器绑定监听端口 4000
server.listen(4000);
console.log("服务器起动.......");

//功能一:用户登录验证
server.get("/login",(req,res)=>{
  //1:获取脚手架传递用户名和密码
  var u = req.query.uname;
  var p = req.query.upwd;
  //2:创建sql语法并且将用户名和密码加入
  var sql = "SELECT id FROM xz_login WHERE uname=? AND upwd=md5(?)";
  //3:执行sql语法并且获取返回结果
  pool.query(sql,[u,p],(err,result)=>{
     //3.1:如果出现严重错误抛出  
     if(err)throw err;
     //3.2:如果result.length长度为0,表示登录失败
     if(result.length==0){
         res.send({code:-1,msg:"用户名或密码有误"});
     }else{
         //登录成功
         //如果用户登录成功:创建session对象并且将登录凭证uid
         //保存对象中    result=[{id:1}]
         //将当前登录用户id保存session对象中作业:登录凭证
         req.session.uid = result[0].id;
         res.send({code:1,msg:"登录成功"})
     }
  });
})


//注册
server.get("/Register",(req,res)=>{
        var uname=req.query.uname
        var upwd=req.query.upwd
        var upwd1=req.query.upwd1
        if(!uname){
            res.send({code:-1,msg:"用户名不能为空"})
            return;
        }
        if(!upwd){
            res.send({code:-1,msg:"密码不能为空"})
            return;
        }
        
    var sql="select id from xz_login where uname=?"
    pool.query(sql,uname,(err,result)=>{
        if(err){
            throw err
        }
        if(result.length>0){
            res.send({code:403,msg:"用户名已经存在"})
        }else{
            if(upwd!==upwd1){
            res.send({code:404,msg:"两次输入的密码不一致"})
            }else{
                var sql="insert into xz_login values(NULL,?,md5(?))"
                pool.query(sql,[uname,upwd],(err,result)=>{
                    if(err){
                        throw err
                    }
                    res.send({code:1,msg:'注册成功'})
                })
            }
        }
    })

})


//功能二:显示商品列表-(分页)
//1:GET /product 
server.get("/product",(req,res)=>{
//2:接收参数 页码 一页几行
var pno = req.query.pno;
var ps = req.query.pageSize;
//3:为参数设置默认值  1   20
if(!pno){pno=1}
if(!ps){ps=20}
//4:创建sql语句分页查询商品列表
var sql = "SELECT lid,lname,price,pic FROM xz_laptop LIMIT ?,?";
var offset = (pno-1)*ps;
ps = parseInt(ps);
//5:执行sql语句并且将结果发送脚手架
pool.query(sql,[offset,ps],(err,result)=>{
    if(err)throw err;
    res.send({code:1,msg:"查询成功",data:result})
})
})





//功能三:将商品添加至购物车
server.get("/addcart",(req,res)=>{
  //1:获取当前登录用户凭证
  var uid = req.session.uid;
  //2:如果当前用户没有登录凭证  输出请登录
  if(!uid){
      res.send({code:-2,msg:"请登录"});
      return;
  }
  //3:获取脚手架传递数据 lid,lname,price
  var lid = req.query.lid;
  var lname = req.query.lname;
  var price = req.query.price;
  var pic = req.query.pic;
  //4:创建sql语句 查询当前用户是否购买过此商品
  var sql = "SELECT id FROM xz_cart WHERE uid=? AND lid=?";
  //5:执行sql语句
  pool.query(sql,[uid,lid],(err,result)=>{
  //6:在回调函数(钩子函数)
  if(err)throw err;
  //7:获取查询结果[判断是否购买过此商品]
  if(result.length==0){
  //8:如果没买过此商品 创建INSERT SQL
  var sql = `INSERT INTO xz_cart VALUES(null,${lid},'${lname}',${price},1,${uid},'${pic}')`; 
}else{
  //9:如果己购买过此商品 创建UPDATE SQL
  var sql = `UPDATE xz_cart SET count=count+1 WHERE uid=${uid} AND lid=${lid}`;
  }
  //10:执行sql
  //11:返回结果脚手架
  pool.query(sql,(err,result)=>{
      if(err)throw err;
      res.send({code:1,msg:"添加成功"})
  })
})//select end


})


//功能四:查询指定用户购物车列表
server.get("/findcart",(req,res)=>{
  //1:获取用户登录凭证uid
  var uid = req.session.uid;
  //2:没有uid表示此用户未登录 发送请登录信息
  if(!uid){
      res.send({code:-2,msg:"请登录",data:[]});
      return;
  }
  //3:创建sql语句
  var sql = "SELECT id,lid,lname,price,count,pic FROM xz_cart WHERE uid=?";
  //4:发送sql语句并且将查询结果返回脚手架
  pool.query(sql,[uid],(err,result)=>{
      if(err)throw err;
      res.send({code:1,msg:"查询成功",data:result});
  })
});




//功能五:删除购物车中一条商品信息
server.get("/del",(req,res)=>{
  //1:获取用户登录凭证
  var uid = req.session.uid;
  //2:如果没有登录凭证 请登录
  if(!uid){
     res.send({code:-2,msg:"请登录"});
     return;
  }
  //3:获取脚手架传递数据 id
  var id = req.query.id;
  //4:创建sql依据id删除数据
  var sql = `DELETE FROM xz_cart WHERE id IN (${id}) AND uid=?`;
//    console.log(sql)
  //5:执行sql语句获取返回结果
  pool.query(sql,uid,(err,result)=>{
       if(err)throw err;
       //判断删除是否成功 affectedRows 影响行数
       if(result.affectedRows>0){
           res.send({code:1,msg:"删除成功"});
       }else{
           res.send({code:-1,msg:"删除失败"});
       }
  });
  //6:将结果返回脚手架
})







