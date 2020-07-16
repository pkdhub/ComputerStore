<template>
    <div class="pic">
        <h3>请您注册</h3>
        <mt-field label="用户名:" placeholder="请输入用户名" v-model="uname"></mt-field>
        <mt-field label="密码:" placeholder="请输入密码" v-model="upwd"></mt-field>
        <mt-field label="密码:" placeholder="请确认密码" v-model="upwd1"></mt-field>
        <mt-button size="large" @click="register" type="primary">注册</mt-button>
    </div>
</template>
<script>
export default {
    data(){
        return{
      uname:"",
      upwd:"",
      upwd1:""
        }
    },
    methods:{
        register(){
            var uname=this.uname
            var upwd=this.upwd
            var upwd1=this.upwd1
            var reg = /^[a-z0-9]{3,12}$/i;
            if(!reg.test(uname)){
                this.$messagebox("消息","用户名格式不正确");
             return;
            }
            if(!reg.test(upwd)){
                this.$messagebox("消息","密码格式不正确")
                return
            }
            var url="Register";
            var obj={uname:uname,upwd:upwd,upwd1,upwd1}
            this.axios.get(url,{params:obj})
            .then(res => {
                if(res.data.code==403){
                    this.$messagebox("消息",res.data.msg)
                }else if(res.data.code==404){
                    this.$messagebox("消息",res.data.msg)
                }else{
                    this.$messagebox.confirm("注册成功,即将跳到登陆页面").then(res=>{
                        this.$router.push("/Login")
                    }
                    )
                }
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
}
</script>
<style>
html{
         background: url("../../../assets/011.jpg") no-repeat;
     }
.pic>h3{
         font-weight: normal;
         text-align: center;
         font-size: 20px;
     }
</style>