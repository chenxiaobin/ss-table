<template>
  <div class="le-input">
    <template v-if="type != 'textarea'">
      <div class="le-input-prepend" v-if="prepend" v-show="slotReady"><slot name="prepend"></slot></div>
      <div class="le-input-main" :class="[{
        'le-input--prepend-append': prepend || append
      }]">
        <input :class="inputClasses"
          ref="RefInput"
          v-model="currentValue"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :readonly="readonly"
          @change="handleChange"
          @blur="handleChange" />
        <!-- 前置内容 -->
        <span class="le-input-icon le-input-prefix" v-if="$slots.prefix || prefixIcon">
          <slot name="prefix"></slot>
          <i v-if="prefixIcon"
            :class="prefixIcon">
          </i>
        </span>

        <!-- 后置内容 -->
        <span class="le-input-icon le-input-suffix" v-if="$slots.suffix || suffixIcon">
          <slot name="suffix"></slot>
          <i v-if="suffixIcon"
            :class="suffixIcon">
          </i>
        </span>
      </div>
      <div class="le-input-append" v-if="append" v-show="slotReady"><slot name="append"></slot></div>
    </template>
    <template v-else>

    </template>
  </div>
</template>
<script>
import { isExistValue } from '../../utils/utils'
export default {
  name: 'leInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    type: {
      validator (value) {
        return isExistValue(value, ['text', 'textarea', 'password', 'url', 'email', 'date', 'number', 'tel'])
      },
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    suffixIcon: String,
    prefixIcon: String
  },
  data () {
    return {
      currentValue: this.value,
      prepend: false,
      append: false
    }
  },
  computed: {
    inputClasses () {
      let preClass = 'le-input-inner'
      return [
        preClass,
        {
          [`${preClass}-prepend`]: this.prepend,
          [`${preClass}-append`]: this.append
        }
      ]
    }
  },
  watch: {
    value (val) {
      this.setCurrentValue(val)
    },
    currentValue () {
      this.$emit('update:value', this.currentValue)
    }
  },
  mounted () {
    if (this.type !== 'textarea') {
      this.prepend = this.$slots.prepend !== undefined
      this.append = this.$slots.append !== undefined
    } else {
      this.prepend = false
      this.append = false
    }
    this.slotReady = true
  },
  methods: {
    setCurrentValue (value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
    handleChange () {
      this.$emit('change', this.currentValue)
    }
  }
}
</script>
<style>
.le-input{
  width: 100%;
  cursor: pointer;
  font-size: 14px;
}
.le-input-inner{
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 12px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
  cursor: pointer;
}
.le-input-inner:focus{
  outline: none;
  border-color: #409eff;
}
.le-input-append,
.le-input-prepend {
  width: 1px;
  white-space: nowrap;
  vertical-align: middle;
  padding: 4px 7px;
  font-size: inherit;
  font-weight: 400;
  line-height: 1;
  color: #657180;
  text-align: center;
  background-color: #eee;
  border: 1px solid #d7dde4;
  border-radius: 6px;
}
.le-input-main{
  position: relative;
  width: 100%;
  display: inline-block;
}
.le-input-append,
.le-input-prepend,
.le-input-main.le-input--prepend-append {
    display: table-cell;
}
.le-input-prepend,
.le-input-inner-append{
  border-bottom-right-radius: 0!important;
  border-top-right-radius: 0!important;
}
.le-input-append,
.le-input-inner-prepend{
  border-bottom-left-radius: 0!important;
  border-top-left-radius: 0!important;
}
.le-input-prepend{
  border-right: 0;
}
.le-input-append{
  border-left: 0;
}
.le-input-icon{
  position: absolute;
  height: 100%;
  top: 0;
  text-align: center;
  color: #c0c4cc;
  transition: all .3s;
  pointer-events: none;
  width: 25px;
  line-height: 40px;
}
.le-input-prefix{
  left: 10px;
}
.le-input-suffix{
  right: 10px;
}
.le-input--prefix .le-input-inner {
  padding-left: 30px;
}
.le-input--suffix .le-input-inner {
  padding-right: 30px;
}
</style>
