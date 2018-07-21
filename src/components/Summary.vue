<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			
			<h1  style="color:white" class="mui-title">Summary</h1>
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
			<router-link to="/summary" class="mui-tab-item mui-active">
				<span class="mui-icon mui-icon-flag"></span>
				<span class="mui-tab-label">Summary</span>
			</router-link>
			<router-link to="/setting" class="mui-tab-item">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">Settings</span>
			</router-link>
		</nav>
		<div class="mui-content">

		</div>

	</body>
</template>

<script>
import axios from "axios";
var count = 0;
export default {
  name: "hello",
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
      loading: true
    };
  },
  mounted() {
  },
  methods: {
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
