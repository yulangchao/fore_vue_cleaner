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

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import { Lazyload } from 'mint-ui';
import { Loadmore } from 'mint-ui';
// import VueGeolocation from 'vue-browser-geolocation';
// Vue.use(VueGeolocation);
import { Popup } from 'mint-ui';

Vue.component(Popup.name, Popup);
Vue.component(Loadmore.name, Loadmore);
Vue.use(Lazyload);
Vue.use(MintUI)

import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
Vue.component('datetime', Datetime);
Vue.use(Datetime)


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
