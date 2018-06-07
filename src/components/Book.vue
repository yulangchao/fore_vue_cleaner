<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			
			<h1  style="color:white" class="mui-title">Booked Order</h1>
		</header>
    <div v-if="change_time" class="mui-popup-backdrop mui-active" style="display: block;"></div>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/service" class="mui-tab-item">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">Services</span>
			</router-link>
			<router-link to="/order" class="mui-tab-item mui-active">
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
        <div style="padding: 10px 10px;">
				<div id="segmentedControl" class="mui-segmented-control">
                    <router-link to="/order" class="mui-control-item">Pending</router-link> 
					<router-link to="/order/book" class="mui-control-item mui-active">Booked</router-link>  
                    <router-link to="/order/inservice" class="mui-control-item">Serving</router-link>
					<router-link to="/order/finish" class="mui-control-item">Finished</router-link>
				</div>
		</div>
		<ul class="mui-table-view">
        <template v-for="da in data">
          <li class="mui-table-view-cell mui-media">
            <a href="javascript:;">
              <button class="mui-btn mui-btn-primary" v-if="da.order_status==4" @click="acceptChangeTime(da)" style="padding: 3px 10px;top: 95px;right: 80px;">
                Accept
              </button>
              <button class="mui-btn mui-btn-danger" v-if="da.order_status==4" @click="declineChangeTime(da)" style="padding: 3px 10px;top: 95px;right: 10px;">
                Decline
              </button>
              <button class="mui-btn mui-btn-primary" v-if="da.order_status==3" style="padding: 3px 10px;top: 95px;right: 10px;" @click="startOrder(da)">
                Start Service
              </button>
              <h5 class="mui-pull-right">${{da.price}}</h5>
              <router-link :to="{ name: 'OrderDetail', params: { order: da}}" class="mui-media-body">
                <h4 class='mui-ellipsis' style="text-align:left;margin:0px;padding:5px 0px;">{{getOrderType(da.order_type)}}&nbsp;&nbsp;
                   <button v-if="da.order_status== 2" class="order_status" style="background:#ea5a12">Unpaid</button>
                   <button v-if="da.order_status== 3" class="order_status" style="background:#64d573">Booked</button>
                   <button v-if="da.order_status== 4" class="order_status" style="background:#ea5a12">Changed</button>
                </h4>
                <p class='mui-ellipsis' style="text-align:left"><i class="fas fa-phone"></i>:{{da.phone}}  <span style="color:red"><i class="fas fa-clock"></i>:{{da.time}}</span></p>
                <p class='mui-ellipsis address'>{{da.address.substring(0,60)}}&nbsp;</p>
              </router-link>
            </a>
          </li>
        </template>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <p v-if="busy && loading"><span class="mui-spinner"></span></p>
          <p v-if="!loading">No More Order</p>
        </div>
			</ul>
		</div>

	</body>
</template>

<script>
import axios from "axios";
var count = 0;
export default {
  name: "book",
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
      loading: true,
      change_time: false,
      time: "",
      changed_order: null
    };
  },
  mounted() {},
  methods: {
    startOrder: function(da) {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      let btnArray = ["否", "是"];
      mui.confirm(
        "确认开始此单？",
        this.getOrderType(da.order_type),
        btnArray,
        e => {
          if (e.index == 1) {
            axios
              .post(
                "http://foreclean.tk:8000/api/startOrder",
                JSON.stringify({
                  order_id: da.id
                }),
                config
              )
              .then(response => {
                console.log(response);
                if (response.data.success == true) {
                  mui.toast("Accepted the Order Successfully.");
                  this.$router.push("/order/inservice");
                } else {
                  mui.toast("开始失败");
                }
              })
              .catch(error => {
                mui.toast("开始失败");
                console.log(error);
              });
          }
        }
      );
    },
    closePop: function() {
      this.change_time = false;
      this.changed_order = null;
    },
    acceptChangeTime: function(da) {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      let btnArray = ["否", "是"];
      mui.confirm(
        "确认接受此修改时间？",
        this.getOrderType(da.order_type),
        btnArray,
        e => {
          if (e.index == 1) {
            axios
              .post(
                "http://foreclean.tk:8000/api/acceptChangeTime",
                JSON.stringify({
                  order_id: da.id
                }),
                config
              )
              .then(response => {
                console.log(response);
                if (response.data.success == true) {
                  da.order_status = 3;
                  mui.toast("Accepted the Change Time Successfully!");
                } else {
                  mui.toast("Accept Failed.");
                }
              })
              .catch(error => {
                mui.toast("Accept Failed.");
                console.log(error.response);
              });
          }
        }
      );
    },
    declineChangeTime: function(da) {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      let btnArray = ["否", "是"];
      mui.confirm(
        "确认拒绝此修改时间？",
        this.getOrderType(da.order_type),
        btnArray,
        e => {
          if (e.index == 1) {
            axios
              .post(
                "http://foreclean.tk:8000/api/declineChangeTime",
                JSON.stringify({
                  order_id: da.id
                }),
                config
              )
              .then(response => {
                console.log(response);
                if (response.data.success == true) {
                  this.data.splice(this.data.indexOf(da), 1);
                  mui.toast("Declined the Change Time Successfully!");
                } else {
                  mui.toast("Declined Failed.");
                }
              })
              .catch(error => {
                mui.toast("Declined Failed.");
                console.log(error.response);
              });
          }
        }
      );
    },
    changeTime: function(da) {
      this.change_time = true;
      this.time = da.time.replace(" ", "T");
      this.changed_order = da;
    },
    loadMore: function() {
      this.busy = true;
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      setTimeout(() => {
        axios
          .post(
            "http://foreclean.tk:8000/api/getOrdererListForCleaner",
            JSON.stringify({
              status: [2, 3, 4],
              offset: this.page * 10
            }),
            config
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
            mui.toast("数据获取失败");
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

.order_status {
  color: white;
  padding: 2px 7px;
  border-radius: 7px;
  height: 24px;
  margin-top: -5px;
}
.address {
  white-space: pre-line;
  text-align: left;
  height: 42px;
}
</style>
