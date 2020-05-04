<template>
  <li class="le-dropdown-item"
      :class="{
        'is-disabled': disabled,
        'is-selected': selected
      }"
      @click="handleClick">
    <slot>
      <slot>{{ showLabel }}</slot>
    </slot>
  </li>
</template>
<script>
export default {
  name: 'leOption',
  data () {
    return {
      hover: false
    }
  },
  props: {
    value: {
      required: true
    },
    label: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showLabel () {
      return (this.label) ? this.label : this.value
    }
  },
  methods: {
    handleClick () {
      if (this.disabled) return false
      this.$emit('selected', {
        value: this.value,
        label: this.showLabel
      })
    }
  }
}
</script>
<style>
.le-dropdown-item{
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;

  list-style: none;
  margin: 0;
}
.le-dropdown-item:hover {
  background-color: #f5f7fa;
}
.le-dropdown-item.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}
.le-dropdown-item.is-selected {
    color: #409eff;
    font-weight: 700;
}
</style>
