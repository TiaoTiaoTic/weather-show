<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>点击上方导航栏看天气相关数据</p>
    <h3>天气预警情况</h3>
    <p>看看国内各省天气预警市数量谁最多</p>
    <h3>当地天气情况</h3>
    <p>今天和未来2天的天气情况</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
