<template>
  <div class="sign-up">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">Register</h1>
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
				<h3 style="margin:60px 0px 20px 0px">Register</h3>
        <h4 style="margin:60px 0px 20px 0px">{{message}}</h4>
				<div class="mui-input-row">
					<input type="text" class="mui-input-clear"  v-model="name" placeholder="Nick Name">
				</div>
				<div class="mui-input-row">
					<input type="text" class="mui-input-clear"  v-model="legal_name" placeholder="Legal Name">
				</div>
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
						<button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="signUp">Register</button>&nbsp;&nbsp;
						<router-link to="/login" type="button" class="mui-btn mui-btn-danger mui-btn-block">Return</router-link>
					</div>
			</div>
		</div>
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
export default {
  name: "signUp",
  data: function() {
    return {
      email: "",
      password: "",
      repassword: "",
      phone: "",
      loading: false,
      message: "",
      name: "",
      legal_name: ""
    };
  },
  watch: {
    phone: function(val) {
      this.phone = val.substring(0, 10);
    }
  },
  methods: {
    validateEmail: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    signUp: function() {
      if (!this.name || !this.legal_name) {
        mui.toast("Name or Legal Name is Needed!");
        return;
      }
      if (!this.validateEmail(this.email)) {
        mui.toast("Email is not Correct!");
        return;
      }
      if (this.phone.length != 10) {
        mui.toast("Phone Number is not Correct!");
        return;
      }
      if (this.password != this.repassword) {
        mui.toast("Passwords are not matched!");
        return;
      }
      this.loading = true;
      axios
        .post(
          "http://foreclean.tk:8000/api/register",
          JSON.stringify({
            name: this.name,
            phone: this.phone,
            email: this.email,
            legal_name: this.legal_name,
            password: this.password
          })
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            console.log(response);
            mui.toast("Register Successfully!");
            this.message ="Please contact the 6047195215 for verification";
            
          } else {
            mui.toast(response.data.error);
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error.response);
        });
    }
  }
};
</script>

<style scoped>
.mui-btn-block {
  padding: 5px 0px;
}
</style>
