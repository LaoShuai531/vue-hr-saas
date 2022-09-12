<template>
  <!-- 上传组件 -->
  <div>
    <!-- :class="{ class名称：布尔值 }" -->
    <!-- el-upload之所以能够显示图片 是因为 fileList中有值 -->
    <!-- 给action一个#号 就不会报错了 -->
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      action="#"
      :class="{disabled: fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />

    <!-- 预览图片 -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKID0mqfEWqlUzIbeSkGRL6c7ML6c0B93To9', // 身份识别 ID
  SecretKey: 'JFwNZdeRF2iOp03FFsGNDm44vWFitmNF' // 身份密钥
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showPercent: false, // 控制进度条的显示和隐藏
      percent: 0, // 当前的进度上的值，默认是0
      showDialog: false, // 默认隐藏
      imgUrl: '', // 存储点击的图片地址
      fileList: []
    }
  },
  computed: {
    // 只要该计算属性为true 就表示 我们需要隐藏上传按钮
    fileComputed() {
      return this.fileList.length === this.limit
    }
  },
  methods: {
    // 点击预览事件触发preview
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file就是要删除的file
    // fileList是删除过的文件
    handleRemove(file) {
      // 根据file中uid将当前的fileList中的数据进行移除
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // filter方法会得到一个新的数组
    },
    // 不能够一味的进行push 因为该函数会被多次调用 fileList其实就是当前最新的文件列表
    changeFile(file, fileList) {
      // file是当前的文件  fileList是当前的最新数组
      // this.fileList = [...fileList]
      this.fileList = fileList.map(item => item)
      // 这里为何暂时不成功呢？ 因为现在还没有上传 所有第二次进来的数据 一定是空的
      // 如果完成上传动作了 第一次进入 和 第二次进入的fileList的长度应该一样的，是1 应该都有数据
      // 上传成功 => 数据才能进来 => 腾讯云cos
    },
    // 上传之前检查
    beforeUpload(file) {
      // console.log(file)
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 25 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片最大的大小为5M')
        return false
      }
      // 此时已经确定当前上传的就是当前的这个file了
      // console.log(file);
      return true // 要返回true
    },
    // 上传到腾讯云
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      // params中的file就是要上传的图片文件
      // console.log(params.file)
      if (params.file) {
        this.showPercent = true // 显示进度条
        // 上传对象到腾讯云 => 哪个存储桶 哪个地域的存储桶 文件 格式 名称 回调
        cos.putObject({
          Bucket: 'shuiruohanyu-1302806742', /* 每个人的存储桶名称 必须*/
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: params.file.name, /* 文件名称 */
          StorageClass: 'STANDARD', // 固定值
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            // console.log(progressData.percent * 100)
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err)
          if (data.statusCode === 200 && data.Location) {
            // 认为此时上传成功
            // 需要知道当前的这个地址是谁的url地址
            // params.file.uid  => 当前上传文件的标识  如果找到了一一样的uid 就表示他们是一张图片
            console.log(this.fileList)
            // 这样相当于将原来的旧本地地址换成了新地址
            this.fileList = this.fileList.map(item => {
              // 将本地的地址替换成线上已经放在腾讯云之后的地址
              if (item.uid === params.file.uid) {
                // upload 为true的意思是 表示这张图片 已经上传过了 已经不是本地图片了
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存 => 图片有大有小 => 上传速度有快有慢 => 要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            this.showPercent = false // 关闭进度条
            this.percent = 0 // 将进度归0
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
    display: none
}

</style>
