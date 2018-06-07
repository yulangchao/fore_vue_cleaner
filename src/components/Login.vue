<template>
<body>
		<header class="mui-bar mui-bar-nav">
			<h1 style="color:white" class="mui-title">Login</h1>
		</header>
		<div id="modal" v-if="loading" class="mui-modal mui-active" style="opacity: 0.6;">
          <span class="mui-spinner" style="    top: 50%;
        position: absolute;
        width: 40px;
        height: 40px;left: 0;
        right: 0;    margin: auto;"></span>
		</div>
		<div class="mui-content mui-text-center" style="background: transparent;color:white;margin:0 50px;">

			<img style="width:100%;margin:60px 0px 30px 0px" src="https://static.wixstatic.com/media/1da006_55b6d2136ae945e58b7b3c614253450b~mv2.png/v1/fill/w_258,h_64,al_c/1da006_55b6d2136ae945e58b7b3c614253450b~mv2.png">

	

		
      <div class="mui-input-row">
        <label><i class="fas fa-user-circle" style="font-size: 20px;"></i></label>
        <input type="text" class="mui-input-clear" v-model="email" placeholder="Email">
      </div>
      <div class="mui-input-row">
        <label><i class="fas fa-key" style="font-size: 20px;"></i></label>
        <input type="password" class="mui-input-clear" v-model="password" placeholder="Password">
      </div>
      <p style="color:#0c0cec" @click="forgetPassword"><a>Forget Password?</a></p>
      <button   v-on:click="signIn" style="width:100%;color:white;background:#EB482F;border-color: #EB482F;" class="mui-btn mui-btn-blue">Login</button>

			<router-link to="/sign-up"><button type="button" style="width:100%;margin:30px 0px 30px 0px" class="mui-btn mui-btn-blue">Register</button></router-link>

		</div>
</body>
</template>

<script>
import firebase from "firebase";
import "vue-awesome-mui/mui/dist/js/mui.js";
import axios from "axios";
export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  methods: {
    signIn: function() {
      this.loading = true;
      axios
        .post(
          "http://foreclean.tk:8000/api/login",
          JSON.stringify({
            email: this.email,
            password: this.password
          })
        )
        .then(response => {
          console.log(response);
          if (response.data.success == true) {
            console.log(response);
            localStorage.setItem("access_token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            mui.toast("Login Successfully!");
            this.$router.replace("order");
            this.loading = false;
          } else {
            this.loading = false;
            mui.toast("账号密码错误，或未激活！");
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error.response);
        });
    },
    forgetPassword: function() {
      var btnArray = ["Cancel", "Send"];
      mui.prompt(
        "Please Enter Your Email：",
        "Email",
        "Forget Password",
        btnArray,
        e => {
          if (e.index == 1) {

          } else {
          }
        }
      );
    }
  }
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
body {
  background-image: url("https://public47.com/wp-content/uploads/2016/03/img_cap05-600x800.jpg");
  /* Full height */
  height: 100vh;
  overflow: hidden;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.mui-input-row {
  margin: 15px 0;
  width: 100%;
  background: white;
  border-radius: 20px;
}
.mui-input-row i {
  color: black;
}
.mui-input-row input {
  color: black;
  width: 80% !important;
}

.mui-input-row label {
  width: 20%;
}
</style>
