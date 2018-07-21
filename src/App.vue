<template>
  <div id="app">
    <router-view></router-view>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted(){
    mui('body').on('tap','.mui-tab-item,.mui-control-item',function(){document.location.href=this.href;});
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 44px;
}
.mui-icon-list{
  top: 5px !important;
}
.mui-bar-nav{
  background-color: #EB482F !important;
}
.mui-title{
  color:white !important;
}
.mui-bar-nav ~ .mui-content {
    padding-top: 0px !important;
}

.mui-toast-container{
    top: 1% !important
}


.mui-table-view-cell:after{
  left:0px !important;
}

.order_status{
  border:none !important
}


/* 暂时 */
.mui-table-view {
  background: transparent !important;
}
.mui-table-view:after,
.mui-table-view:before,
.mui-table-view-cell:after {
  display: none !important;
}
.mui-table-view-cell {
  border-radius: 12px !important;
  background: white !important;
  margin: 5px !important;
  box-shadow: 0 1px 2px rgba(12, 12, 12, 0.3) !important;
  /* box-shadow: rosybrown; */
}

.mui-modal,
body,
html,
nav,
header,
.mint-popup {
  max-width: 768px;
  margin: auto;
}
.mint-popup-3{
  left:0 !important;
}


body {
  background: #efeff4;
  height: -webkit-calc(100vh - 44px);
  height: -moz-calc(100vh - 44px);
  height: calc(100vh - 44px);
}

h5,
.font-bold {
  font-weight: bold;
}

.mui-icon-star-filled {
  font-size: 14px !important;
}
.mint-popup-2 {
  width: 100%;
  height: 50px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  backface-visibility: hidden;
}
.mint-popup-2 p {
  line-height: 50px;
  color: #fff;
}
</style>
