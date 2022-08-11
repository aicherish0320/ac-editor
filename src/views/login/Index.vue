<template>
  <div class="login-page">
    <a-row>
      <a-col :span="12" class="aside">
        <div class="aside-inner">
          <router-link to="/">
            <img alt="慕课乐高" src="@/assets/logo2.png" class="logo-img" />
          </router-link>
          <h2>这是我用过的最好的建站工具</h2>
          <span class="text-white-70">王铁锤, Google</span>
        </div>
      </a-col>
      <a-col :span="12" class="login-area">
        <a-form layout="vertical" :model="form" ref="loginForm">
          <h2>欢迎回来</h2>
          <p class="subTitle">使用手机号码和验证码登录到慕课乐高</p>
          <a-form-item label="手机号码" required name="cellphone">
            <a-input placeholder="手机号码" v-model:value="form.cellphone">
              <template v-slot:prefix
                ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="验证码" required name="verifyCode">
            <a-input placeholder="四位验证码" v-model:value="form.verifyCode">
              <template v-slot:prefix
                ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" @click="login">
              登录
            </a-button>
            <a-button
              size="large"
              :style="{ marginLeft: '20px' }"
              @click="getCode"
            >
              获取验证码
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'
import * as userApi from '@/apis/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  cellphone: '',
  verifyCode: ''
})

const login = async () => {
  try {
    const ret = await userApi.login({
      phoneNumber: form.cellphone,
      veriCode: form.verifyCode
    })
    window.localStorage.setItem('ac_editor_token', ret.token)
    message.success('登陆成功，1s后跳转到首页')
    setTimeout(() => {
      router.push('/editor')
    }, 1000)
  } catch (error: any) {
    message.error(error)
  }
}
const getCode = async () => {
  try {
    await userApi.getCode({ phoneNumber: form.cellphone })
    message.success('验证码发送成功')
  } catch (error: any) {
    message.error(error)
  }
}
</script>

<style>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #1a1919;
  background-size: cover;
  background-repeat: no-repeat;
}
.aside .logo-img {
  width: 200px;
  margin-bottom: 20px;
}
.aside h2 {
  color: #cccccc;
  font-size: 29px;
}
.aside-inner {
  width: 60%;
  text-align: center;
}
.login-area {
  height: 100vh;
}
.login-area .ant-form {
  width: 350px;
}
.text-white-70 {
  color: #999;
  display: block;
  font-size: 19px;
}
.aside,
.login-area {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.login-area .ant-form-item-label {
  display: none;
}
.login-area .ant-input-prefix {
  left: auto;
  right: 30px;
  font-size: 19px;
}
.login-area .ant-input {
  font-size: 17px;
  padding: 20px 45px 20px 30px;
}
</style>
