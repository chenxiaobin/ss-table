<template>
  <div class="le-form">
    <le-form-item v-for="(item, key) in datas" v-model="vModel[item.field]"
                  :key="`form-${key}`"
                  :datas="item"
                  @change="handleChange"></le-form-item>
    <div class="le-form-btn">
      <slot name="form-pre-btn"></slot>
      <le-button type="primary" @click="handleClick">确定</le-button>
      <slot name="form-suf-btn"></slot>
    </div>
  </div>
</template>
<script>
import leFormItem from './form-item'
import leButton from '../button'
export default {
  props: {
    config: {
      type: Object
    }
  },
  components: {
    leFormItem, leButton
  },
  computed: {
    model () {
      return this.config.model || {}
    },
    datas () {
      return this.config.datas
    }
  },
  data () {
    return {
      vModel: {},
      vModelAll: {}
    }
  },
  mounted () {
    this.fnValidate()
    this.fnSetVModel()
  },
  methods: {
    fnValidate () {
      for (let i = 0; i < this.datas.length; i++) {
        let idata = this.datas[i]
        if (!idata.field) {
          window.console.error(`【form】label:${idata.label}, 对象缺少field属性!`)
        }
      }
    },
    fnSetVModel () {
      this.datas.map((v) => {
        this.$set(this.vModel, v.field, this.model[v.field])
      })
    },
    handleChange (item, value) {
      this.vModelAll[item.field] = value
    },
    handleClick () {
      let { vModel, vModelAll } = this
      this.$emit('form-data', { vModel, vModelAll })
    }
  }
}
</script>
<style>
.le-form {
  width: 100%;
  height: 100%;
}
.le-form-btn{
  text-align: center;
}
</style>
