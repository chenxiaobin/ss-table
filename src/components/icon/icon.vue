<template>
  <i :class="classes" @click="handleClick" :style="styles"></i>
</template>
<script>
const basicStyle = 'iconfont'
export default {
  name: 'leIcon',
  props: {
    type: {
      type: String
    },
    size: [Number],
    color: String,
    url: String,
    urlSize: {
      type: String,
      default: '20px'
    }
  },
  data () {
    return {}
  },
  computed: {
    classes () {
      if (this.url && this.url !== undefined) return 'le-icon-url'
      return `${basicStyle} ${this.type}`
    },
    styles () {
      if (this.url && this.url !== undefined) {
        return {
          height: '100%',
          display: 'block',
          width: this.urlSize,
          background: 'url(' + this.url + ')'
        }
      }
      return {
        color: this.color,
        fontSize: this.size + 'px'
      }
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
<style>
.le-icon-url {
  margin: auto;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  overflow: hidden !important;
}
</style>
