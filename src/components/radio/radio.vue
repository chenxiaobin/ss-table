<template>
  <div class="le-radio" @click="handleClick" :class="{
    'le-radio-disabled': option.disabled
  }">
    <span class="iconfont"
          :class="{
            'le-radio-active' : checked,
            'ss-icon-radio-checked': checked && checkedStyle === 'default',
            'ss-icon-radio-checked2': checked && checkedStyle === 'gou',
            'ss-icon-radio': !checked
          }"></span>
    <span class="label">{{option.label}}</span>
  </div>
</template>
<script>
export default {
  name: 'leRadio',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    option: {
      type: [String, Object],
      required: true
    },
    checked: Boolean,
    checkedStyle: String
  },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      let { value, disabled } = this.option
      if (value && !disabled) {
        this.$emit('change', this.option)
      }
    }
  }
}
</script>
<style lang="scss">
.le-radio{
  display: inline-block;
  cursor: pointer;
  margin: 5px 8px 5px 0;
}
.le-radio span {
  display: inline-block;
  margin-right: 5px;
}
.le-radio span:first-child{
  font-size: 16px;
}
.le-radio-active {
  color: #409eff;
}
.le-radio-disabled{
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
