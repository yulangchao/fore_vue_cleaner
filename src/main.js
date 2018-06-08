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
  apiKey: "AIzaSyBQTRelOWDFque5k-i9iAcZ2fAQBmp7_As",
  authDomain: "foreclient-d7a02.firebaseapp.com",
  databaseURL: "https://foreclient-d7a02.firebaseio.com",
  projectId: "foreclient-d7a02",
  storageBucket: "foreclient-d7a02.appspot.com",
  messagingSenderId: "327995713096"
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
