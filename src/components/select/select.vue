<template>
  <div class="le-select" ref="RefSelect">
    <v-popover class="le-select-popover" popover-class="le-select-tooltip" offset="5" :disabled="!isEnabled">
      <le-input :value="optionValue"
                :readonly="readonly"
                :placeholder="placeholder">
        <div slot="suffix">
          <i class="iconfont ss-icon-xia"></i>
        </div>
      </le-input>
      <template slot="popover">
        <div v-if="!isGroupOptions(options)" class="le-select-options" :style="{width: `${width}px`}">
          <a v-close-popover v-for="item in options" :key="item.value">
            <le-option
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              :selected="item.label === optionValue"
              @selected="handleSelected">
            </le-option>
          </a>
        </div>
        <div v-else class="le-select-options" :style="{width: `${width}px`}">
          <le-option-group v-for="item in options" :key="item.value"
                           :label="item.label">
            <a v-close-popover v-for="child in item.options" :key="`child-${child.value}`">
              <le-option
                :label="child.label"
                :value="child.value"
                :disabled="child.disabled"
                :selected="child.label === optionValue"
                @selected="handleSelected">
              </le-option>
            </a>
          </le-option-group>
        </div>
      </template>
    </v-popover>
  </div>
</template>
<script>
import Vue from 'vue'
import LeInput from '../input'
import LeOption from './option'
import LeOptionGroup from './option-group'
import { VPopover, VClosePopover } from 'v-tooltip'
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover)

export default {
  name: 'leSelect',
  data () {
    return {
      width: 0,
      isEnabled: true,
      optionValue: this.value
    }
  },
  components: {
    LeInput, LeOption, LeOptionGroup
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value () {
      this.optionValue = this.value
    },
    optionValue () {
      this.$emit('update:value', this.optionValue)
    }
  },
  mounted () {
    this.width = (this.$refs.RefSelect && this.$refs.RefSelect.offsetWidth) - 2
  },
  methods: {
    handleSelected (data) {
      this.optionValue = data.label
      this.$emit('change', data)
    },
    isGroupOptions (data) {
      let isGroup = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].options && data[i].disabled !== false) {
          isGroup = true
        }
      }
      return isGroup
    }
  }
}
</script>
<style lang="scss">
.le-select{
  width: 100%;
}
.le-select-popover,
.le-select-popover>div{
  width: 100%;
}
.le-select-tooltip.tooltip.popover .popover-inner{
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  margin: 5px 0;

  max-height: 260px;
  overflow-y: auto;
}
.le-select-tooltip .popover-arrow {
  border-color: #e4e7ed;
  border-width: 0 5px 5px 5px;
  border-left-color: transparent!important;
  border-right-color: transparent!important;
  border-top-color: transparent!important;
  top: -5px;
  left: 15px !important;
  margin-top: 0;
  margin-bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}
.le-select-options{
  padding: 6px 0;
}
</style>
