<template>
  <div class="le-formitem">
    <div :style="{ height: this.height }">
      <div class="le-formitem-label" :style="{ width: this.labelWidth }">{{datas.label}}</div>
      <div class="le-formitem-required">
        <i class="iconfont ss-icon-bitian" v-if="datas.required"></i>
      </div>
      <div class="le-formitem-box" :style="boxStyle">
        <!-- 输入框 -->
        <template v-if="type === 'input'">
          <le-input v-model="modelValue" @change="handleChange"></le-input>
        </template>
        <!-- 下拉框 -->
        <template v-else-if="type === 'select'">
          <le-select v-model="modelValue" :options="datas.items" @change="handleChange"></le-select>
        </template>
        <!-- 单选框 -->
        <template v-else-if="type === 'radio'">
          <le-radio-group v-model="modelValue" :options="datas.items" @change="handleChange"></le-radio-group>
        </template>
        <!-- 复选框 -->
        <template v-else-if="type === 'checkbox'">
          <le-checkbox-group v-model="modelValue" :options="datas.items" @change="handleChange"></le-checkbox-group>
        </template>
      </div>

      <!-- 单位内容 -->
      <div class="le-formitem-unit" ref="RefUnit">{{datas.unit}}</div>
    </div>
    <!-- 验证提示内容 -->
    <template v-if="validatorTips">
      <div class="le-formitem-tips">
        <i class="iconfont ss-icon-gantanhao1" :style="tipsStyle"></i>
        <span>{{validatorTips}}</span>
      </div>
    </template>
  </div>
</template>
<script>
import leInput from '../input'
import leSelect from '../select'
import leRadioGroup from '../radio'
import leCheckboxGroup from '../checkbox'
export default {
  name: 'le-form-item',
  /**
   * {
   *    label: 名称
   *    type: 类型
   *    width: 宽度
   *    unit: 单位
   *    required: 是否必填
   *    validator: (value) => {
   *      return '提示信息'
   *    }
   * }
   */
  model: {
    prop: 'value',
    event: 'form-change'
  },
  props: {
    datas: Object,
    value: [String, Array, Number, Object]
  },
  data () {
    return {
      modelValue: this.value,
      height: this.datas.height || '40px',
      labelWidth: this.datas.width || '80px',
      validatorTips: null,
      boxStyle: null
    }
  },
  components: {
    leInput, leSelect, leRadioGroup, leCheckboxGroup
  },
  computed: {
    type () {
      return this.datas.type || 'input'
    },
    validator () {
      return this.datas.validator || (() => { return null })
    },
    tipsStyle () {
      return {
        'text-indent': `calc(${this.labelWidth} + 20px)`
      }
    }
  },
  watch: {
    value () {
      this.modelValue = this.value
    }
  },
  mounted () {
    this.fnBoxStyles()
  },
  methods: {
    fnBoxStyles () {
      this.$nextTick(() => {
        let _lw = this.labelWidth
        let _uw = (this.$refs.RefUnit && this.$refs.RefUnit.offsetWidth) || '0px'
        let _dw = '40px'

        this.boxStyle = {
          width: `calc(100% - ${_lw} - ${_uw} - ${_dw})`
        }
      })
    },
    handleChange (value) {
      // 必填提示
      if (this.datas.required) {
        let express = '必填项，请填写内容'
        if (typeof value === 'string') {
          this.validatorTips = value ? null : express
        } else if (typeof value === 'object' && Array.isArray(value)) {
          this.validatorTips = value.length ? null : express
        }
      }
      let rValidator = this.validator(value)
      this.validatorTips = rValidator || this.validatorTips
      if (this.validatorTips) {
        return
      }
      this.$emit('change', this.datas, value)

      switch (this.type) {
        case 'checkbox':
          let keys = []
          value.map((v) => {
            keys.push(v.value)
          })
          this.$emit('form-change', keys)
          break
        case 'radio':
          this.$emit('form-change', value.value)
          break
        case 'select':
          this.$emit('form-change', value.value)
          break
        default:
          this.$emit('form-change', value)
          break
      }
    }
  }
}
</script>
<style>
.le-formitem{
  width: 100%;
  margin: 5px 0;
  min-height: 40px;
}

.le-formitem-label{
  display: inline-block;
  text-align: right;
  vertical-align:middle;
}
.le-formitem-box{
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: middle;
  position: relative;
}
.le-formitem-required{
  display: inline-block;
  width: 16px;
  color: #ff0000;
  height: 100%;
  line-height: 40px;
  vertical-align: middle;
}
.le-formitem-tips{
  color: #ff0000;
  font-size: 12px;
}
.le-formitem-tips i,
.le-formitem-tips span{
  display: inline-block;
  vertical-align: top;
}
.le-formitem-unit{
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px;
  font-size: 12px;
}
</style>
