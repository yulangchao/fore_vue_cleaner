<template>
	<body>
		<header class="mui-bar mui-bar-nav">
			<router-link to="/order" class="mui-icon mui-icon-left-nav mui-pull-left"></router-link>
			<h1  style="color:white" class="mui-title">Payment</h1>
		</header>
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<nav class="mui-bar mui-bar-tab">
					<button class="weui-btn weui-btn_primary pay-with-stripe"  @click='pay' :disabled='!complete' type="submit" id="showTooltips">Pay</button>
		</nav>
		<div class="mui-content">
      <div>
		    <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
		        <li class="mui-table-view-cell">
		            <div class="mui-table">
		                <div class="mui-table-cell mui-col-xs-12 mui-text-left">
		                    <h4 class="mui-ellipsis" style="white-space: initial">{{order.address}}</h4>
		                    <h5 style="font-weight:bold">Booked Time: {{order.time.replace("T", " ").split(".")[0]}} + <span style="color:red"> {{order.hours}} Hours</span></h5>
		                    <p class="mui-h6 mui-ellipsis">
                          <button type="button" class="mui-btn mui-btn-primary">Bedroom <span class="mui-badge mui-badge-primary">{{order.bedroom}}</span></button>
                          &nbsp;<button type="button" class="mui-btn mui-btn-success">Bathroom <span class="mui-badge mui-badge-success">{{order.bathroom}}</span></button>
                          <template v-for="additional of order.additional">
                                <div style="font-size:15px"><i class="fas fa-check-circle"></i>    {{getAdditionalName(additional)}}</div>
                          </template>
                        </p>
		                </div>
		                <!-- <div class="mui-table-cell mui-col-xs-2 mui-text-right">
		                    <span class="mui-h5">12:25</span>
		                </div> -->
		            </div>
		        </li>
		    </ul>
        <h5 class="mui-text-left">*Selected Cleaner</h5>
        <ul class="mui-table-view">
          <template v-if="cleaner">
            <div class="mui-table-view-cell mui-input-row mui-media mui-left">
                <img class="mui-media-object mui-pull-left" style="border-radius: 2px" :src="cleaner.avatar==null? url() : cleaner.avatar">
                <!-- <button type="button" class="mui-btn mui-btn-primary view-btn" @click="dialog" >Select</button> -->
                <h5 class="mui-pull-right"></h5>
                <div class="mui-media-body">
                  <h4 class='mui-ellipsis' style="text-align:left">{{cleaner.name}}&nbsp;
                    <template v-for="i in cleaner.rate">
                        <i data-index="1" style="color: goldenrod;" class="mui-icon mui-icon-star-filled"></i>
                    </template>
                  </h4>
                  <!-- <p class='mui-ellipsis distance'>15km</p> -->
                  <p class='mui-ellipsis'><span  style="float:left">{{getCityName(cleaner.city)}}</span>&nbsp; <span style="color:red;margin-right:10px;float:right">Price: {{cleaner.pay_rate}}/hr</span></p>
                </div>
            
            </div>
          </template>
        </ul>
        <h5 class="mui-text-left">*Payment Details</h5>
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
			</div>
      <h5 class="mui-text-left">*Payment Method</h5>
			<card class='stripe-card'
				:class='{ complete }'
				stripe='pk_test_zvxO3V9yapMgUkV6TehE1nLW'
				:options='stripeOptions'
				@change='complete = $event.complete'
			/>

		
		</div>
	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";

import { Card, createToken } from "vue-stripe-elements-plus";

var count = 0;
export default {
  name: "payment",
  components: { Card },
  data() {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      order: null,
      cleaner: null,
      loading: false
    };
  },
  created() {
    if (!this.$route.params.order) {
      mui.toast("Please pay with your order!");
      this.$router.push("/order");
    }
    this.order = this.$route.params.order;
    console.log(this.order.additional);
    // this.order.additional = this.order.additional.substring(1, this.order.additional.length-1).split(',');
    console.log(this.order);
  },
  mounted() {
    if(1){
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
    }
  },
  methods: {
    pay() {
      this.loading = true;
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      createToken().then(data => {
        console.log(data.token);
        axios
          .post(
            "http://foreclean.tk:8000/api/postPayment",
            JSON.stringify({ token: data.token.id, order_id: this.order.id }),
            config
          )
          .then(response => {
            console.log(response);
            if (response.data.success == true) {
              mui.toast(response.data.message);
              this.loading = false;
              this.$router.push("/order/book");
            } else {
              mui.toast(response.data.error);
              this.loading = false;
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      });
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
</style>
