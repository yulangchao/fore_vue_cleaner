<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			
			<h1  style="color:white" class="mui-title">Serving Order</h1>
		</header>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/service" class="mui-tab-item">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">Services</span>
			</router-link>
			<router-link to="/order" class="mui-tab-item">
				<span class="mui-icon mui-icon-list"></span>
				<span class="mui-tab-label">Orders</span>
			</router-link>
			<router-link to="/cleaner" class="mui-tab-item mui-active">
				<span class="mui-icon mui-icon-contact"></span>
				<span class="mui-tab-label">Cleaners</span>
			</router-link>
			<router-link to="/setting" class="mui-tab-item">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">Settings</span>
			</router-link>
		</nav>
		<div class="mui-content">
      <div>
				<div class="">
        <select v-model="city" @change="refresh()" style="float:left;padding:15px;border-right: 1px solid grey !important;border-radius: 0px;" class="mui-btn mui-btn-block">
					<option value="0">All Cities</option>
					<option value="1">Vancouver</option>
					<option value="2">Richmond</option>
					<option value="3">Burnaby</option>
					<option value="4">Coquiltlam</option>
        	<option value="5">Surrey</option>
				</select>
        <select v-model="price" @change="refresh()" style="border-left: 1px solid grey !important;border-radius: 0px;padding:15px;" class="mui-btn mui-btn-block">
					<option value="0">All Prices</option>
					<option value="1">$10-$15</option>
					<option value="2">$15-$20</option>
					<option value="3">$20-$25</option>
          <option value="4">$25-$30</option>
				</select>
				</div>
			</div>
			<ul class="mui-table-view">
        <template v-for="da in data">
          <div class="mui-table-view-cell mui-input-row mui-media mui-left">
              <img class="mui-media-object mui-pull-left" style="border-radius: 100%" :src="da.avatar == null ?url():da.avatar ">
              <router-link :to="{ name: 'CleanerReview', params: { cleaner: da}}" type="button" class="mui-btn mui-btn-primary view-btn">View</router-link>
              <h5 class="mui-pull-right"></h5>
              <div class="mui-media-body">
                <h4 class='mui-ellipsis' style="text-align:left">{{da.name}}&nbsp;
                  <template v-for="i in da.rate">
                      <i data-index="1" style="color: goldenrod;" class="mui-icon mui-icon-star-filled"></i>
                  </template>
                </h4>
                <p class='mui-ellipsis'><span  style="float:left">{{getCityName(da.city)}}</span>&nbsp; <span style="color:red;margin-right:70px;float:right">Price: ${{da.pay_rate}}/hr</span></p>
              </div>
           
          </div>
        </template>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <p v-if="busy && loading"><span class="mui-spinner"></span></p>
          <p v-if="!loading">No More Cleaner</p>
        </div>
			</ul>
		</div>

	</body>
</template>

<script>
import axios from "axios";
import cleanerReview from './CleanerReview.vue'
var count = 0;
export default {
  name: "cleaner",
  components:{
    cleanerReview
  },
  data() {
    return {
      busy: false,
      data: [],
      page: 0,
      loading: true,
      cleaner: null,
      modalClass: "mui-modal",
      city: 0 ,
      price: 0,
      cleaner_page: 0,
      cleaner_reviews: [],
      cleaner_loading: true,
      cleaner_busy: false
    };
  },
  mounted() {
    console.log(this.cleaner_loading);
    console.log(this.cleaner_busy);
  },
  methods: {
    refresh: function() {
       console.log(this.city,this.price);
       this.data = [];
       this.page = 0;
       this.loadMore();
    },
    view: function(da) {
      this.cleaner_reviews=[];
      this.cleaner_loading = true;
      this.cleaner_busy = false;
      this.cleaner_page=0;
      this.cleaner = da;
      this.modalClass = "mui-modal mui-active";
    },
    closeModal: function(da) {
      this.modalClass = "mui-modal";
    },
    redirect: function() {
      // this.$router.replace("hello");
    },
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        axios
          .post(
            "http://foreclean.tk:8000/api/getCleanerList",
            JSON.stringify({"city": this.city,"price": this.price})
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              this.page++;
              this.data = this.data.concat(response.data.cleaners);
              if (response.data.cleaners.length < 10) {
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
    },
    loadMoreCleaner: function() {
      this.cleaner_busy = true;

      setTimeout(() => {
        axios
          .post(
            "http://foreclean.tk:8000/api/getReviewForCleaner",
            JSON.stringify({"cleaner_id": this.cleaner.id,"offset": this.cleaner_page*10})
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              this.cleaner_page++;
              this.cleaner_reviews = this.cleaner_reviews.concat(response.data.reviews);

              if (response.data.reviews.length < 5) {
                this.cleaner_busy = true;
                this.cleaner_loading = false;
              } else {
                this.cleaner_busy = false;
              }
              console.log(this.cleaner_loading,this.cleaner_busy);
            } else {
              mui.toast("数据获取失败");
              this.cleaner_busy = false;
            }
          })
          .catch(error => {
            this.cleaner_busy = false;
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
.mui-icon-star-filled {
  font-size: 14px !important;
}
.mui-btn-block {
    display: inline;
    padding: 15px auto;
    width:50%; 
    text-align-last: center !important; 
    text-align: center !important; 
    padding: 15px 50px;
    margin-bottom: 0px;
}

.view-btn {
  width: auto !important;
}
.mui-android .mui-modal .mui-bar {
    position: absolute !important;
}
</style>
