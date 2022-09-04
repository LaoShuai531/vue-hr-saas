<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 放置组织架构内容 -->
      <el-card class="tree-card">
        <!-- 主要内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个树形 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- default-expand-all默认展开 -->
          <!-- 写一个显示的结构 插槽 作用域插槽 slot-scope-->
          <!-- 插槽  slot="a" 具名插槽-->
          <!-- 插槽   匿名插槽-->
          <!--  v-slot  先执行作用域插槽的取值 再传给tree-node-->
          <template v-slot="{ data }">
            <tree-tools :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- （利用sync修饰符关闭新增弹层，是一种简写的方式：可以省略父组件的监听和方法，直接将值赋值给show-dialog）
          放置一个新增弹层组件 sync修饰符 必须写 -->
    <!-- :show-dialog显示弹层与否 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      loading: false,
      showDialog: false, // 控制弹层变量，默认不显示弹层
      company: { }, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name'
      },
      node: null // 专门来存储当前操作的node节点
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      this.loading = true
      // const result = await getDepartments()
      // console.log(result);
      const { depts, companyName } = await getDepartments()
      this.company = { manager: '负责人', name: companyName, id: '' } 
      // 此处的id: ''是因为处理组织架构首部的时候，里面子部门属性的pid为空，但是treeNode属性里面的id为undefined，所以我们要将id同样设置为空
      this.departs = transListToTreeData(depts, '')
      setTimeout(() => (this.loading = false)
        , 500)
    },
    // 自定义事件的接收方法 node就是操作的节点（当前点击的部门）
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true // 将弹层显示
      this.node = node // 记录node是为了记住往哪个部门下 添加子部门
    },
    async editDepts(node) {
      await this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
      this.showDialog = true // 显示组件弹层
      this.node = node // 记录当前点击的编辑节点
      // 调用子组件方法？父组件 => 子组件方法
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
