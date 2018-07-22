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
<!-- <datetime
  type="datetime"
  v-model="fromDate"
 
  :phrases="{ok: 'Continue', cancel: 'Exit'}"
  :hour-step="2"
  :minute-step="15"
  :week-start="7"
  use12-hour
  auto
  ></datetime> -->
<h5 style="float:left;width:20%;padding:10px">From：</h5><input style="float:left;width:80%;" class="weui-input" type="date" v-model="fromDate">
<h5 style="float:left;width:20%;padding:10px">To：</h5><input style="float:left;width:80%" class="weui-input" type="date" v-model="toDate">
 <button class="mui-btn mui-btn-primary  mui-btn-block submit" style="padding:5px;"  @click="searchSummary">Search</button>
        <table v-if="statistic" width="100%" class="table" id="tablevalue" style="font-weight:bold">
            <tr><th width=50%>Name</th><th width=50%>Value</th></tr>
                <tr>
                  <td>Income（Finish）</td>
                  <td>{{statistic.finish_order.price == null ? 0 : statistic.finish_order.price}}</td>
                </tr>
                <tr>
                  <td>Income（Unfinish）</td>
                  <td>{{statistic.unfinish_order.price == null ? 0 : statistic.unfinish_order.price}}</td>
                </tr>
                <tr>
                  <td>Finished Order</td>
                  <td>{{statistic.finish_order.count}}</td>
                </tr>
                <tr>
                  <td>Unfinished Order</td>
                  <td>{{statistic.unfinish_order.count}}</td>
                </tr>
                <tr>
                  <td>Wii Paid (Total) </td>
                  <td>{{statistic.wii_payment}}</td>
                </tr>
        </table>
        <h5>History of Payment From Wii</h5>
        <ul class="mui-table-view">
            <template v-for="da in data">
              <li class="mui-table-view-cell mui-media">
                <a href="javascript:;">
                  <h5 class="mui-pull-right">${{da.amount}}</h5>
                  
                  <span class='mui-ellipsis' style="float:left;margin:0px;padding:5px 0px;">{{da.created_at}}&nbsp;&nbsp;
                  </span>

                </a>
              </li>
            </template>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <p v-if="busy && loading"><span class="mui-spinner"></span></p>
              <h5 v-if="!loading">End of Record</h5>
            </div>
          </ul>
		</div>

	</body>
</template>

<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";
var count = 0;
export default {
  name: "hello",
  components: {
    Datepicker
  },
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
      loading: true,
      fromDate: "",
      toDate: "",
      statistic: null
    };
  },
  components: {
    Datepicker
  },
  created() {
    this.searchSummary();
  },
  methods: {
    searchSummary: function() {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      setTimeout(() => {
        axios
          .post(
            "http://foreclean.tk:8000/api/getSummary",
            JSON.stringify({
              fromDate: this.fromDate ,
              toDate: this.toDate
            }),
            config
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              this.statistic = response.data;
            } else {
              mui.toast("数据获取失败");
            }
          })
          .catch(error => {
            mui.toast("数据获取失败");
            console.log(error.response);
          });
      }, 0);
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
            "http://foreclean.tk:8000/api/getWiiPaymentForCleaner",
            JSON.stringify({
              offset: this.page * 10
            }),
            config
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              this.page++;
              this.data = this.data.concat(response.data.wii_payments);
              if (response.data.wii_payments.length < 10) {
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
.table {
  border: 1px solid #cad9ea;
  color: #666;
}

.table th {
  background-repeat: repeat-x;
  height: 30px;
}

.table td,
.table th {
  border: 1px solid #cad9ea;
  padding: 0 1em 0;
}

.table tr.alter {
  background-color: #f5fafe;
}
</style>
