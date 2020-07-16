<template>
    <div>
        <!--h3>Cart.vue 购物车</h3-->
        <!--(1)顶部全选复选框-->
        <div class="selectall">
            全选<input type="checkbox" @change="selectAll" v-model="allcb"/>
        </div>
        <!--(2)购物车商品列表 -->
        <div class="cartItem" v-for="(item,i) of list" :key="i">
             <div class="leftImgTxt">
                 <input type="checkbox" v-model="item.cb" @change="changeitem"/>
                 <img :src="'http://127.0.0.1:4000/'+item.pic">
                 <div class="title hidden">{{item.lname}}</div>
                 <div class="title">价格:{{item.price}}</div>
                 <div class="title">数量:{{item.count}}</div>
             </div>
             <mt-button @click="del(item.id)">删</mt-button>
        </div>
        <!--(3)一组按钮-->
        <div>
            购物车中商品数量<span style="color:red">{{total()}}</span>
            <mt-button @click="deleteItems" class="dels">删除选中商品</mt-button>
            <mt-button @click="deleteAllItem">清空购物车</mt-button>
        </div>
        <div class="money">
            <span>结算:$<span>{{moneyAll().toFixed(2)}}</span></span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[],       //购物车购物信息
            money:0,
            allcb:false
        }
    },
    created(){
      //组件创建成功后获取购物车列表信息
      this.loadMore();  
    },
    methods:{
        del(id){
          //功能:删除购物车中指定商品
        //   console.log(id);
          //1:显示交互对话框
          this.$messagebox.confirm("是否删除指定商品?")
          .then(res=>{ //用户点击确认按钮
          //2:如果有户选中 确认
          //3:创建变量url 保存中间人删除程序地直 /del
          var url = "del";
          //4:创建变量obj 保存id
          var obj = {id}
          //5:发送ajax请求
          this.axios.get(url,{params:obj}).then(res=>{
            //6:获取返回结果 提示 重新加载数据[刷新]
            if(res.data.code==1){
                this.$toast("删除成功");
                this.loadMore();
            }
          })
          })
          .catch(err=>{//用户点击取消按钮
          })
        },
        loadMore(){
            // console.log(123);
            //发送请求获取购物车数据
            //1:创建变量url保存请求服务器程序地址
            var url = "findcart";
            //2:发送ajax请求并且获取服务器返回数据
            this.axios.get(url).then(res=>{
             //3:获取服务器返回数据 code==-2
             //  提示请登录  跳转Login组件
             if(res.data.code==-2){
                  this.$toast("请登录");
                  this.$router.push("/Login");
                  return;
             }else{
             //4:获取服务器返回数据  code==1
             //5:将服务器返回购物车列表保存list
            //  console.log(res)
             this.list = res.data.data;
            //  console.log(this.list)
             //console.log(this.list);
             //6:在模板中创建循环显示购物车列表数据即可 
             }
            })
        },
           total(){
               var sum=0;
               for(var elem of this.list){
                   sum+=elem.count
               }
               return sum
           },
           moneyAll(){
               var money=0;
               for(var elem of this.list){
                   money+=elem.count*elem.price
               }
               return money
           },
           changeitem(){
           var size=this.list.length;
           var sum=0;
           for(var item of this.list){
           if(item.cb)sum++;
           }
           if(size==sum){
             this.allcb=true;
           }else{
            this.allcb=false;
            }
           },
           selectAll(){
           var cb = this.allcb
           for(var item of this.list){
               item.cb = cb;
              }
           },
           deleteItems(){
               //功能:删除用户删除中多个商品
      //(1)显示确认对话框
      this.$messagebox.confirm("是否删除指定数据").then(res=>{
       //(2)创建变量保存选中id值  id
       var id = "";  //1,2,3
       //(3)创建循环遍历数组中每个元素
       for(var item of this.list){
        //(4)判断当前元素属性cb是否等于true
        if(item.cb){
         //(5)拼接id      2,3,4,
         id+=item.id+",";
        }
       }//for end
       //(6)去除字符串中最后一个逗号
       //id="2,3,4,"
       id = id.slice(0,-1);
      //(7)判断用户是否选中商品 请选择需要删除商品
      if(id==""){
        this.$toast("请选择需要删除商品");
        return;
      }
      //(8)创建url 创建obj 发送ajax请求
      var url = "del";
      var obj = {id:id};
      this.axios.get(url,{params:obj}).then(res=>{
       //(9)获取服务器返回数据
       //(10)判断删除多个商品是否成功
       if(res.data.code==-1){
         this.$toast("删除失败");
       }else{
         this.$toast("删除成功");
         this.loadMore();
       }
       //(11)刷新操作 loadMore()
      })
      })
           },
    deleteAllItem(){
        this.$messagebox.confirm("是否清空购物车").then(res=>{
       var id = "";  //1,2,3
       for(var item of this.list){
         id+=item.id+",";
       }
       id = id.slice(0,-1);
      var url = "del";
      var obj = {id:id};
      this.axios.get(url,{params:obj}).then(res=>{
       if(res.data.code==-1){
         this.$toast("删除失败");
       }else{
         this.$toast("删除成功");
         this.loadMore();
       }
      })
      })
    },
    }
}
</script>
<style scoped>
 /*1:一个商品项目元素*/
 p,h1,h2,h3,h4{
     margin:0;
     padding:0;
 }
 .cartItem{
     display:flex;/*弹性布局*/
     justify-content: space-between;/*子元素两端对齐*/
     align-items: center;/*子元素垂直居中*/
     border-bottom:1px solid #ccc;
    
     background:#f9d4d4;
 }
 .cartItem img{
     width:40px;
     height: 40px;
     margin-left: 15px;
 }
 /*2:左侧【商品名称与价格】*/
 .leftImgTxt{
     display: flex;
     align-items: center;
 }
 .title{
     margin-left:15px;
     width:80px;
     height: 18px;
 }
 .hidden{
     overflow: hidden;
     text-overflow:ellipsis;
 }
 .money{
    margin-top: 15px;
 }
 .money>span{
 margin-left:265px;
 }
 .money>span>span{
     color:red;
     font-size: 18px;
 }
 .dels{
     margin:0 2px;
 }
</style>


