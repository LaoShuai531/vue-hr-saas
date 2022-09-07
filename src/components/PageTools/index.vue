<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 前插槽 -->
        <div v-if="showBefore" class="before">
          <!-- 提示图标 图标随着 showBefore的显示而显示-->
          <i class="el-icon-info" />
          <!-- 有名的叫具名插槽，没名的叫匿名插槽 -->
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <!-- 后插槽 -->
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// 组件可以显示左侧内容，也可以显示右侧内容 如果左侧内容不传，图标内容应该不显示
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false // 默认不显示
    }
  }
}
</script>

<style lang="scss">
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
