<template>
	<body>
		<header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1  style="color:white" v-if="user" class="mui-title">{{user.name}}'s Review</h1>
		</header>
		<nav class="mui-bar mui-bar-tab">
			<router-link to="/schedule" class="mui-tab-item">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">Schedule</span>
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
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<div class="mui-content">
			<ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell mui-media">
					<a class="">
						<img v-if="user" class="mui-media-object mui-pull-left head-img" id="head-img" :src="user.avatar==null? url() :  user.avatar">
						<div v-if="user" class="mui-media-body">
							{{user.name}}
						</div>
					</a>
				</li>
			</ul>
			<div class="mui-content-padded" style="margin-left: 6px;">
				<div class="mui-inline">Rate:</div>
				<div class="icons mui-inline" style="margin-left: 6px;">
					<i data-index="1" class="mui-icon mui-icon-star"></i>
					<i data-index="2" class="mui-icon mui-icon-star"></i>
					<i data-index="3" class="mui-icon mui-icon-star"></i>
					<i data-index="4" class="mui-icon mui-icon-star"></i>
					<i data-index="5" class="mui-icon mui-icon-star"></i>
				</div>
			</div>
			<div class="mui-content-padded">
				<div class="mui-inline">Comments</div>

			</div>
			<div class="row mui-input-row">
				<textarea id='question' v-model="comments" class="mui-input-clear question" placeholder="Please Give a Comment"></textarea>
			</div>


			<div class="weui-gallery" v-if="selected_image" style="display:block">
				<span class="weui-gallery__img"  @click="selected_image=null" :style="'background-image: url('+selected_image+')'"></span>
				<div class="weui-gallery__opr">
						<a href="javascript:" class="weui-gallery__del" @click="deleteImage(selected_image)">
								<i class="weui-icon-delete weui-icon_gallery-delete"></i>
						</a>
				</div>
			</div>
			<div class="weui-uploader" style="padding: 10px;">
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
			</div>

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
      loading: false
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.$route.params.order) {
      this.$router.push("/order/finish");
    }
    this.order = this.$route.params.order;
    mui(".icons").on("tap", "i", (e) => {
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
              if (this.images.length < 5){
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
          "http://foreclean.tk:8000/api/postReviewForCleaner",
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
						mui.toast("评价成功");
						this.$router.push("/order/finish")
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
  font-size: 22px;
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
</style>
