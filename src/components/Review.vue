<template>
	<body>
		<header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1  style="color:white;text-transform: capitalize;" v-if="cleaner" class="mui-title">{{cleaner.name}}'s Review</h1>
		</header>
		<!-- <nav class="mui-bar mui-bar-tab">
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
		</nav> -->
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<div class="mui-content">
		    <ul v-if="order" class="mui-table-view mui-table-view-striped mui-table-view-condensed">
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
                        </p>
		                </div>
		                <!-- <div class="mui-table-cell mui-col-xs-2 mui-text-right">
		                    <span class="mui-h5">12:25</span>
		                </div> -->
		            </div>
		        </li>
		    </ul>
        <h5>Client Info</h5>
        <ul v-if="order" class="mui-table-view">
          <template v-if="order">
            <div class="mui-table-view-cell mui-input-row mui-media mui-left">
                <img class="mui-media-object mui-pull-left" style="border-radius:100%" v-lazy="order.user_other.avatar==null?url() : order.user_other.avatar">
                
                <h5 class="mui-pull-right"></h5>
                <div class="mui-media-body">

                  <h4 class='mui-ellipsis' style="text-align:left">{{order.name}}&nbsp;
                    <template v-for="i in order.user_other.rate">
                        <i data-index="1" style="color: goldenrod;font-size:15px !important" class="mui-icon mui-icon-star-filled"></i>
                    </template>
                  </h4>
                  <p class="mui-h6 mui-ellipsis" style="text-align:left">Phone: {{order.phone}}</p>
                </div>
            
            </div>
          </template>
        </ul>

			<div class="mui-content-padded">
				<h5 class="mui-inline">Review Comments:</h5>

			</div>

			<div class="mui-content-padded" style="margin-left: 6px;">
				<h5 class="mui-inline">Rate:</h5>
				<div class="icons mui-inline" style="margin-left: 6px;">
					<i data-index="1" class="mui-icon mui-icon-star"></i>
					<i data-index="2" class="mui-icon mui-icon-star"></i>
					<i data-index="3" class="mui-icon mui-icon-star"></i>
					<i data-index="4" class="mui-icon mui-icon-star"></i>
					<i data-index="5" class="mui-icon mui-icon-star"></i>
				</div>
			</div>
      

			<div class="row mui-input-row">
				<textarea id='question' v-model="comments" class="mui-input-clear question" placeholder="Please Give a Review Comment"></textarea>
			</div>


			<div class="weui-gallery" v-if="selected_image" style="display:block">
				<span class="weui-gallery__img"  @click="selected_image=null" :style="'background-image: url('+selected_image+')'"></span>
				<div class="weui-gallery__opr">
						<a href="javascript:" class="weui-gallery__del" @click="deleteImage(selected_image)">
								<i class="weui-icon-delete weui-icon_gallery-delete"></i>
						</a>
				</div>
			</div>
			<!-- <div class="weui-uploader" style="padding: 10px;margin-bottom: 100px;">
					<div class="weui-uploader__hd">
							<p class="weui-uploader__title">Image Upload</p>
							<div class="weui-uploader__info">{{images.length}}/5</div>
					</div>
					<div class="weui-uploader__bd">
							<ul class="weui-uploader__files" id="uploaderFiles">
								<template v-for="image of images">
									<li @click="showImage(image)" class="weui-uploader__file" :style="'background-image:url('+image+')'"></li>
								</template>
							</ul>
							<div class="weui-uploader__input-box" v-if="images.length<5">
									<input id="uploaderInput" name="attach" @change="filesChange($event)" class="weui-uploader__input" type="file" accept="image/*" multiple />
							</div>
					</div>
			</div> -->

		</div>
		<button class="mui-btn mui-btn-primary  mui-btn-block submit" @click="sendReview">提交</button>
	</body>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
var count = 0;
export default {
  name: "review",
  data() {
    return {
      data: [],
      user: null,
      startIndex: 0,
      comments: "",
      images: [],
      selected_image: null,
      order: null,
      rate: 0,
      loading: false,
      cleaner: null
    };
  },
  created() {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.$route.params.order) {
      this.$router.push("/order/finish");
    }
    this.order = this.$route.params.order;
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
    mui(".icons").on("tap", "i", e => {
      var index = parseInt(e.target.getAttribute("data-index"));
      var parent = e.target.parentNode;
      var children = parent.children;
      if (e.target.classList.contains("mui-icon-star")) {
        for (var i = 0; i < index; i++) {
          children[i].classList.remove("mui-icon-star");
          children[i].classList.add("mui-icon-star-filled");
        }
      } else {
        for (var i = index; i < 5; i++) {
          children[i].classList.add("mui-icon-star");
          children[i].classList.remove("mui-icon-star-filled");
        }
      }
      this.starIndex = index;
      this.rate = this.starIndex;
    });
  },
  methods: {
    showImage: function(selected_image) {
      this.selected_image = selected_image;
    },
    deleteImage: function(selected_image) {
      this.selected_image = null;
      this.images.splice(this.images.indexOf(selected_image), 1);
    },
    filesChange: function(e) {
      this.loading = true;
      let date = new Date().toISOString().substring(0, 10);
      let i = 0;
      for (let file of e.target.files) {
        this.loading = true;
        firebase
          .storage()
          .ref("/images/" + date + "/" + new Date().getTime() + i++)
          .put(file)
          .then(snapshot => {
            if (this.images.length < 5) {
              console.log("Uploaded a blob or file!");
              this.images.push(snapshot.metadata.downloadURLs[0]);
              console.log(snapshot.metadata.downloadURLs[0]);
            }
            this.loading = false;
          });
      }
      console.log(this.images);
    },
    sendReview: function() {
      console.log(this.rate);
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      axios
        .post(
          "http://foreclean.tk:8000/api/postReviewForClient",
          JSON.stringify({
            images: JSON.stringify(this.images),
            order_id: this.order.id,
            cleaner_id: this.order.cleaner_id,
            user_id: this.order.user_id,
            comments: this.comments,
            rate: this.rate
          }),
          config
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            mui.toast("Reviewed Successfully!");
            this.$router.push("/order/finish");
          } else {
            mui.toast("Failed");
          }
        })
        .catch(error => {
          mui.toast("Failed");
          console.log(error.response);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.submit{
  position: fixed;
  bottom: 0px;
  margin-bottom: 0px;
  padding: 10px 0px;
}
.mui-content {
  padding-top: 0px;
}
.feedback body {
  background-color: #efeff4;
}
.feedback input,
.feedback textarea {
  border: none !important;
}
.feedback textarea {
  height: 100px;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.feedback .row {
  width: 100%;
  background-color: #fff;
}
.feedback p {
  padding: 10px 15px 0;
}
/*.feedback button#submit { 
	width: 90%;
	height: 46px;
	left: 50%;
	-webkit-transform: translate(-50%);
}*/

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 14px;
}

.feedback .hidden {
  display: none;
}
.feedback .image-list {
  width: 100%;
  height: 85px;
  background-size: cover;
  padding: 10px 10px;
  overflow: hidden;
}
.feedback .image-item {
  width: 65px;
  height: 65px;
  /*background-image: url(../images/iconfont-tianjia.png);*/
  background-size: 100% 100%;
  display: inline-block;
  position: relative;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: solid 1px #e8e8e8;
  vertical-align: top;
}
.feedback .image-item .file {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 0;
}
.feedback .image-item.space {
  border: none;
}
.feedback .image-item .image-close {
  position: absolute;
  display: inline-block;
  right: -6px;
  top: -6px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 12px;
  background-color: #ff5053;
  color: #f3f3f3;
  border: solid 1px #ff5053;
  font-size: 9px;
  font-weight: 200;
  z-index: 1;
}
.feedback .image-item .image-up {
  height: 65px;
  width: 65px;
  border-radius: 10px;
  line-height: 65px;
  border: 1px solid #ccc;
  color: #ccc;
  display: inline-block;
  text-align: center;
}
.feedback .image-item .image-up:after {
  font-family: "微软雅黑";
  content: "+";
  font-size: 60px;
}
.feedback .image-item.space .image-close {
  display: none;
}
.feedback .mui-inline {
  vertical-align: bottom;
  font-size: 14px;
  color: #8f8f94;
}
.mui-icon-star {
  color: #b5b5b5;
  font-size: 22px;
}
.mui-icon-star-filled {
  color: #ffb400;
  font-size: 22px !important;
}
.mui-popover {
  height: 180px;
}
.stream {
  display: none;
}
.mui-plus-stream .stream {
  display: block;
}
.submit{
  max-width: 768px !important;
}

</style>
