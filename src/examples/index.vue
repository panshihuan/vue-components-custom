<template>
  <div class="demo-index">
    <router-link to="/popup">Popup</router-link>
    <router-link to="/lazy">Lazy</router-link>
    <router-link to="/swipe">Swipe</router-link>
    <router-link to="/ripple">Ripple</router-link>
    <router-link to="/indexlist">IndexList</router-link>
    <router-link to="/toast">Toast</router-link>
    <router-link to="/tree">Tree</router-link>
    <router-link to="/calendar">Calendar</router-link>
    <router-link to="/tabbar">Tabbar</router-link>
    <router-link to="/select">Select</router-link>
    <router-link to="/inputNumber">InputNumber</router-link>
    <router-link to="/pullrefresh">PullRefresh</router-link>
    <router-link to="/loading">loading</router-link>
    <router-link to="/imgPreview">ImgPreview</router-link>
    <router-link to="/dialog">dialog</router-link>
    <router-link to="/cascade">cascade</router-link>
    <router-link to="/slidenav">slidenav</router-link>
    <router-link to="/validator">validator</router-link>
    <router-link to="/picker">picker</router-link>
    <router-link to="/form">form</router-link>
    <router-link to="/datetimePicker">datetimePicker</router-link>
    <router-link to="/sort">sort</router-link>
    <router-link to="/countdown">countdown</router-link>
  </div>
</template>

<style lang="scss">
  .demo-index {
    padding: 30px;
    text-align: center;
    color: #2C3E50;
    a {
      display: block;
      font-weight: bold;
      color: #2C3E50;
      &.router-link-exact-active {
        color: #42B983;
      }
    }
  }
</style>
