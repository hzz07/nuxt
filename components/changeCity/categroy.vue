<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <!--根据锚点跳转-->
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
  import pyjs from 'js-pinyin'
  export default {
    data(){
      return {
        //将字符串转换成数组
        list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        block:[]
      }
    },
    async mounted(){
      let self=this;
      let blocks=[];
      //获取城市列表
      let {status,data:{city}}=await self.$axios.get('/geo/city');
      if(status===200){
        let p
        let c
        //创建一个空的对象
        let d={}
        //循环遍历city
        city.forEach(item=>{
          //将城市的name转化成拼音并且转换成小写取第一位
          p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
          //将p转换成code
          c=p.charCodeAt(0)
          //在26字母范围之内的
          if(c>96&&c<123){
            //如果这个对象中不存在这个属性
            if(!d[p]){
              //将创建这个属性的数组
              d[p]=[]
            }
            //将这个name push到对应的数组中
            d[p].push(item.name)
          }
        })
        //将k ，v 格式的对象d转换成数组[['k','v']]
        for(let [k,v] of Object.entries(d)){
          blocks.push({
            title:k.toUpperCase(),
            city:v
          })
        }
        //根据title进行排序
        blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0))
        self.block=blocks
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
