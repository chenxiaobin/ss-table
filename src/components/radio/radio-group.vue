<template>
  <div class="le-radio-group">
    <le-radio v-for="(option, index) in options" :key="index"
              :option="option"
              :checked="radioValue === option.value"
              :checked-style="checkedStyle"
              @change="handleChange">
    </le-radio>
  </div>
</template>
<script>
import leRadio from './radio'
export default {
  name: 'leRadioGroup',
  model: {
    prop: 'value',
    event: 'radio-change'
  },
  props: {
    value: [String, Number],
    options: {
      type: Array,
      default () {
        return []
      }
    },
    checkedStyle: {
      type: String,
      default: 'default' // gou
    }
  },
  data () {
    return {
      radioValue: this.value
    }
  },
  components: {
    leRadio
  },
  methods: {
    handleChange (item) {
      this.radioValue = item.value
      this.$emit('radio-change', this.radioValue)
      this.$emit('change', item)
    }
  }
}
</script>
<style>

</style>
