<template>
  <ul class="le-select-group-wrap">
    <li class="le-select-group-title">{{ label }}</li>
    <li>
      <ul class="le-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'leOptionGroup',
  props: {
    label: String
  },
  data () {
    return {
    }
  }
}
</script>
<style>
.le-select-group-wrap{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.le-select-group-title{
  padding-left: 20px;
  font-size: 12px;
  color: #909399;
  line-height: 30px;
}
.le-select-group {
  margin: 0;
  padding: 0;
}
.le-select-group-wrap:not(:last-of-type) {
    padding-bottom: 24px;
}
.le-select-group-wrap:not(:last-of-type):after {
    content: "";
    position: absolute;
    display: block;
    left: 20px;
    right: 20px;
    bottom: 12px;
    height: 1px;
    background: #e4e7ed;
}
</style>
