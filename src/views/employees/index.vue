<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 全局封装的通用型工具栏组件 -->
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <!-- 插槽 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录 </span>
        </template>
        <!-- v-bind: => :  v-on: => @  v-slot:  => # -->
        <!-- 右侧显示按钮 Excel导入 Excel导出 新增员工 -->
        <!-- <template slot="after"> -->
        <template #after>
          <el-button size="small" type="danger" @click="exportData">普通excel导出</el-button>
          <el-button size="small" type="info" @click="exportMutiData">复杂表头excel导出</el-button>

          <el-button size="small" type="success" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>

      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" :data="list" border stripe>
          <!-- sortable可排序的意思 -->
          <!-- 表格中如何显示序号：type="index" -->
          <el-table-column align="center" type="index" label="序号" sortable width="80" />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column label="头像" align="center">
            <!-- 自定义内容 -->
            <template slot-scope="{ row }">
              <img
                v-imageerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable />
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
            <!-- 利用作用域插槽 + 过滤器 -->
            <!-- 通过row拿到当前结构渲染的数据 v-slot拿到obj对象，其下有一个row属性，该属性表示当前结构渲染的所有数据 -->
            <template slot-scope="{ row }">
              <!-- 将时间进行格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
            <!-- <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template> -->
          </el-table-column>
          <el-table-column prop="enableState" label="状态" sortable>
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            :total="page.total"
            :page-size="page.size"
            :current-page.sync="page.page"
            layout="total, prev, pager, next"
            @current-change="getEmployeeList"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符 是 子组件 去改变父组件的数据的一个语法糖 -->
    <!-- 这里为什么可以用sync 因为后面的变量是来源于data -->
    <!-- 子组件 this.$emit("update:showDialog", false) -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 放置分配弹层的组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    <!-- 放置一个二维码弹层 -->
    <el-dialog title="图片二维码" :visible.sync="showCodeDialog">
      <!-- 放置canvas -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      showDialog: false, // 默认弹层是关闭的
      showCodeDialog: false, // 显示二维码的弹层
      showRoleDialog: false, // 分配角色弹层
      userId: null, // 记录当前点击的id
      loading: false, // 页面开始加载会有一些卡顿，这时会显示遮罩层
      page: { // 分页的一些参数数据
        total: 0, // 总数
        page: 1,
        size: 10
      },
      list: [] // 接收数组
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true // loading可以在请求之前打开
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false // loading可以在请求之后再关闭
    },
    // 格式化聘用形式的属性方法
    formatEmployment(row, column, cellValue, index) {
      console.log(row)
      // 要去找 cellValue 1 所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
      // cellValue是当前单元格的值
      // row 是当前行的数据的对象
    },
    delEmployee(id) {
      this.$confirm('确定删除该用户？').then(() => {
        return delEmployee(id)
      }).then(() => {
        this.$message.success('删除用户成功')
        this.getEmployeeList()
      })
    },
    // async delEmployee(id) {
    //   try {
    //     await this.$confirm('确定删除该用户？')
    //     // 点击了确定
    //     await delEmployee(id)
    //     this.$message.success('删除用户成功')
    //     this.getEmployeeList() // 重新拉取数据
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // 导出数据
    exportData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        // excel是引入文件的导出对象,其中header从哪里来 data从哪里来
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: '人力资源表',
          header: Object.keys(headers),
          data: this.formatJSON(headers, rows) // 返回的data就是 要导出的结构
        })
      })
    },
    // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
    // 数据的顺序是按照headers中key的顺序来的
    // 格式化json数据，将表头数据和数据进行对应
    formatJSON(headers, rows) {
      // rows 是一行一行的  =>  [{},{}] => [[],[]]
      return rows.map(item => {
        // item {username: '张三', mobile: 123}  现在是对象 => []
        // ["姓名","手机号"] => [ '张三', '123']
        return Object.keys(headers).map(key => {
          // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 如果是日期的话 就需要格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 要把聘用形式转化成文本
            const obj = EmployeeEnum.hireType.find(o => o.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    // 复杂表头
    exportMutiData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: '人力资源表',
          header: Object.keys(headers),
          // mutiHeader中表头的长度必须和header的表头长度是对应的 否则报错
          multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 复杂表头的导出 数组中的一个数组 就是一行表头
          data: this.formatJSON(headers, rows),
          merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 合并列  不用区分顺序 只写合并的单元格的顺序号
        })
      })
    },
    // 显示二维码方法
    showQrCode(url) {
      if (url && url.trim()) {
        this.showCodeDialog = true // 打开二维码弹层
        // 页面的渲染是异步的  状态变了 页面会立刻变化吗  页面立刻能得到dom？  ！！！ no
        // nextTick总是会等到当前的数据更新完毕 并且渲染完毕之后 执行

        // setTimeout(,0) 异步函数总是等到同步代码执行完毕
        // this.$nextTick 和 Vue.nextTick()
        this.$nextTick(() => {
          // 此时该函数执行时 一定是上一次的更新执行完毕了
          // 此时一定能保证拿到canvas
          QrCode.toCanvas(this.$refs.myCanvas, url) // 转化二维码
        })
      } else {
        this.$message.warning('当前用户没有头像')
      }
    },
    async  assignRole(id) {
      this.userId = id // 记住当前点击的user-id  props传值是异步的 props异步渲染传值
      // 同步和异步相遇  会先执行同步
      // 立刻调用获取数据的方法
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
    // newPage是最新的页码
    // changePage(newPage) {
    //   this.page.page = newPage // 赋值最新的页码
    //   this.getEmployeeList() // 重新拉取数据
    // }
  }
}
</script>

<style>

</style>
