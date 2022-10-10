<template>
  <div class="about">
    <h1>看看国内各省天气预警市数量谁最多</h1>
    <h4>{{message}}</h4>
    <div v-if="loadSuccess">
      <div v-for="item of provinceList" :key='item.cityCode' class="container">
        <div class="showTag">{{item.cityName}}:<span>{{item.warNum}}</span></div>
        <div class="bar"><div class="barSolid" :style="{'width':(item.warNum/maxNum)*35+'vw','transition':'all 0.5s linear'}"></div></div>
      </div>
    </div>
  </div>
</template>
<script>
//(this.provinceList.warNum/this.maxNum)*35+'vw'
import provinceCode from '../assets/provinceCode.json'
export default{
  name:'WarningCities',
  data(){
    return{
      hefengWeatherKey:'your key',//这里填你的key，获得方式可以去和风天气官网上看
      loadSuccess:false,
      message:'loading...',
      showingDetails:0,
      warCityIdList:[],
      provinceList:[],
      maxNum:0,
    }
  },
  beforeMount(){
    this.getWarCityList().then((warCityListData)=>{
      this.loadSuccess=true;
      this.message='更新时间:'+warCityListData.updateTime;
      this.warCityIdList=warCityListData['warningLocList'];
      for(let i in provinceCode){
        let Reg=new RegExp('^'+provinceCode[i])
        let warNum=0;
        for(let j of this.warCityIdList){
          if(Reg.test(j['locationId'])){
            warNum++;
          }
        }
        this.provinceList.push({'cityName':i,'cityCode':provinceCode[i],'warNum':warNum});
      }
      this.provinceList.sort((a,b)=>b.warNum-a.warNum)
      this.maxNum=this.provinceList.reduce((acc,cur)=>{
        if(cur.warNum>acc){acc=cur.warNum}
        return acc
      },0)
    })
  },
  methods:{
    getCityData(locationId){
      return this.getDataFromApi(`/geoapi/v2/city/lookup?location=${locationId}=&key=${this.hefengWeatherKey}`);
    },
    getWarningMessage(locationId){
      return this.getDataFromApi(`/api/v7/warning/now?location=${locationId}&key=${this.hefengWeatherKey}`);
    },
    getWarCityList(){
      return this.getDataFromApi(`/api/v7/warning/list?range=cn&key=${this.hefengWeatherKey}`);
    },
    getDataFromApi(url){
      return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest();
        xhr.open('get',url,true);
        xhr.send();
        xhr.onreadystatechange=()=>{
          if(xhr.readyState==4&&(xhr.status==200||xhr.status==304)){
            let cityData=JSON.parse(xhr.responseText);
            if(cityData['code']=='200'){
              resolve(cityData);
            }else{
              reject(['something wrong with 和风weather?',cityData['code']]);
            }
          }else if(xhr.readyState==4&&xhr.status!=200&&xhr.status!=304){
            reject('something wrong with web')
          }
        }
    });
    }
  },
}
</script>
<style scoped>
.bar,.showTag{
  display: inline-block;
}
.showTag{
  width:8em;
}
.bar{
  width:35vw;
  height:1.2em;
  background-color: aqua;
  z-index: 1;
}
.container{
  white-space: nowrap;
  overflow: hidden;
}
.barSolid{
  position:relative;
  background-color: blue;
  z-index: 2;
  height:1.2em;
  transition: all 0.5s linear;
  width: 0px;
}
</style>