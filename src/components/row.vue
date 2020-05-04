<template>
  <tr :class="getTableRowClass(trItem, trKey)"
      @mouseenter="handleTrMouseenter($event, true, trItem)"
      @mouseleave="handleTrMouseleave($event, true, trItem)">
    <!-- $attrs/$listeners 作为孙子组件和爷爷组件事件传递@update-row、@edit-row-complete、@edit-row-cancel -->
    <template v-if="dataType === 'flat'">
      <table-cell v-for="(colitem, col) in (frozenColModels || colModelsFlat)"
                  :key="col"
                  :row-item="trItem"
                  :row-key="trKey"
                  :cell-item="colitem"
                  :cell-key="col"
                  :is-row-edit="isRowEdit"
                  v-bind="$attrs"
                  v-on="$listeners"
                  @update-cell="handleUpdateCell"
                  @edit-row-editing="handleEditRowEditing"
                  @edit-row-complete="handleEditRowComplete"
                  @edit-row-cancel="handleEditRowCancel">
      </table-cell>
    </template>
    <template v-if="dataType === 'group'">
      <!-- 分组异步加载 子节点 && 需要异步加载 && 还没有异步加载过 -->
      <template v-if="trItem.is_leaf && group.async && !trItem.no_async">
        <td class="ss-table-tr-group" :class="true ? `ss-table-tr-group-level-${trItem.group_level}`: ''">
            <div class="tb-cell-div" @click="handleGroupAsync($event, trItem)">
              <i class="iconfont ss-icon-gengduo"></i><span class="ss-table-tr-groupname" v-html="groupNameFormat(trItem)"></span></div></td>
          <table-cell v-for="(colitem, col) in getColumns()"
                    :key="getTdKey(col)"
                    :row-item="trItem"
                    :row-key="trKey"
                    :cell-item="colitem"
                    :cell-key="col">
          </table-cell>
      </template>
      <!-- 叶子节点 -->
      <template v-else-if="trItem.is_leaf">
        <table-cell v-for="(colitem, col) in (frozenColModels || colModelsFlat)"
                  :key="getTdKey(col)"
                  :row-item="trItem"
                  :row-key="trKey"
                  :cell-item="colitem"
                  :cell-key="col"
                  :is-row-edit="isRowEdit"
                  v-bind="$attrs"
                  v-on="$listeners"
                  @update-cell="handleUpdateCell"
                  @edit-row-editing="handleEditRowEditing"
                  @edit-row-complete="handleEditRowComplete"
                  @edit-row-cancel="handleEditRowCancel">
        </table-cell>
      </template>
      <!-- 分组节点 -->
      <template v-else>
        <!-- 分组行是否要显示各列内容，还是只显示一行空白行 -->
        <template v-if="group.isShowColumns">
          <td class="ss-table-tr-group" :class="true ? `ss-table-tr-group-level-${trItem.group_level}`: ''">
            <div class="tb-cell-div">
              <i v-if="!trItem.is_expand" class="iconfont ss-icon-gengduo"></i>
              <i v-else class="iconfont ss-icon-xia"></i><span class="ss-table-tr-groupname" v-html="groupNameFormat(trItem)"></span></div></td>
          <table-cell v-for="(colitem, col) in getColumns()"
                    :key="getTdKey(col)"
                    :row-item="trItem"
                    :row-key="trKey"
                    :cell-item="colitem"
                    :cell-key="col">
          </table-cell>
        </template>
        <template v-else>
          <td :colspan="colModelsFlat.length" class="ss-table-tr-group" :class="true ? `ss-table-tr-group-level-${trItem.group_level}`: ''">
            <div class="tb-cell-div">
              <i v-if="!trItem.is_expand" class="iconfont ss-icon-gengduo"></i>
              <i v-else class="iconfont ss-icon-xia"></i><span class="ss-table-tr-groupname" v-html="groupNameFormat(trItem)"></span></div></td>
        </template>
      </template>
    </template>
  </tr>
</template>
<script>
import _ from 'lodash'
import Pinyin from '../utils/pinyin'
import { guid } from '../utils/utils'
import TableCell from '../components/cell'
export default {
  inject: ['self'],
  data () {
    return {
      id: this.self.id,
      colModelsFlat: this.self.colModelsFlat,
      dataValueAsClass: this.self.dataValueAsClass,
      isRowEdit: false, // 是否开启行编辑

      tempEditData: {} // 当前正在编辑的对象临时存储
    }
  },
  props: {
    dataType: {
      type: String,
      default: 'flat'
    },
    trKey: Number,
    trItem: Object,
    group: Object,
    frozenColModels: Array
  },
  components: {
    TableCell
  },
  methods: {
    getTdKey () {
      return guid()
    },
    getColumns () {
      return _.tail((this.frozenColModels || this.colModelsFlat))
    },
    getTableRowClass (data, index) {
      let valueArr = this.dataValueAsClass
      let classes = index % 2 ? 'ss-table-tr-odd' : 'ss-table-tr-even'
      _.each(valueArr, (v) => {
        let vpinyin = _.isString(data[v]) ? Pinyin(data[v])[0] : data[v]
        let nstr = `ss-table-tr-field-${vpinyin || ''}`
        classes += ` ${nstr}`
      })
      return classes
    },
    handleTrMouseenter (e, isLeaf, data) {
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return null
      }
      let dataIndex = e.currentTarget.getAttribute('data-index')
      let doms = document.querySelectorAll(`#${this.id} .ss-table-tbody tr[data-index="${dataIndex}"]`)
      for (let i = 0; i < doms.length; i++) {
        doms[i].classList.add('ss-table-tr-hover')
      }
      if (isLeaf) {
        this.$emit('row-mouseenter', data)
      }
    },
    handleTrMouseleave (e, isLeaf, data) {
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return
      }
      let dataIndex = e.currentTarget.getAttribute('data-index')
      let doms = document.querySelectorAll(`#${this.id} .ss-table-tbody tr[data-index="${dataIndex}"]`)
      for (let i = 0; i < doms.length; i++) {
        doms[i].classList.remove('ss-table-tr-hover')
      }
      if (isLeaf) {
        this.$emit('row-mouseleave', data)
      }
    },
    handleEditRowEditing () {
      this.isRowEdit = true
    },
    handleEditRowComplete () {
      this.isRowEdit = false
      let data = Object.assign({}, this.trItem, this.tempEditData)
      this.$emit('update-row', this.trKey, data)
    },
    handleEditRowCancel () {
      this.isRowEdit = false
    },
    handleUpdateCell (index, data) {
      this.tempEditData = Object.assign({}, this.tempEditData, data)
    },
    groupNameFormat (data) {
      let { groupCustomName } = this.group
      if (groupCustomName) {
        let str = groupCustomName.replace('{0}', data.group_name).replace('{1}', data.all_child_length)
        return str
      }
      return data.group_name
    },
    handleGroupAsync (e, data) {
      e.currentTarget.querySelector('i').setAttribute('class', 'iconfont ss-icon-jiazai')
      this.$emit('in-group-async', data)
    }
  }
}
</script>
<style>
.iconfont.ss-icon-jiazai::before{
  display: inline-block;
  text-indent: 0px;
  animation:turn 1s linear infinite;
}
@keyframes turn{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(90deg);}
  50%{-webkit-transform:rotate(180deg);}
  75%{-webkit-transform:rotate(270deg);}
  100%{-webkit-transform:rotate(360deg);}
}
</style>
