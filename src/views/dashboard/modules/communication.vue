<template>
  <a-modal
    :visible="visible"
    :footer="null"
    :width="510"
    @cancel="cmtHandle"
    :maskClosable="false"
    class="cmModal custom_modal"
    v-if="visible"
    v-dragModal
  >
    <template slot="closeIcon">
      <a-icon type="close-circle" />
    </template>
    <template slot="title">
      <div>外勤反馈</div>
      <!-- <span style="background-color:#EBF5FF;border:1px solid #e8e8e8;border-radius: 50%;padding:8px 10px;">张</span> -->
    </template>
    <div style="font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(82,90,111,1);margin-bottom:10px">经度：{{lng}},纬度：{{lat}}</div>
    <div  v-for="item in list" :key="item.id" style="margin-bottom:10px">
      <div style="display:flex;" v-show="item.creatorType== true">
        <img src="../img/head.png" alt="" style="width:30px;height:30px">
        <div class="nameTime">
          <span style="width: 50px;padding: 0px;margin: 0px;color: rgb(0, 0, 0);">{{item.creatorName}}</span>
          <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(188,190,199,1);">{{item.time}}</span>
        </div>
      </div>
      <!-- <div style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(188,190,199,1);line-height:26px;">{{item.date}}</div> -->
      <div style="display:flex;margin-left:32px">
        <!-- <div style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(82,90,111,1);line-height:26px;width:70px">{{item.creator.name}}</div> -->
        <div style="">
            <div style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(82,90,111,1);line-height:26px;margin-bottom:10px" v-show="item.remark != ''">内容：{{item.remark}}</div>
            <div style="width:393px">
              <viewer >
                <img :src="item.media" alt style="height:200px" v-show="item.mediaType=='image'"/>
              </viewer>
              <a-button @click="audioBut(item)" v-show="item.mediaType=='audio'">{{item.mediaName}}</a-button>
            </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { dataManual } from '@/api/login'
import BenzAMRRecorder from 'benz-amr-recorder'
export default {
  name: '',
  data() {
    return {
      lng:'',
      lat:'',
      visible: false,
      audioSHow:false,
      playerOptions: {
        height: '360',
        autoplay: false,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: 'http://vjs.zencdn.net/v/oceans.mp4'
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg'
      },
      amr: null,
      list: []
    }
  },
  mounted() {
    this.amr = new BenzAMRRecorder();
    setTimeout(() => {
    }, 5000)
  },
  computed: {
    player() {
      // return this.$refs.videoPlayer.player
    }
  },
  methods: {
    audioBut(item){
      var that = this
      if (that.amr.isPlaying()) {
        that.amr.pause();
        that.list.forEach(v => {
          if (v.id == item.id) {
            v.mediaName = '继续'
          }
        });
      } else {
        if (item.mediaName == '继续') {
          this.amr.resume()
          that.list.forEach(v => {
            if (v.id == item.id) {
              v.mediaName = '暂停'
            }
          });
          that.amr.onEnded(function() {
            that.list.forEach(v => {
              if (v.id == item.id) {
                v.mediaName = '播放'
              }
            });
          })
        } else {
          this.amr = new BenzAMRRecorder();
          that.amr.initWithUrl(item.media).then(function() {
            if(that.amr.isPlaying()){
              that.amr.stop();
            } else {
              that.amr.play();
              that.list.forEach(v => {
                if (v.id == item.id) {
                  v.mediaName = '暂停'  
                }
              });
            }
          });
          that.amr.onEnded(function() {
            that.list.forEach(v => {
              if (v.id == item.id) {
                v.mediaName = '播放'
              }
            });
          })
        }
      }
    },
    show(index, picker) {
      this.lng = index.target.options.coordinate.lng
      this.lat = index.target.options.coordinate.lat
      var data = {
        projectId: this.$store.state.id,
        coordinate: index.target.options.coordinate.lng + ',' + index.target.options.coordinate.lat,
        radius: '0.05',
        // year: '2019',
        // month: '11',
        // day: '28'
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      dataManual(data).then(res => {
        let arr = res.data.data
        function timeDate (data) {
          var now = new Date(data)
          var year=now.getFullYear();  //取得4位数的年份
          var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
          var date=now.getDate();      //返回日期月份中的天数（1到31）
          var hour=now.getHours();     //返回日期中的小时数（0到23）
          var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
          var second=now.getSeconds(); //返回日期中的秒数（0到59）
          if (Number(month)<10) {
              month = '0'+month
          }
          if (Number(date)<10) {
              date = '0'+date
          }
          if (Number(hour)<10) {
              hour = '0'+hour
          }
          if (Number(minute)<10) {
              minute = '0'+minute
          }
          if (Number(second)<10) {
              second = '0'+second
          }
          return year+'-'+month+"-"+date+' '+hour+":"+minute+':'+second
        }
        arr.forEach(v => {
          v.mediaName = '播放'
          if (v.creator.name) {
            v.creatorType = true
            v.creatorName = v.creator.name
          } else {
            v.creatorType = false
            v.creatorName = ''
          }
          v.time = timeDate(v.timeCreated)
          if (v.mediaType) {
            v.mediaType = v.mediaType.code
          }else{
            v.mediaType = ''
          }
        });  
        this.list = arr
        // if (arr.length>0) {
        //   arr.forEach(v => {
            
        //   });  
        // }
      })

      this.visible = true
    },
    cmtHandle() {
      this.list = []
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.cmModal .ant-modal-content .ant-modal-body {
  padding: 10px;
}
.header {
  margin-bottom: 15px;
}
.player {
  width: 100%;
  height: 100%;
}
.video-player {
  width: 100%;
}
.nowdate {
  text-align: right;
}
.nameTime{
  margin-left:12px;
  height: 43px;
  width: 200px;
  font-size: 12px;
  display: flex;
  // position: relative;
}
</style>
