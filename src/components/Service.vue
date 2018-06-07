<template>
	<body>
		<header class="mui-bar mui-bar-nav">

			<h1 class="mui-title">Services</h1>
		</header>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/service" class="mui-tab-item mui-active">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">Services</span>
			</router-link>
			<router-link to="/order" class="mui-tab-item">
				<span class="mui-icon mui-icon-list"></span>
				<span class="mui-tab-label">Orders</span>
			</router-link>
			<router-link to="/cleaner" class="mui-tab-item">
				<span class="mui-icon mui-icon-contact"></span>
				<span class="mui-tab-label">Cleaners</span>
			</router-link>
			<router-link to="/setting" class="mui-tab-item">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">Settings</span>
			</router-link>
		</nav>
		<div class="mui-content">
 Schedual
		</div>
	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
var count = 0;
export default {
  name: "service",
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
      loading: true
    };
  },
  mounted() {},
  methods: {
    logout: function() {
      localStorage.removeItem("user");
      mui.toast("退出成功");
      this.$router.replace("login");
    },
    redirect: function() {
      this.$router.replace("hello");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mui-content {
  padding-top: 0px;
}
.title {
  margin: 20px 15px 10px;
  color: #6d6d72;
  font-size: 15px;
}

.oa-contact-cell.mui-table .mui-table-cell {
  padding: 11px 0;
  vertical-align: middle;
}

.oa-contact-cell {
  position: relative;
  margin: -11px 0;
}

.oa-contact-avatar {
  width: 75px;
}

.oa-contact-avatar img {
  border-radius: 50%;
}

.oa-contact-content {
  width: 100%;
}

.oa-contact-name {
  margin-right: 20px;
}

.oa-contact-name,
oa-contact-position {
  float: left;
}

.mui-content > .mui-table-view:first-child {
  margin-top: 0px;
  padding-top: 15px;
}
.mui-card {
  margin-bottom: 0px;
  margin-top: 15px;
}
.mui-table-view {
  padding-bottom: 20px;
}
</style>
