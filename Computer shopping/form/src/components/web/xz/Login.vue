<template>
    <div class="pic">
        <h3>请您登陆</h3>
        <!--添加二个输入框 用户名和密码-->
        <mt-field label="用户名:" placeholder="请输入用户名" v-model="uname"></mt-field>
        <mt-field label="密码:" placeholder="请输入密码" v-model="upwd"></mt-field>
        <!--添加一个登录按钮-->
        <div class='login'>
        <mt-button type="primary" size="large" @click="login"
        >登录</mt-button>
         <mt-button type="primary" size="large" @click="register"
        >注册</mt-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            uname:"",
            upwd:""
        }
    },
    methods:{
        login(){
           //功能:完成用户登录   15:51
           //1:创建正则表达式用于验证用户名和密码
           //  字母和数字 3~12
           var reg = /^[a-z0-9]{3,12}$/i;
           //2:获取用户名和密码
           var u = this.uname;
           var p = this.upwd;
           //console.log(u+"_"+p);
           //3:验证用户名如果格式不正确,提示错误信息
           if(!reg.test(u)){
             this.$messagebox("消息","用户名格式不正确");
             return;//停止程序运行
           }
           //4:验证用户密码如果格式不正确，提示错误信息
           if(!reg.test(p)){
             this.$messagebox("消息","密码格式不正确");
             return;//停止程序运行  
           }
           //console.log(3);
           //5:创建url变量,保存请求服务器地址
           var url = "login";
           //6:创建obj变量,保存请求时参数
           var obj = {uname:u,upwd:p};
           //7:发送ajax请求
           this.axios.get(url,{params:obj}).then(res=>{
              //8:接收服务器返回结果
              //9:如果-1  提示用户名和密码有误
              //10:如果1  跳转商品列表组件  /Product 
              if(res.data.code==-1){
                  this.$messagebox("消息","用户名或密码有误");
              }else{
                  this.$toast("登录成功");
                  this.$router.push("/");
              }
           })
         
        },
        register(){
            this.$router.push("/Register")
        }
    }
}
</script>
<style>
    .login{
        display: flex;
    }
    .pic{
        /* background: url("../../../assets/011.jpg") no-repeat; */
        margin-top: 100px;
    }
     .pic>h3{
         font-weight: normal;
         text-align: center;
         font-size: 20px;
     }
     html{
         background: url("../../../assets/011.jpg") no-repeat;
     }
</style>
