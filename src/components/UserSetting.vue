<template>
  <div class="sign-up">
		<header class="mui-bar mui-bar-nav">
			<router-link to="/setting" class=" mui-icon mui-icon-left-nav mui-pull-left"></router-link>
			<h1 class="mui-title">User Setting</h1>
		</header>
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<div class="mui-content">
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
							<p class="weui-uploader__title">Avatar Upload</p>
					</div>
					<div class="weui-uploader__bd">
							<ul class="weui-uploader__files" id="uploaderFiles">
								<template v-for="image of images">
									<img :src="image" @click="showImage(image)" :style="'width: 79px;height: 79px;position: absolute; left: 0; right: 0; margin: auto;border-radius:100%;'"></li>
								</template>
							</ul>		
							<div :style="'background-size: 100% 100%;;position: absolute; left: 0; right: 0; margin: auto;border-radius:100%;background-image:url('+(user.avatar == null ? url():user.avatar) +')'" class="weui-uploader__input-box" v-if="images.length<1">
									<input id="uploaderInput" name="attach" @change="filesChange($event)" class="weui-uploader__input" type="file" accept="image/*" />
							</div>
					</div>
			</div>
			<div class="mui-content-padded" style="margin: 5px;">
				<h3 style="margin:100px"></h3>
				<div class="mui-input-row">
					<input type="text" class="mui-input-clear"  v-model="user.name" placeholder="Name">
				</div>
				<div class="mui-input-row">
					<input type="number" class="mui-input-clear"  v-model="user.phone" placeholder="Phone">
				</div>
					<div class="mui-button-row">
						<button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="change">Change</button>&nbsp;&nbsp;
        </div>
			</div>
		</div>
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
export default {
  name: "userSetting",
  data: function() {
    return {
      loading: false,
      user: null,
      images: [],
      selected_image: null
    };
  },
  created() {
    if (!this.$route.params.user) {
      this.$router.push("/setting");
    }
    this.user = this.$route.params.user;

    console.log(this.user);
  },
  watch: {
    phone: function(val) {
      this.phone = val.substring(0, 10);
    }
  },
  methods: {
    showImage: function(selected_image) {
      this.selected_image = selected_image;
    },
    deleteImage: function(selected_image) {
      this.selected_image = null;
      this.images.splice(this.images.indexOf(selected_image), 1);
    },
    change: function() {
      if (this.user.phone.length != 10) {
        mui.toast("Phone Number is not Correct!");
        return;
      }
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      axios
        .post(
          "http://foreclean.tk:8000/api/changeUserSetting",
          JSON.stringify({
            avatar: this.images.length == 0 ? null : this.images[0],
            name: this.user.name,
            phone: this.user.phone
          }),
          config
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            mui.toast("Update Successfullu!");
            localStorage.setItem("user", JSON.stringify(response.data.user));
            this.$router.push("/setting");
          } else {
            mui.toast("Failed");
          }
        })
        .catch(error => {
          mui.toast("Failed");
          console.log(error.response);
        });
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
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.mui-btn-block {
  padding: 5px 0px;
}
</style>
