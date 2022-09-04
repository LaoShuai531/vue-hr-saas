<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 弹层内容 -->
    <!-- 表单组件 el-form  label-width设置label的宽度 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择负责人" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
          <!-- 其中key是标识，label是显示，value是存储 -->
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" type="textarea" :rows="5" style="width:80%" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <!-- 放置居中的按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <!--放置列 -->
      <el-col :span="8">
        <el-button @click="btnCancel">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="btnOK">{{ $t('table.confirm') }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    // 控制弹层的显示和隐藏
    showDialog: {
      type: Boolean,
      default: false // 弹层默认隐藏，为false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 校验逻辑 同级部门不能出现重复的名称
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 有id的话就是编辑
        // 找到自己当前部门的所有的同级部门 同级部门下 我的名字不能和其他的同级部门的名字进行重复
        // isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 没有id的话就是新增场景
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // depts是所有的数据
      // 市场部所有的子部门的 pid 等于市场部的id  市场部的数据的treeNode.id
        // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经有${value}这个部门了`)) : callback()
    }
    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式下
        // 要求是 不能有一样的code 所以首先把自己排除出去，再跟其他的比较
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value)
      } else {
        // 新增模式下
        isRepeat = depts.some(item => item.code === value) // 只要发现编码重复 就不行
      }
      // 要求编码 和所有部门编码不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是 value值不为空
      isRepeat ? callback(new Error(`组织架构下已经有${value}这个编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        // 校验规则 {key: 数组}
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1, max: 50, message: '部门名称为1-50个字符', trigger: 'blur'
          }, {
            // 同级部门不能出现重复的部门名称
            trigger: 'blur',
            validator: checkNameRepeat
          }], // 部门名称
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, {
          min: 1, max: 50, message: '部门编码为1-50个字符', trigger: 'blur'
        }, {
          trigger: 'blur',
          validator: checkCodeRepeat
        }], // 部门编码
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门管理者
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
          min: 1, max: 300, message: '部门介绍为1-300个字符', trigger: 'blur'
        }] // 部门介绍
      },
      peoples: [] // 设置一个空数组来存放员工的简单列表数据（只需要从中提取出来员工名字即可）
    }
  },
  // 计算属性
  computed: {
    // 此处用来动态的显示弹层上的标题，有id的为编辑部门，无id的为新增部门
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      // 调用我们引入的接口
      this.peoples = await getEmployeeSimple()
    },
    btnOK() {
      this.$refs.deptForm.validate().then(() => {
        // 如果进入then表示校验成功
        // 子部门的pid 等于父部门的id
        return this.formData.id ? updateDepartments(this.formData) : addDepartments({ ...this.formData, pid: this.treeNode.id })
      }).then(() => {
        // 已经新增成功，告诉父组件
        this.$emit('addDepts') // 触发自定义事件
        // update:props名称
        this.$emit('update:showDialog', false) // 触发事件,成功添加子部门后弹层隐藏，传一个false过去
        // 关闭dialog的时候 会触发<el-dialog></el-dialog>的close事件，close事件会去触发resetFields() 所以不用再单独的重置数据
      })
    },
    btnCancel() {
      // 关闭弹层之前 应该 重置校验 并且还原数据 
      // el-form中的resetFields()只能重置 表单上的数据 非表单上的 比如编辑中的id不能重置
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields() // 重置方法（element-ui对于表单方法有这个属性：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果）
      this.$emit('update:showDialog', false) // 同样的关闭弹层，将弹层隐藏
    },
    // 获取详情的方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 上一行的代码中，此时参数中的id不能是this.treeNode.id，因为我们是父组件调用子组件的方法，是先设置了node数据 然后直接调用方法
      // props传值是异步的。我可以通过getDepartDetail()方法接收参数传id进来
    }
  }
}
</script>

<style>

</style>
