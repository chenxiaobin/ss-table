<template>
  <div class="le-checkbox-group">
    <template v-if="indeterminate">
      <le-checkbox :checked="isCheckedAll"
                  :option="allOption"
                  :indeterminate="isIndeterminate"
                  @change="handleChangeAll">
      </le-checkbox>
    </template>
    <le-checkbox v-for="(option, index) in options" :key="index"
                :option="option"
                :checked="option.value && checkboxValue.indexOf(option.value) > -1"
                @change="handleChange">
    </le-checkbox>
  </div>
</template>
<script>
import leCheckbox from './checkbox'
export default {
  name: 'leCheckboxGroup',
  model: {
    prop: 'value',
    event: 'checkbox-change'
  },
  props: {
    value: Array,
    options: {
      type: Array,
      default () {
        return []
      }
    },
    indeterminate: Boolean
  },
  data () {
    return {
      checkboxValue: this.value || [],
      allOption: {
        label: '全选',
        value: 'all'
      }
    }
  },
  components: {
    leCheckbox
  },
  computed: {
    isCheckedAll () {
      return this.checkboxValue.length === this.options.length
    },
    isIndeterminate () {
      let checkedCount = this.checkboxValue.length
      return this.indeterminate && (checkedCount > 0 && checkedCount < this.options.length)
    }
  },
  methods: {
    handleChange (item) {
      let isExist = this.checkboxValue.find((v) => {
        return v === item.value
      })
      if (isExist) {
        for (let i = this.checkboxValue.length - 1; i >= 0; i--) {
          if (this.checkboxValue[i] === item.value) {
            this.checkboxValue.splice(i, 1)
          }
        }
      } else {
        this.checkboxValue.push(item.value)
      }
      this.$emit('checkbox-change', this.checkboxValue)
      this.$emit('change', this.options.filter((v) => {
        return this.checkboxValue.indexOf(v.value)
      }))
    },
    handleChangeAll () {

    }
  }
}
</script>
<style>

</style>
