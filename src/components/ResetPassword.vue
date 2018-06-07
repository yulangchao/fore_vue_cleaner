<template>
  <div class="sign-up">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">Reset Password</h1>
		</header>
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<div class="mui-content">
			<div class="mui-content-padded" style="margin: 5px;">
				<h3 style="margin:60px"></h3>
				<div class="mui-input-row">
					<input type="text" class="mui-input-clear"  v-model="email" placeholder="Email">
				</div>
				<div class="mui-input-row">
					<input type="number" class="mui-input-clear"  v-model="phone" placeholder="Phone">
				</div>
				<div class="mui-input-row mui-password">
					<input type="password" class="mui-input-password" v-model="password" placeholder="Password">
				</div>
				<div class="mui-input-row mui-password">
					<input type="password" class="mui-input-password" v-model="repassword" placeholder="Comfirm Password">
				</div>
					<div class="mui-button-row">
						<button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="signUp">Change</button>&nbsp;&nbsp;
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
      email: "",
      password: "",
      repassword: "",
      phone: "",
      loading:false,
      user: null
    };
  },
  watch: {
    phone: function (val) {
      this.phone = val.substring(0,10);
    },
  },
  methods: {
    signUp: function() {
      
      if (this.phone.length!=10){
        mui.toast("Phone Number is not Correct!");
        return;
      }
      if (this.password != this.repassword){
        mui.toast("Passwords are not matched!");
        return;
      }
      this.loading = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            axios
              .post(
                "http://foreclean.tk:8000/api/getAccessCode",
                JSON.stringify({
                  name: this.email.split("@")[0],
                  phone: this.phone,
                  email: this.email,
                  uid: user.uid,
                  source: 1
                })
              )
              .then(response => {
                console.log(response);
                if (response.data.success == true) {
                  console.log(response);
                  localStorage.setItem("access_token", response.data.token);
                  localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                  );
                  mui.toast("Login Successfully!");
                  this.$router.replace("service");
                } else {
                  mui.toast("注册失败，请稍后再试");
                }
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                console.log(error.response);
              });
          },
          err => {
            alert("Oops. " + err.message);
            this.loading = false;
          }
        );
    }
  }
};
</script>

<style scoped>
 .mui-btn-block{
    padding:5px 0px;
 }
</style>
