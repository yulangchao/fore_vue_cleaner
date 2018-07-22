<template>

  <div id="app">
      <mt-popup v-model="popupVisible2" position="top" class="mint-popup-2" style="background-color: rgba(0,0,0,.7) !important;" :modal="false">
        <p>{{msg}}</p>
      </mt-popup>
      
        <router-view>
          <!-- 这里是会被缓存的视图组件 -->
        </router-view>
      
    
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      popupVisible2: false,
      msg: ""
    };
  },
  watch: {
    popupVisible2(val) {
      if (val) {
        setTimeout(() => {
          this.popupVisible2 = false;
        }, 5000);
      }
    }
  },
  created() {
    // if (!window.mylocation){
    //   axios.get("https://ipinfo.io").then(response => {

    //     window.mylocation = (response.data);
    //   });
    // }

  },
  mounted() {
    mui("body").on("tap", ".mui-tab-item,.mui-control-item", function() {
      document.location.href = this.href;
    });
    document.body.removeChild(document.getElementById("Loading"));
  }
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 44px;
}

p,
a,
label,
h1 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.mui-icon-list {
  top: 5px !important;
}
.mui-bar-nav {
  background-color: #eb482f !important;
}
.mui-title {
  color: white !important;
  font-weight: bold !important;
}
.mui-control-item {
  font-weight: bold !important;
}
.mui-bar-nav ~ .mui-content {
  padding-top: 2px !important;
}

.mui-toast-container {
  top: 1% !important;
  bottom: auto !important;
}

.mui-table-view-cell:after {
  left: 0px !important;
}

.order_status {
  border: none !important;
}
image[lazy="loading"] {
  width: 79px;
  height: 79px;
  margin: auto;
}
.weui-cells__title {
  font-weight: bold;
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

html {
  background: url(./assets/2zrdI1g.jpg);
  background-size: cover;
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
.mui-table-view .mui-media-object {
    width: 42px !important;
    height: 42px !important;
}
</style>
