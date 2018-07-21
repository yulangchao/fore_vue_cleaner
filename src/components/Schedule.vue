<template>
	<body>
		<header class="mui-bar mui-bar-nav">

			<h1 class="mui-title">Schedule</h1>
		</header>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/service" class="mui-tab-item mui-active">
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
			<router-link to="/setting" class="mui-tab-item">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">Settings</span>
			</router-link>
		</nav>
		<div class="mui-content ">
				<ul class="mui-card mui-table-view-chevron">
          <template v-for="index in 7 ">
					<li class="mui-table-view-cell mui-collapse schedule">
            <a class="mui-navigate-right" href="#" style="text-align:left;font-weight:bold">{{getDay(index)}}</a>
						<ul class="mui-table-view mui-table-view-chevron">
              <template v-for="sub in scheduals" v-if="sub.day == index">
                <li class="mui-table-view-cell sub-list schedule">
              
                  <div class="mui-numbox">
                    <button class="mui-btn-numbox-minus" type="button" @click="(sub.start>1)?sub.start--:sub.start">-</button>
                    <input class="mui-input-numbox" type="number" v-model="sub.start"/>
                    <button class="mui-btn-numbox-plus" type="button"  @click="(sub.start<23 && sub.start<sub.end-1)?sub.start++:sub.start">+</button>
                  </div>
                  <div class="mui-numbox">
                    <button class="mui-btn-numbox-minus" type="button" @click="(sub.end>1 && sub.start<sub.end-1)?sub.end--:sub.end">-</button>
                    <input class="mui-input-numbox" type="number" v-model="sub.end" />
                    <button class="mui-btn-numbox-plus" type="button"  @click="(sub.end<23)?sub.end++:sub.end">+</button>
                  </div>
                  <div :class="sub.active == 0 ? 'mui-switch' :'mui-switch mui-active'" @click="sub.active = (sub.active+1)%2">
                    <div class="mui-switch-handle"></div>
                  </div>
                </li>
              </template>

                <!-- <li class="mui-table-view-cell sub-list">
                  <div class="mui-numbox">
                    <button class="mui-btn-numbox-minus" type="button">-</button>
                    <input class="mui-input-numbox" type="number" value='8' />
                    <button class="mui-btn-numbox-plus" type="button">+</button>
                  </div>
                  <div class="mui-numbox">
                    <button class="mui-btn-numbox-minus" type="button">-</button>
                    <input class="mui-input-numbox" type="number" value='18' />
                    <button class="mui-btn-numbox-plus" type="button">+</button>
                  </div>
                  <div class="mui-btn mui-btn-primary">
                    Add
                  </div>
                </li> -->
						</ul>
					</li>
          </template>
				</ul>
		</div>
    <button class="mui-btn mui-btn-primary  mui-btn-block submit" :disabled="false" @click="saveChange">Save</button>
	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";

var count = 0;
export default {
  name: "schedule",
  data() {
    return {
      scheduals: [],
      loading: true,
      backup: [],
      changes: []
    };
  },
  created() {
    this.getSchedual();
  },
  mounted() {},
  methods: {
    getDiffence: function() {

    },
    saveChange: function(sub) {
      if (this.backup == JSON.stringify(this.scheduals)) {
        mui.toast("No Changes!");
      } else {
        let config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        };
        axios
          .post(
            "http://foreclean.tk:8000/api/saveSchedual",
            JSON.stringify({
              scheduals: this.scheduals
            }),
            config
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              mui.toast("保存成功");
            } else {
              mui.toast("保存失败");
            }
          })
          .catch(error => {
            mui.toast("保存失败");
            console.log(error);
          });
      }
    },
    getSchedual: function() {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      axios
        .post(
          "http://foreclean.tk:8000/api/getSchedual",
          JSON.stringify({}),
          config
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            this.scheduals = response.data.scheduals;
            this.backup = JSON.stringify(response.data.scheduals);
          } else {
            mui.toast("取消失败");
          }
        })
        .catch(error => {
          mui.toast("取消失败");
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sub-list:after {
  left: 15px !important;
}
.mui-content > .mui-card:first-child {
  margin-top: 55px !important;
}
.submit {
  margin-bottom: 0px;
  position: absolute;
  bottom: 50px;
  padding: 10px 0px;
}
.sub-list {
  text-align: left;
}

.mui-numbox {
  padding: 0px 20px;
  width: 80px;
  height: 25px;
}
.mui-numbox button {
  width: 20px !important;
}

/* 暂时 */
.mui-table-view {
  background: transparent !important;
}
.mui-table-view:after,
.mui-table-view:before,
.mui-table-view-cell:after {
  display: initial !important;
}
.mui-table-view-cell {
  border-radius: 0px !important;
  background: white !important;
  margin: 0px !important;
  box-shadow: 0 1px 2px rgba(12, 12, 12, 0.3) !important;
  /* box-shadow: rosybrown; */
}
</style>
