<template>
  <div class="le-checkbox" @click="handleClick" :class="{
    'le-checkbox-disabled': option.disabled
  }">
    <span class="iconfont"
          :class="{
            'is-checkbox-checked' : checked,
            'ss-icon-checkbox-checked': checked,
            'ss-icon-checkbox': !indeterminate && !checked,
            'is-checkbox-indeterminate': indeterminate,
            'ss-icon-checkbox-all': indeterminate
          }"></span>
    <span class="label">{{option.label}}</span>
  </div>
</template>
<script>
export default {
  name: 'leCheckbox',
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
    indeterminate: Boolean
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
.le-checkbox{
  display: inline-block;
  cursor: pointer;
  margin: 5px 8px 5px 0;
}
.le-checkbox span {
  display: inline-block;
  margin-right: 5px;
}
.le-checkbox span:first-child{
  font-size: 16px;
}
.is-checkbox-checked,
.is-checkbox-indeterminate {
  color: #409eff;
}
.le-checkbox-disabled{
  color: #c0c4cc;
  cursor: not-allowed;
}
.le-checkbox-disabled .is-checkbox-checked {
  color: #c0c4cc;
}
</style>
