<template>
  <div class="supervise">
    <!-- 任务管理 -->
    <div class="left">
      <div id="map" ref="worldMap"></div>
      <ul class="menu">
        <li>
          <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
            <div slot="content" style="width:120px;">
              <a-row>
                <a-radio-group v-model="mapType" @change="onMapChange">
                  <a-col :span="24">
                    <a-radio value="a">
                      <span style="margin-left:10px;">2D影像图</span>
                    </a-radio>
                  </a-col>
                  <a-col :span="24">
                    <a-radio value="b">
                      <span style="margin-left:10px;">卫星影像图</span>
                    </a-radio>
                  </a-col>
                </a-radio-group>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-switch size="small" v-model="roadWordChange" @click="onChangeSwitch" />
                  <span style="margin-left:7px;">道路标注</span>
                </a-col>
              </a-row>
            </div>
            <img src="../../assets/mapIcon.png" alt="图像" title="图像" />
          </a-popover>
        </li>
        <li style="border-radius: 40px;">
          <img @click="mapZoomIn" src="../../assets/max.png" alt="放大" />
          <img @click="mapZoomOut" src="../../assets/min.png" alt="缩小" />
        </li>
        <li>
          <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
            <div slot="content" style="width:120px">
              <a-row type="flex" justify="space-between" align="middle">
                <a-col :span="18">
                  <p style="margin:0;">自动监测点</p>
                </a-col>
                <a-col :span="6">
                  <a-switch size="small" v-model="autoDetection" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between" align="middle">
                <a-col :span="18">
                  <p style="margin:0;">人工监测点</p>
                </a-col>
                <a-col :span="6">
                  <a-switch size="small" v-model="peopleDetection" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between" align="middle">
                <a-col :span="18">
                  <p style="margin:0;">街道</p>
                </a-col>
                <a-col :span="6">
                  <a-switch size="small" v-model="streetShow" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between" align="middle">
                <a-col :span="18">
                  <p style="margin:0;">河道</p>
                </a-col>
                <a-col :span="6">
                  <a-switch size="small" v-model="riverShow" />
                </a-col>
              </a-row>
              <a-row
                v-show="listItemLeftRight==true"
                type="flex"
                justify="space-between"
                align="middle"
              >
                <a-col :span="18">
                  <p style="margin:0;">左右岸</p>
                </a-col>
                <a-col :span="6">
                  <a-switch size="small" v-model="leftRight" @click="leftRightSwitch" />
                </a-col>
              </a-row>
            </div>
            <img src="../../assets/img/more.png" alt="更多" title="更多" />
          </a-popover>
        </li>
      </ul>
    </div>
    <div class="right">
      <h3 style="font-size: 16px; font-weight: 600; margin:10px 0 0 10px; text-align:center;">巡河方案管理</h3>
      <a-divider style="margin: 10px 0 10px;" />
      <div style="padding: 0 10px">
        <section class="task_face">
          <a-select
            showSearch
            placeholder="请输入河流"
            optionFilterProp="children"
            style="width: 100%"
            @change="chooseRiver"
            :filterOption="filterOption"
            v-model="defaultRiver"
            v-show="!addLineShow"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in riverList"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <a-collapse
            v-show="!addLineShow"
            defaultActiveKey="1"
            accordion
            size="small"
            style="margin-top:10px;"
            @change="collapseChange"
          >
            <a-collapse-panel
              v-for="item in lineTaskList"
              :key="item.id"
              :style="customStyle"
              class="custom_list"
            >
              <template slot="header">
                <a-row style="width:100%">
                  <a-col :span="9">{{item.name}}</a-col>
                  <a-col :span="15" style="text-align:right;padding-right:10px;">
                    <a-button
                      size="small"
                      type="primary"
                      style="margin-right:5px;"
                      @click="edit(item.id)"
                    >编辑</a-button>
                    <a-button
                      size="small"
                      @click.stop="defaultPlan(item.id)"
                    >{{item.primary?"默认":"设为默认"}}</a-button>
                  </a-col>
                </a-row>
              </template>
              <a-tree
                defaultExpandAll
                @select="onSelect"
                :selectedKeys="selectedKeys"
                :treeData="item.dataTree"
              ></a-tree>
              <!-- <a-directory-tree multiple defaultExpandAll @select="riverPlan" @expand="onExpand">
              <a-tree-node title="360" key="0-0">
                <a-tree-node title="调查点1" key="0-0-0" isLeaf />
                <a-tree-node title="调查点2" key="0-0-1" isLeaf />
              </a-tree-node>
              <a-tree-node title="人工调查" key="0-1">
                <a-tree-node title="人工调查1" key="0-1-0" isLeaf />
                <a-tree-node title="人工调查2" key="0-1-1" isLeaf />
              </a-tree-node>
              <a-tree-node title="巡河线路1" key="0-2"></a-tree-node>
              </a-directory-tree>-->
            </a-collapse-panel>
          </a-collapse>
          <a-form v-show="addLineShow" style="width: 100%;">
            <a-form-item
              label="方案名称"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input placeholder v-model="list.name" />
            </a-form-item>
            <a-form-item
              label="关联河道"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                placeholder="请输入河流添加"
                optionFilterProp="children"
                style="width: 100%"
                @change="chooseRiver"
                :filterOption="filterOption"
                v-model="defaultRiver"
                disabled
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in riverList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="任务线路"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                mode="multiple"
                :allowClear="true"
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 100%"
                :filterOption="filterOption"
                v-model="list.lineId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in lineList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="调查点任务"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                mode="tags"
                :allowClear="true"
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 100%"
                :filterOption="filterOption"
                v-model="list.pointId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in spotList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </section>
        <a-button
          type="primary"
          block
          class="bottom_add"
          @click="addTask"
          v-show="!addLineShow"
        >创建方案</a-button>
        <!-- 线路任务按钮 -->
        <a-row
          v-show="addLineShow"
          class="bottom_add"
          type="flex"
          justify="space-around"
          align="middle"
        >
          <a-col :span="7">
            <a-button type="primary" block @click="taskCancel">取消</a-button>
          </a-col>
          <a-col :span="7">
            <a-popconfirm
              title="确定要删除吗?"
              @confirm="spotDel()"
              @cancel="cancelDelete"
              okText="确定"
              cancelText="取消"
            >
              <a-button type="primary" block>删除</a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="7">
            <a-button type="primary" block @click="taskSave">保存</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 鼠标跟随弹窗 -->
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultRiver}}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
import {
  getRiverList,
  getStreetList,
  programmeList,
  programmeSave,
  programmeDetail,
  programmeRemove,
  programmePrimary,
  taskSpotList,
  taskLineList,
  testingPage
} from '@/api/login'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData = []
export default {
  name: 'RiverPlanManage',
  components: {
    // 'world-map': WorldMap
  },
  data() {
    return {
      listItemLeftRight: false,
      leftRight: false,
      mapType: 'b', // 地图类型
      roadWordChange: true, // 道路标注
      mapLayerWord: '', // 道路层级
      riverShow: false, // 河道
      streetShow: false, // 街道
      once: 0, // 移入次数
      riverShowList: [], // 河道
      streetShowList: [], //街道
      alertLeft: -1000,
      alertTop: -1000,
      alertShow: false,
      autoDetection: false, // 自动监测点
      peopleDetection: false, // 人工监测点
      fixedPointList: [], //固定监测点
      peoplePointList: [], //人工监测点

      list: {
        id: '',
        projectId: this.$store.state.id,
        name: '',
        lineId: [],
        pointId: [],
        primary: false
      },
      defaultRiver: '',
      addRiverShow: false, // 气泡卡片
      lineList: [], //任务路线
      spotList: [], //任务点
      // activeKey: 0, //
      lineTaskList: [
        // {
        //   id: 0,
        //   name: '黄浦江方案1',
        //   key: 0,
        //   default: true
        // }
      ],
      customStyle: 'background: #fff;margin: 0;overflow: hidden',
      addRiverShow: false,
      addLineShow: false, // 线路任务显示
      addPointShow: false, // 点任务显示
      // 添加线路任务
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),

      SHOW_PARENT,
      value: '',
      riverList: [
        // {
        //   id: 0,
        //   name: '黄浦江',
        //   clicked: true
        // }
      ],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData,

      // 地图对象
      map: {},
      once: 0 // 移入次数
    }
  },
  mounted() {
    let token = Vue.ls.get(ACCESS_TOKEN)
    let zoom = 14
    let twoDimensionURL =
      'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayer2d = new T.TileLayer(twoDimensionURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    let satelliteURL = 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerSatellite = new T.TileLayer(satelliteURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    // 创建自定义图层对象
    let wordLabel = 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerWord = new T.TileLayer(wordLabel, { minZoom: 4, maxZoom: 18, zIndex: 15 })
    // 正射影像
    let mapImage = `${this.$store.state.serverUrl}/server/data/admin/regulator/uav/data/mbtiles?year=&month&day&x={x}&y={y}&z={z}&X-TENANT-ID=${this.$store.state.tenantId}&Authorization=${token}`
    this.mapLayerImage = new T.TileLayer(mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
    this.map = new T.Map('map', {
      minZoom: 4,
      maxZoom: 18,
      layers: [this.mapLayerSatellite, this.mapLayerWord]
    })
    this.map.centerAndZoom(this.$store.state.projectCoordinate, zoom)
    //添加比例尺控件
    let scale = new T.Control.Scale()
    // scale.setColor("red")
    this.map.addControl(scale)

    // this.getList()
    this.getRiverStreeList()
    this.getFixedList() // 获取固定监测点
    this.getManualList() // 获取人工监测点
  },
  watch: {
    $route() {
      this.getList()
    },
    autoDetection() {
      // 自动监测点
      this.watchAllSwitch()
    },
    peopleDetection() {
      //人工监测点
      this.watchAllSwitch()
    },
    // 河道显示
    riverShow() {
      this.watchAllSwitch()
    },
    // 街道显示
    streetShow() {
      this.watchAllSwitch()
    }
  },
  methods: {
    getList() {
      getRiverList(this.$store.state.id)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.clicked = false
          })
          this.riverList = arr
        })
        .catch(err => {})
    },
    //编辑
    edit(id) {
      this.addLineShow = true
      programmeDetail(id)
        .then(res => {
          var arr = res.data
          this.list.id = arr.id
          this.list.name = arr.name
          this.list.primary = arr.primary
          var lineId = []
          var pointId = []
          if (arr.lines != null) {
            arr.lines.forEach(v => {
              lineId.push(v.id)
            })
          }
          if (arr.points != null) {
            arr.points.forEach(v => {
              pointId.push(v.id)
            })
          }
          console.log(lineId, pointId)

          this.list.lineId = lineId
          this.list.pointId = pointId
        })
        .catch(err => {})
    },
    //删除
    spotDel() {
      if (this.list.id == '') {
        this.$message.error('请先保存任务')
      } else {
        programmeRemove(this.list.id)
          .then(res => {
            this.$message.success('删除成功')
            this.taskCancel()
            this.chooseRiver()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    cancelDelete(e) {
      // this.$message.error('Click on No')
    },
    //请求点线任务
    collapseChange(key) {
      // console.log(key);
      // if (key != undefined) {
      //   taskSpotList(key).then(res => {
      //     console.log(res);
      //   }).catch(err => {
      //   })
      //   taskLineList(key).then(res => {
      //     console.log(res);
      //   }).catch(err => {
      //   })
      // }
    },
    hiddenMenuChange(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
    },
    // 注册事件
    // 注册添加点击事件
    addMapClick() {
      this.removeMapClick()
      this.map.addEventListener('click', this.MapClick)
    },
    // 地图点击事件
    MapClick(e) {
      const postion = []
      const that = this
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      //向地图上添加自定义标注
      // let marker = new T.Marker(new T.LngLat(postion), {icon: icon});
      let marker = new T.Marker(new T.LngLat(e.lnglat.lng, e.lnglat.lat), { icon: icon })
      this.map.addOverLay(marker)
      //向地图上添加圆
      let circle = new T.Circle(new T.LngLat(e.lnglat.lng, e.lnglat.lat), 1000, {
        color: 'blue',
        weight: 2,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0.5,
        lineStyle: 'solid'
      })
      this.map.addOverLay(circle)

      // 添加文字标注
      let labeName = '专向调查点' + (this.mapPoint.size + 1)
      let label = new T.Label({
        text: `<b style="border-radius: 3px">${labeName}<b>`,
        position: marker.getLngLat(),
        offset: new T.Point(-56, 20)
      })
      this.map.addOverLay(label)

      // 向mapPoint对象添加节点
      let mapPointChild = { marker: marker, circle: circle, label: label }
      this.mapPoint.set(labeName, mapPointChild)

      // 向地图注册标注点击事件
      //移除标注的点击事件，防止多次注册
      removeMarkerClick()
      //注册标注的点击事件
      marker.addEventListener('click', MarkerClick)

      function removeMarkerClick() {
        //移除标注的点击事件
        marker.removeEventListener('click', MarkerClick)
      }

      function MarkerClick(e) {
        console.log('这是标注点击事件' + e)
        console.log(e)
        //设置显示地图的中心点和级别
        // that.map.centerAndZoom(new T.LngLat(e.lnglat.lng, e.lnglat.lat));
        that.map.centerAndZoom(new T.LngLat(e.lnglat.lng + 0.01, e.lnglat.lat))
      }
    },
    // 地图删除事件
    removeMapClick() {
      this.map.removeEventListener('click', this.MapClick)
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info)

      this.selectedKeys = selectedKeys
      var info = info.node.dataRef
      this.clearLays()
      if (info.children) {
        for (var i = 0; i < info.children.length; i++) {
          if (info.children[i].riverData.length > 1) {
            console.log(info.children[i].riverData)
            this.positionArea(info.children[i].riverData)
            this.map.setZoom('13')
          }
          if (info.children[i].riverData.length == 1) {
            this.map.setZoom('10')
            this.setMarkerInfo(info.children[i].riverData)
          }
        }
      } else {
        if (info.riverData.length > 1) {
          this.positionArea(info.riverData)
        }
        if (info.riverData.length == 1) {
          this.map.setZoom('14')
          this.setMarkerInfo(info.riverData)
        }
      }
    },
    //定位到选中地
    positionArea(val) {
      this.map.setViewport(val)
      this.setPolygonLine(val, 'red', 3, 0)
      this.polygon.addEventListener('click', this.polygonClick)
    },
    //绘制多边形
    setPolygonLine(layerData, color, weighe, fillOpacity) {
      this.polygon = new T.Polygon(layerData, {
        color: color,
        weight: weighe,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: fillOpacity
      })
      this.map.addOverLay(this.polygon)
    },
    //绘制标注点
    setMarkerInfo(riverData) {
      this.map.setViewport(riverData)
      this.map.setZoom('14')
      for (var i = 0; i < riverData.length; i++) {
        var lng = riverData[i].lng
        var lat = riverData[i].lat
        var point = new T.LngLat(lng, lat)
        var marker = new T.Marker(point)
        this.map.addOverLay(marker)
        var markerInfo = new T.InfoWindow('信息窗口')
        marker.addEventListener('click', function() {
          marker.openInfoWindow(markerInfo)
        })
      }
    },
    // 弹窗点击确认事件
    modalClick(v) {
      this[v].click()
    },
    //右侧菜单列表追加任务
    additionalTask(o) {},
    // 打开弹窗
    openPopup(v) {
      this.transferAttribute = this[v]
      this.transferAttribute.visible = true
    },
    // 地图选项
    onChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    // 选择方案详情
    riverPlan(keys) {
      console.log('Trigger Select', keys)
    },
    onExpand() {
      console.log('Trigger Expand')
    },
    // 设为默认方案
    defaultPlan(index) {
      var data = {
        id: index,
        riverId: this.defaultRiver
      }
      programmePrimary(data)
        .then(res => {
          this.$message.success('保存成功')
          this.chooseRiver()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
      // this.lineTaskList.forEach(value=>{
      //   if (value.name === index) {
      //     value.default = true
      //   } else {
      //     value.default = false
      //   }
      // })
    },

    // 创建方案
    addTask() {
      this.addLineShow = true
    },
    // 关联河道
    chooseRiver(index) {
      console.log(`selected ${index}`)
      var data = {
        id: this.defaultRiver,
        prid: this.$store.state.id
      }
      programmeList(data)
        .then(res => {
          var arr = res.data.data
          for (let a = 0; a < arr.length; a++) {
            if (arr[a].points != null) {
              arr[a].points.forEach(v => {
                v.title = v.name
                v.key = v.id
                v.children = false
                v.riverData = v.coordinate
              })
            } else {
              arr[a].points = []
            }
            if (arr[a].lines != null) {
              arr[a].lines.forEach(v => {
                v.riverData = []
                v.title = v.name
                v.key = v.id
              })
            } else {
              arr[a].lines = []
            }
            arr[a].dataTree = arr[a].lines.concat(arr[a].points)
          }
          this.lineTaskList = arr
        })
        .catch(err => {})

      taskSpotList({ id: this.defaultRiver })
        .then(res => {
          var arr = res.data
          this.spotList = arr
        })
        .catch(err => {})
      taskLineList(this.defaultRiver)
        .then(res => {
          var arr = res.data
          this.lineList = arr
        })
        .catch(err => {})
      this.riverList.forEach(value => {
        if (value.name === index) {
          value.clicked = true
        } else {
          value.clicked = false
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 线路任务按钮
    taskCancel() {
      this.addLineShow = false
      this.list.id = ''
      this.list.name = ''
      this.list.lineId = []
      this.list.pointId = []
      this.list.primary = false
    },
    taskSave() {
      var data = this.list
      data.lineId = data.lineId.join(',')
      data.pointId = data.pointId.join(',')
      data.riverId = this.defaultRiver
      programmeSave(data)
        .then(res => {
          this.addLineShow = false
          this.$message.success('保存成功')
          this.chooseRiver()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    // 添加调查点任务
    addRiverPlan(value) {
      console.log('onChange ', value)
      this.value = value
    },
    //清楚覆盖物
    clearLays() {
      this.map.clearOverLays()
    },
    // 放大
    mapZoomIn() {
      this.map.zoomIn()
    },
    // 缩小
    mapZoomOut() {
      this.map.zoomOut()
    },
    // 图像
    onMapChange(e) {
      if (e.target.value == 'a') {
        this.map.addLayer(this.mapLayer2d)
        this.map.removeLayer(this.mapLayerSatellite)
      } else if (e.target.value == 'b') {
        this.map.addLayer(this.mapLayerSatellite)
        this.map.removeLayer(this.mapLayer2d)
      }
    },
    // 道路开关
    onChangeSwitch() {
      if (this.roadWordChange) {
        this.map.addLayer(this.mapLayerWord)
      } else {
        this.map.removeLayer(this.mapLayerWord)
      }
    },
    // 获取所有河道街道列表
    getRiverStreeList() {
      getStreetList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.streetShowList = arr
        })
        .catch(err => {})
      getRiverList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
            let points = []
            for (const point of v.leftBankRegion) {
              points.push(new T.LngLat(point[0], point[1]))
            }
            v.leftBankRegion = points
            let points1 = []
            for (const point of v.rightBankRegion) {
              points1.push(new T.LngLat(point[0], point[1]))
            }
            v.rightBankRegion = points1
          })
          this.riverShowList = arr // 河流显隐
          this.riverList = arr // 河流列表
        })
        .catch(err => {})
    },
    //固定监测分页
    getFixedList() {
      var data = {
        id: 'fixed',
        prid: this.$store.state.id
      }
      testingPage(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.latlng = v.coordinate
            v.clicked = false
          })
          this.fixedPointList = arr
        })
        .catch(err => {})
    },
    //人工监测分页
    getManualList() {
      var data = {
        id: 'manual',
        prid: this.$store.state.id
      }
      testingPage(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.latlng = v.coordinate
            v.clicked = false
          })
          this.peoplePointList = arr
        })
        .catch(err => {})
    },
    allPointTestingTask(pointLists) {
      for (const item of pointLists) {
        this.drawTestingAllPoint(item.latlng, item.id, item.name, item.type.code)
      }
    },
    // 添加标注图片
    drawTestingAllPoint(latlng, id, title, type) {
      let iconUrl
      if (type == 'fixed') {
        iconUrl = require('../../assets/img/fixedIcon.png')
      } else if (type == 'manual') {
        iconUrl = require('../../assets/img/peopleIcon.png')
      }
      let icon = new T.Icon({
        iconUrl: iconUrl,
        iconSize: new T.Point(41, 40),
        iconAnchor: new T.Point(21, 40)
      })
      let marker = new T.Marker(latlng, { icon: icon, id: id, title: title })
      this.map.addOverLay(marker)
    },
    // 检测所有开关
    watchAllSwitch() {
      // 固定监测点
      if (this.autoDetection) {
        this.allPointTestingTask(this.fixedPointList)
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.fixedPointList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
      //人工监测点
      if (this.peopleDetection) {
        this.allPointTestingTask(this.peoplePointList)
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.peoplePointList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
      // 街道显示
      if (this.streetShow) {
        for (const item of this.streetShowList) {
          let polygon = new T.Polygon(item.lineData, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0, // 填充透明度
            title: item.name, // 名字
            id: item.id // id
          })
          //向地图上添加面
          this.map.addOverLay(polygon)
          polygon.addEventListener('click', this.polygonStreetClick)
          polygon.addEventListener('mouseover', this.polygonStreetMouseover)
          polygon.addEventListener('mousemove', this.polygonStreetMousemove)
          polygon.addEventListener('mouseout', this.polygonStreetMouseout)
        }
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.streetShowList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
      // 河道显示
      if (this.riverShow) {
        this.listItemLeftRight = true
        for (const item of this.riverShowList) {
          let polygon = new T.Polygon(item.lineData, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0, // 填充透明度
            title: item.name, // 名字
            id: item.id // id
          })
          //向地图上添加面
          this.map.addOverLay(polygon)
          polygon.addEventListener('click', this.polygonRiverClick)
          polygon.addEventListener('mouseover', this.polygonMouseover)
          polygon.addEventListener('mousemove', this.polygonMousemove)
          polygon.addEventListener('mouseout', this.polygonMouseout)
        }
      } else {
        if (this.leftRight == true) {
          for (const overlay of this.map.getOverlays()) {
            for (const item of this.riverShowList) {
              if (item.id + '1' == overlay.options.id) {
                this.map.removeOverLay(overlay)
              }
              if (item.id + '2' == overlay.options.id) {
                this.map.removeOverLay(overlay)
              }
            }
          }
          this.leftRight = false
        }
        this.listItemLeftRight = false
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.riverShowList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
    },
    leftRightSwitch() {
      if (this.leftRight) {
        for (const item of this.riverShowList) {
          if (item.leftBankRegion.length > 0) {
            let polygonStreet = new T.Polygon(item.leftBankRegion, {
              color: 'yellow', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              fillColor: '#FFFFFF', //填充颜色
              fillOpacity: 0, // 填充透明度
              title: item.name, // 名字
              id: item.id + '1' // id
            })
            //向地图上添加线
            this.map.addOverLay(polygonStreet)
          }
          if (item.rightBankRegion.length > 0) {
            let polygonStreet1 = new T.Polygon(item.rightBankRegion, {
              color: 'yellow', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              fillColor: '#FFFFFF', //填充颜色
              fillOpacity: 0, // 填充透明度
              title: item.name, // 名字
              id: item.id + '2' // id
            })
            //向地图上添加线
            this.map.addOverLay(polygonStreet1)
          }
        }
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.riverShowList) {
            if (item.id + '1' == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
            if (item.id + '2' == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
    },
    // 多边形点击事件
    polygonRiverClick(index) {
      console.log(index)
    },
    // 多边形移入事件
    polygonMouseover(index) {
      if (this.once == 1) {
        return
      }
      for (const item of this.riverShowList) {
        if (item.id == index.target.options.id) {
          this.defaultRiver = item.name
        }
      }
      this.once++
    },
    polygonMousemove() {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
      this.alertShow = true
    },
    // 多边形移出事件
    polygonMouseout() {
      this.once--
      this.alertShow = false
    },
    // 多边形点击事件
    polygonStreetClick(index) {
      console.log(index)
    },
    // 多边形移入事件
    polygonStreetMouseover(index) {
      if (this.once == 1) {
        return
      }
      for (const item of this.streetShowList) {
        if (item.id == index.target.options.id) {
          this.defaultRiver = item.name
        }
      }
      this.once++
    },
    polygonStreetMousemove() {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
      this.alertShow = true
    },
    // 多边形移出事件
    polygonStreetMouseout() {
      this.once--
      this.alertShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.supervise {
  position: relative;
  height: calc(100vh - 52px);
  width: 100vw;
}
#map {
  width: 100%;
  height: 100%;
}
.left {
  position: relative;
  width: calc(100% - 300px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
}
.right {
  position: relative;
  width: 300px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  // padding: 10px;
  background-color: white;
}
.task_face {
  width: 100%;
  height: calc(100vh - 160px);
  overflow: auto;
}

.ant-form-item {
  margin-bottom: 10px;
}

.bottom_add {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  margin: auto;
  width: 70%;
}

.mouse_alert {
  position: absolute;
  z-index: 999;
  border: 1px solid #333;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 0 4px;
  border-radius: 3px;
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.5);
  span {
    color: rgba(255, 0, 0, 0.8);
    font-size: 14px;
  }
}

.menu {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 40px;
  z-index: 888;
  margin: 0;
  padding: 0;
  list-style-type: none;
  li {
    width: 100%;
    background: rgba(24, 44, 117, 1);
    border-radius: 50%;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
    margin-top: 10px;

    img {
      width: 100%;
      height: 40px;
      padding: 5px;
    }
  }
}
.ant-col-6 {
  text-align: right;
}
</style>