<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			
			<h1  style="color:white" class="mui-title">Settings</h1>
		</header>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/schedule" class="mui-tab-item">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">Schedule</span>
			</router-link>
			<router-link to="/order" class="mui-tab-item">
				<span class="mui-icon mui-icon-list"></span>
				<span class="mui-tab-label">Orders</span>
			</router-link>
			<router-link to="/summary" class="mui-tab-item">
				<span class="mui-icon mui-icon-flag"></span>
				<span class="mui-tab-label">Summary</span>
			</router-link>
			<router-link to="/setting" class="mui-tab-item mui-active">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">Settings</span>
			</router-link>
		</nav>
		<div class="mui-content">
			<ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell mui-media">
					<router-link :to="{ name: 'UserSetting', params: { user: user}}"  class="mui-navigate-right">
						<img v-if="user" style="width:42px;height:42px;border-radius:100%" class="mui-media-object mui-pull-left head-img" id="head-img" :src="user.avatar==null? url() :  user.avatar">
						<div v-if="user" class="mui-media-body">
							{{user.name}}
							<p class='mui-ellipsis'>Phone:{{user.phone}}</p>
						</div>
					</router-link>
				</li>
			</ul>
      <div id="tabbar-with-map" class=""  style="margin-top: 25px;">
				
				<ul class="mui-table-view">
					<li class="mui-table-view-cell">
						<router-link :to="{ name: 'CleanerReview', params: { cleaner: user}}" class="mui-navigate-right">
							My Reviews
						</router-link>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right">
							My Income
						</a>
					</li>
					<!-- <li class="mui-table-view-cell">
						<a class="mui-navigate-right">
							Referal
						</a>
					</li> -->
				</ul>
				<ul class="mui-table-view" style="margin-top: 25px;">
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right">
							About Wii
						</a>
					</li>
				</ul>
				<ul class="mui-table-view" style="margin-top: 25px;">
					<li class="mui-table-view-cell">
						<a style="text-align: center;color: #FF3B30;"  href="#" @click="logout">
							Log Out
						</a>
					</li>
				</ul>
			</div>
		</div>

	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
var count = 0;
export default {
  name: "setting",
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
			loading: true,
			user: null
    };
  },
  created() {
		this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
				mui.toast("Logging Out Successfully!");
				localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        this.$router.replace('login')
      })
    },
    redirect: function() {
      this.$router.replace("hello");
    },
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        axios
          .post(
            "http://foreclean.tk:8000/zhidao/tech/getFinishList",
            JSON.stringify({
            })
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              this.page++;
              this.data = this.data.concat(response.data.orders);
              if (response.data.orders.length < 10) {
                this.busy = true;
                this.loading = false;
              } else {
                this.busy = false;
              }
            } else {
              mui.toast("数据获取失败");
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      }, 0);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mui-content {
  padding-top: 0px;
}
</style>
