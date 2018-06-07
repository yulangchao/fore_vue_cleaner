// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import Mui from 'vue-awesome-mui'
import 'vue-awesome-mui/mui/sass/mui.scss'
import infiniteScroll from 'vue-infinite-scroll'
import common from './common'
Vue.use(infiniteScroll)
Vue.use(common)
Vue.config.productionTip = false

let app;
let config = {
  apiKey: "AIzaSyBUGXt3KjjdZV-r87od7hPEpmH3E22pX5o",
  authDomain: "test-98894.firebaseapp.com",
  databaseURL: "https://test-98894.firebaseio.com",
  projectId: "test-98894",
  storageBucket: "test-98894.appspot.com",
  messagingSenderId: "1071518078363"
};
Vue.use(Mui)
firebase.initializeApp(config)
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      template: '<App/>',
      components: { App },
      router
    })
  }
});
