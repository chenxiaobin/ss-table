<template>
  <textarea v-model="textValue"
            v-tooltip="{
              content: limitTips,
              trigger: 'manual',
              show: limitOpen,
              classes: ['tb-edit-limit-tip']
            }"
            autofocus="autofocus"
            class="tb-edit-textarea"
            :class="limitTips ? 'tb-edit-limit-border' : ''"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @keydown="handleKeydown"></textarea>
</template>
<script>
export default {
  data () {
    return {
      textValue: this.value,
      limitTips: '',
      limitOpen: false
    }
  },
  props: {
    data: Object,
    rowindex: Number,
    // 输入框的值
    value: {},
    // 用于限制输入
    limit: Function,
    // 是否多行文本
    isMulti: Boolean
  },
  mounted () {
    this.$el.focus()
  },
  methods: {
    handleKeydown (e) {
      if (e.keyCode === 13 && !this.isMulti) {
        e.target.value = this.value
        this.$emit('enter')
      }
    },
    handleInput (e) {
      let oldValue = this.value
      let newValue = e.target.value
      let limitData = {}
      if (this.limit) {
        limitData = this.limit(newValue, oldValue, this.rowindex + 1, this.data)
        this.limitTips = limitData.limitTips
        this.limitOpen = !!this.limitTips
      }
    },
    handleFocus () {
      this.limitOpen = false
    },
    handleBlur (e) {
      let oldValue = this.value
      let newValue = e.target.value

      if (typeof oldValue === 'number') {
        newValue = +newValue || null
      }

      let limitData = {
        status: true,
        limitTips: ''
      }
      if (this.limit) {
        limitData = this.limit(newValue, oldValue, this.rowindex + 1, this.data)
        this.limitTips = limitData.limitTips
        this.limitOpen = !!this.limitTips
      }

      if (oldValue !== newValue && limitData.status) {
        this.$emit('change', newValue, oldValue)
      }
    }
  }
}
</script>
<style>
.tb-edit-textarea{
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% - 17px);
  height: calc(100% - 2px);
  padding: 0 8px 1px;
  border-radius: 0;
  -webkit-box-shadow: 1px 1px 20px rgba(0,0,0,.15);
  box-shadow: 1px 1px 20px rgba(0,0,0,.15);
  line-height: 36px;
  resize: none;
  font-family: '黑体';
  border-color: #dedede;
  text-align: inherit;
  box-sizing: initial;
}
.tb-edit-limit-border{
  border-color: #f56c6c;
}
.tb-edit-limit-tip.tooltip{
  font-size: 12px;
}
.tb-edit-limit-tip.tooltip .tooltip-inner {
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 5px;
  padding: 4px 10px 5px;
  border: 1px solid #fde2e2;
}

.tb-edit-limit-tip.tooltip .tooltip-arrow{
  border-color: #fef0f0;
}
</style>
