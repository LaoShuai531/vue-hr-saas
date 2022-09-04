<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 40px">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 下拉菜单内容 -->
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: { props属性: { 配置选项 }}
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求该属性必填 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    // 是不是根节点 如果是根节点的话  隐藏 删除和编辑
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 编辑 删除 新增时触发
    operateDepts(type) {
      if (type === 'add') {
        // 新增操作
        // 告诉父组件 显示弹层
        // console.log(this.treeNode)
        this.$emit('addDepts', this.treeNode) // 传出要添加子部门的节点 为何传出treeNode 因为添加子部门 需要当前部门的数据，this.treeNode => 当前点击的部门
      } else if (type === 'edit') {
        // 编辑
        this.$emit('editDepts', this.treeNode) // 调用父组件的方法 点击编辑 传出要编辑的节点
      } else {
        // 删除
        this.$confirm('您是否确定要删除该部门吗').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 此时已经确定删除部门了
          // 应该告诉父组件 更新数据（此时我们可以子组件向父组件传递一个方法 自定义一个事件）
          this.$emit('delDepts') // 触发一个自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
