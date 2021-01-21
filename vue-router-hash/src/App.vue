<template>
  <div id="app">
    <div>
      <img alt="Vue logo" src="./assets/logo.png">
    </div>
    <div>
      <button @click="replaceIndex">replace</button>
      <button @click="goBlog">blog</button>
      <button @click="go">go</button><input type="number" v-model="goNum">
    </div>
    <div>
      <p>
        <router-link to="/index">index</router-link> |
        <router-link to="/blog">blog</router-link> |
        <router-link to="/photo">photo</router-link>
      </p>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return {
      goNum: 0
    }
  },
  methods: {
    replaceIndex() {
      this.$router.replace('/index')
    },
    goBlog() {
      this.$router.push({path: '/blog', query: {}})
    },
    go(){
      this.$router.go(this.goNum)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
