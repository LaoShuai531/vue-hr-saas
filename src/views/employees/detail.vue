<!-- 查看的详情页 -->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="loginForm" :model="formData" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info /> -->
            <!-- component中的is必须是动态变量 -->
            <!-- 我们使用了动态组件component，它通过is属性来绑定需要显示在该位置的组件，is属性可以直接为注册组件的组件名称即可 -->
            <!-- 动态组件可以切换组件 -->
            <component :is="userInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'

export default {
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      // 将动态路由参数id赋值给了userId这个属性
      userInfo: 'user-info',
      jobInfo: 'job-info',
      userId: this.$route.params.id, // 直接将路由中的参数赋值给data中的属性
      formData: {
        username: '',
        password2: '' // 为啥是password2 因为读取出来的password是密文
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }, { min: 1, max: 6, message: '姓名长度为1-4位', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.userId)
    },
    saveUser() {
      // 调用方法时 应该校验
      this.$refs.loginForm.validate(async isOK => {
        if (isOK) {
          // 将新密码的值替换原密码的值
          await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
          this.$message.success('修改账户信息成功')
        }
      })
    }
  }
}
</script>

<style>

</style>
