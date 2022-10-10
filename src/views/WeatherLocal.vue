<template>
    <div>
        <h4 @click="toggleShowOne">{{weather}}点我展开/合上明后天数据</h4>
        <Transition name="fade">
            <div v-if="loadSuccess" class="container">
                <TransitionGroup name="listFade">
                    <div class='card' v-for="item of justShowOne?list.slice(0,1):list" :key="item.fxDate">
                        <h2>{{cityName+'    '+item.fxDate+'    '+item.tempMin+'°C - '+item.tempMax+'°C'}}</h2>
                        <div class="inCardContainer">
                            <div><img :src='"weatherIcons/icons/"+item.iconDay+".svg"' class='weatherIconImg'/><p>{{item.textDay}}</p></div>
                            <div class="dataShow">
                                <div><div class="beLeft">日出{{item.sunrise}}</div><div class="beRight">日落{{item.sunset}}</div></div>
                                <div><div class="beLeft">{{item.windDirDay+' '+item.windScaleDay}}级</div><div class="beRight">{{item.windDirNight+' '+item.windScaleNight}}级</div></div>
                                <div>
                                    <p>{{'紫外线强度'+item.uvIndex+' 能见度'+item.vis+'公里'}}</p>
                                    <p>{{'相对湿度'+item.humidity+'% 气压强'+item.pressure+'百帕'}}</p>
                                    <p>{{'云量'+item.cloud+'% 降水量'+item.precip+'mm'}}</p>
                                </div>
                            </div>
                            <div><img :src='"weatherIcons/icons/"+item.iconNight+".svg"' class='weatherIconImg'/><p>{{item.textNight}}</p></div>
                            <div><img :src='"weatherIcons/icons/"+item.moonPhaseIcon+".svg"' class='weatherIconImg'/><p>{{item.moonPhase}}</p></div>
                            <div>
                                <p>月升{{item.moonrise}}</p><p>月落{{item.moonset}}</p>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </Transition>
    </div>
</template>

<script>
    export default{
        name:'WeatherLocal',
        data(){
            return{
                weather:'loading...',
                loadSuccess:false,
                list:[],
                cityName:'北京',
                justShowOne:true,
                hefengWeatherKey:'your key',//这里填你的key，获得方式可以去和风天气官网上看
            }
        },
        beforeMount(){
            // this.$router.push({
            //     name: 'NotFound',
            //     // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
            //     params: { pathMa: this.$route.path.substring(1).split('/') },
            //     // 保留现有的查询和 hash 值，如果有的话
            //     query: this.$route.query,
            //     hash: this.$route.hash,
            // });
            this.getCityName().then((cityNameData)=>{
                let cityName=cityNameData.cname;
                cityName=cityName.replace(/^.*[省|自治区]/g,'').replace(/市$/g,'');
                this.cityName=cityName;
            }).then(()=>{
                this.handleData();
            }).catch((reason)=>{
                this.weather=reason;
            })
        },
        methods:{
            toggleShowOne(){
                this.justShowOne=!this.justShowOne;
            },
            handleData(){
                this.getGeoData(this.cityName).then((cityData)=>{
                    return this.getWeatherData(cityData.location[0].id)
                }).then((data)=>{
                    this.loadSuccess=true;
                    this.setDomWeather(data)
                }).catch((reason)=>{
                    this.loadSuccess=false;
                    this.setDomWeather(reason);
                })
            },
            setDomWeather(weatherData){
                this.weather=weatherData.updateTime;
                this.list=weatherData.daily;
            },
            getWeatherData(geoId){
                return this.getDataFromApi(`/api/v7/weather/3d?location=${geoId}&key=${this.hefengWeatherKey}`);
            },
            getGeoData(cityName){
                return this.getDataFromApi(`/geoapi/v2/city/lookup?location=${cityName}&key=${this.hefengWeatherKey}`)
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
                                reject('something wrong with 和风weather?');
                            }
                        }else if(xhr.readyState==4&&xhr.status!=200&&xhr.status!=304){
                            reject('something wrong with web')
                        }
                    }
                });
            },
            getCityName(){
                return new Promise((res,rej)=>{
                    let xhr=new XMLHttpRequest();
                    xhr.open('get','/getCityName',true);
                    xhr.send();
                    xhr.onreadystatechange=()=>{
                        if(xhr.readyState==4&&(xhr.status==200||xhr.status==304)){
                            let data=xhr.responseText;
                            data=data.replace('var returnCitySN = ','').replace(';','');
                            res(JSON.parse(data));
                        }else if(xhr.readyState==4&&xhr.status!=200&&xhr.status!=304){
                            rej('something wrong with sohuapi');
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.fade-enter-from {
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
    transition: all 0.5s linear;
}

.listFade-move,
.listFade-enter-active,
.listFade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.listFade-enter-from,
.listFade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.listFade-leave-active {
  position: absolute;
}

.card{
    width:600px;
    height:200px;
    border:2px dashed black;
    border-radius: 10px;
}
.inCardContainer{
    display: grid;
    grid-template-columns: 100px 200px 100px 100px 100px;
    width:100%;
}
.inCardContainer>div{
    height:200px;
}
.dataShow{
    font-size: smaller;
}
.card>h2{
    text-align: left;
}
.card>h2,.card>div{
    position:relative;
    top:-15px;
}
.weatherIconImg{
    width:60%;
}
.beLeft{
    text-align: left;
    display:inline-block;
    width:50%;
}
.beRight{
    text-align: right;
    display: inline-block;
    width:50%;
}
.showOnePointer{
    padding: 10px;
}
</style>