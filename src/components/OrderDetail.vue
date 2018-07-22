<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon  mui-action-back mui-icon-left-nav mui-pull-left"></a>
			<h1  style="color:white" class="mui-title">Order Detail</h1>
		</header>
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>

		<div class="mui-content">
      <div>
		    <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h4 class="mui-ellipsis" style="white-space:initial">{{order.address}}</h4>
                        <h5 style="font-weight:bold;color:#EB482F ">Status: {{getOrderStatus(order.order_status)}}</h5>
		                    <h5 style="font-weight:bold">Booked Time: {{order.time.replace("T", " ").split(".")[0]}} + <span style="color:red"> {{order.hours}} Hours</span></h5>
                        <h5 style="font-weight:bold">Created Time: {{order.created_at}}</h5>
		                    <p class="mui-h6 mui-ellipsis">
                          <button type="button" class="mui-btn mui-btn-primary">Bedroom <span class="mui-badge mui-badge-primary">{{order.bedroom}}</span></button>
                          &nbsp;<button type="button" class="mui-btn mui-btn-success">Bathroom <span class="mui-badge mui-badge-success">{{order.bathroom}}</span></button>
                          <template v-for="additional of order.additional">
                                <div style="font-size:15px"><i class="fas fa-check-circle"></i>    {{getAdditionalName(additional)}}</div>
                          </template>
                          <div  v-if="order.notes!=''" style="font-size:15px;font-weight:bold" class="mui-h6">Other Requests: <h4 class="mui-ellipsis" style="font-size:15px !important;white-space:initial">{{order.notes}}</h4></div>
                        </p>
		                </div>
		                <!-- <div class="mui-table-cell mui-col-xs-2 mui-text-right">
		                    <span class="mui-h5">12:25</span>
		                </div> -->
		            </div>
		        </li>
		    </ul>
        <h5 v-if="order.user_id" class="font-bold">*Selected Cleaner</h5>
        <ul v-if="order.user_id" class="mui-table-view">
          <template v-if="order.user_id">
            <div class="mui-table-view-cell mui-input-row mui-media mui-left">
                <img class="mui-media-object mui-pull-left" style="border-radius:100%" v-lazy="order.user_other.avatar==null?url() : order.user_other.avatar">
                <button type="button" class="mui-btn mui-btn-primary view-btn" @click="getClientReview" >View</button>
                <h5 class="mui-pull-right"></h5>
                <div class="mui-media-body">

                  <h4 class='mui-ellipsis' style="text-align:left">{{order.name}}&nbsp;
                    <template v-for="i in order.user_other.rate">
                        <i data-index="1" style="color: goldenrod;" class="mui-icon mui-icon-star-filled"></i>
                    </template>
                  </h4>
                </div>
            
            </div>
          </template>
        </ul>

        <h5 class="font-bold">*Fee Details</h5>
		    <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h5 class="mui-ellipsis">Service Fee: {{order.price}}</h5>
                        <h5 class="mui-ellipsis">Agent Fee: {{order.agent_fee}}</h5>
		                    <h5 class="mui-ellipsis" style="font-weight:bold">Total Fee: {{order.price + order.agent_fee}}</h5>
		                </div>
		                <!-- <div class="mui-table-cell mui-col-xs-2 mui-text-right">
		                    <span class="mui-h5">12:25</span>
		                </div> -->
		            </div>
		        </li>
		    </ul>
        <h5 v-if="order.order_status == 7 || order.order_status == 8 || order.order_status == 9" class="mui-text-left">*Canceled Reason</h5>
		    <ul v-if="order.order_status == 7 ||order.order_status == 8 || order.order_status == 9" class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h5 class="mui-ellipsis">{{order.cancel_reason}}</h5>
                      
		                </div>
		            </div>
		        </li>
		    </ul>
        <h5 v-if="order.review_status == 1 && review" class="">*Comment To Me</h5>
		    <ul v-if="order.review_status == 1 && review" class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h5 class="mui-ellipsis">{{review.comments}}</h5>
                        <div v-if="JSON.parse(review.images).length>0" class="weui-uploader" style="padding: 10px;">
                          <div class="weui-uploader__bd">
                              <ul class="weui-uploader__files" id="uploaderFiles">
                                <template v-for="image of JSON.parse(review.images)"> 
                                  <li  @click="showImage(image,JSON.parse(review.images))" class="weui-uploader__file" :style="'background-image:url('+image+')'"></li>
                                </template>
                              </ul>
                          </div>
                      </div>
		                </div>
		            </div>
		        </li>
		    </ul>
        <h5 v-if="reviewToMe.length >0" class="">*Comment To Client</h5>
		    <ul v-if="reviewToMe.length >0 && reviewToMe" class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h5 class="mui-ellipsis">{{reviewToMe[0].comments}}</h5>
		                </div>
		            </div>
		        </li>
		    </ul>
			</div>
		</div>
    <div class="weui-gallery" v-if="selected_image" style="display:block">
      <span class="weui-gallery__img"  @click="closeImage()" :style="'background-image: url('+selected_image+');height: 100vh;'"></span>
      <a href="javascript:" class="weui-gallery__del"   @click="PrevImage()" style="width:50px;left:0;height:100vh;position:absolute;z-index:1000">
        <i style="position:absolute;top:50vh;left:5px;    font-size: 30px;color:#eb482f" class="fas fa-chevron-circle-left"></i>
      </a>
      <a href="javascript:" class="weui-gallery__del" @click="NextImage()" style="width:50px;right:0;height:100vh;position:absolute;z-index:1000">
        <i style="position:absolute;top:50vh;right: 5px;    font-size: 30px;color:#eb482f" class="fas fa-chevron-circle-right" ></i>
      </a>
      <div class="weui-gallery__opr">

			</div>
    </div>
	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";

import { Card, createToken } from "vue-stripe-elements-plus";

var count = 0;
export default {
  name: "orderDetail",
  components: { Card },
  data() {
    return {
      order: null,
      cleaner: null,
      loading: false,
      pendding_cleaners: [],
      review: null,
      selected_image: null,
      ga_images: [],
      cleaner_list: [],
      reviewToMe: []
    };
  },
  created() {
    this.cleaner_list = JSON.parse(localStorage.getItem("saved_cleaners"));
    if (!this.$route.params.order) {
      this.$router.push("/order");
    }
    this.order = this.$route.params.order;
  },
  mounted() {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    };
    if (this.order.order_status != 1) {
      axios
        .post(
          "http://foreclean.tk:8000/api/getCleanerList",
          JSON.stringify({ cleaner_id: this.order.cleaner_id })
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            this.cleaner = response.data.cleaners[0];
          } else {
            mui.toast(response.data.error);
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    } else {
      // axios
      //   .post(
      //     "http://foreclean.tk:8000/api/getResponseList",
      //     JSON.stringify({ order_id: this.order.id }),
      //     config
      //   )
      //   .then(response => {
      //     console.log(response);
      //     if (response.data.success == true) {
      //       this.pendding_cleaners = response.data.cleaners;
      //     } else {
      //       mui.toast(response.data.error);
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error.response);
      //   });
    }

    if (this.order.review_status == 1) {
      axios
        .post(
          "http://foreclean.tk:8000/api/getReviewForOrder",
          JSON.stringify({ order_id: this.order.id }),
          config
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            this.review = response.data.review;
          } else {
            mui.toast(response.data.error);
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
    if (this.order.order_status >5) {
      axios
        .post(
          "http://foreclean.tk:8000/api/getReviewForClientwithOrder",
          JSON.stringify({ order_id: this.order.id }),
          config
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            this.reviewToMe = response.data.reviews;
          } else {
            mui.toast(response.data.error);
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  },
  methods: {
    getClientReview (){
      this.$router.push({
        name: "ClientReview",
        params: { nav : 'select', user_id: this.order.user_id, order:this.order }
      });
    },
    NextImage: function() {
      let index = this.ga_images.indexOf(this.selected_image);
      if (index < this.ga_images.length - 1) {
        this.selected_image = this.ga_images[index + 1];
      }
    },
    PrevImage: function() {
      let index = this.ga_images.indexOf(this.selected_image);
      if (index > 0) {
        this.selected_image = this.ga_images[index - 1];
      }
    },
    showImage: function(selected_image, ga_images) {
      this.selected_image = selected_image;
      this.ga_images = ga_images;
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          "content",
          "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2"
        );
    },
    closeImage: function() {
      this.selected_image = null;
      this.ga_images = [];
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          "content",
          "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mui-content {
  padding-top: 0px;
}
.stripe-card {
  background-color: white;
  height: 40px;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a !important;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}

.stripe-card.complete {
  border-color: green;
}
.mui-input-row .mui-btn {
    
    width: auto;
}
</style>
