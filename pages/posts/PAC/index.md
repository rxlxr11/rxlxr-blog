---
title: 感知与控制课设
date: 2023-07-10 11:42:43
updated: 2023-07-10 11:42:43
tags:
  - Vue
  - SpringBoot
  - 江苏大学
categories:
  - 课程设计
aplayer: true
cover: http://www.rxlxr.com/images/cover/ujs2.png
---

现场快递柜状态采集与控制系统的实现，主要涉及串口通信及网页前后端的开发。

<!-- more -->

### 现场快递柜状态采集与控制系统

#### 目标 

设计实现一个对现场快递柜状态数据采集、显示、参数设置、抽屉打开、保鲜控制等功能软件系统。  

![](./test.png)

#### 主要内容

1. 设计实现快递柜控制板仿真软件， 如下图所示， 实现对快递柜控制板状态数据的采集与显示，包括当前温度、 设定温度（控制温度）、 压缩机状态、 10 个抽屉的开关状态。其中当前温度可以设置某种变化规律， 例如压缩机启动后， 每秒钟当前温度降 0.5 度， 但不能超过最低下限值， 例如-40 度， 压缩机关闭后， 当前温度每秒上升 0.2 度， 但不能超过最高上限值， 例如 60 度等。

2. 在快递柜控制板仿真软件中， 依据控制温度和压缩机的启停控制，实现对快递柜控制板温度的控制，控制精度为 1 度。

3. 理解快递柜控制板仿真软件的通信协议（见附件），并设计实现，进而实现与快递柜控制板仿真软件（见附件） 的通信（对于控制命令要考虑通过握手机制实现可靠传输）。

4. 设计实现现场快递柜状态采集与控制系统软件， 如图 1 所示。 实现对所控制快递柜控制板状态数据的采集与显示，包括当前温度、 设定温度（控制温度）、 压缩机工作状态、10 个抽屉的开关状态等； 同时， 实现对开关指定抽屉、启停温度控制（压缩机制冷控制）、设置控制温度、以及设置系统参数等设置操作。

5. 在现场快递柜状态采集与控制系统软件中， 可以以曲线方式显示 1 小时内的当前温度和设定温度的变化趋势， 控制板的温度采集间隔为 10 秒  。

#### 设计实现

后端先与快递柜控制板实现串口通信。当串口连接建立后，后端就可以通过输入流来读取快递柜的传来的数据帧，并对垃圾数据进行拦截，进行错误的数据的过滤。

对于感知的实现，前端异步地从后端获取数据，当前端发送get请求时，后端将数据帧拆封并分析，随后将分析好的数据发送给前端，前端将数据展示在页面上。

对于控制的实现，用户可以通过简单的输入和点击完成对快递柜控制温度、设备地址等系统参数的配置，以及对抽屉和压缩机状态的控制。前端通过点击等事件异步地触发post或put请求，后端接收到前端发送的json数据后，分析是哪一种控制，根据帧格式构建相对应的控制帧，然后将控制帧写入串口的输出流，将控制帧发送给控制板，令其完成对应指令。

### 前端Vue

前端才用Vue框架进行编写，通过axios异步的收发数据。

> 用axios异步获取数据和传输数据，传输数据时要将axios的数据设置为json格式axios.defaults.headers.common['Content-Type'] = 'application/json';  

前端页面中的组件使用element组件。图表则是使用Echarts进行展示。

将一个页面中需要展示的分为多个组件，之后在页面组件中导入子组件进行展示，方便修改和多次利用。

由于这是一个前后端分离的项目，前端组件的数据是异步获取的所以可以通过其他工具例如yapi等暂代后端给前端发送数据来测试前端是否有bug。

前端以轮询的方式每2.5秒发送一次get请求来获取实时状态信息，即每隔2.5秒都会获取一次数据，向后端发送get请求。当java后端Controller层接收到get请求后，调用Service层的数据处理函数，Service曾调用Dao层的数据获取函数。当信息处理好后，Controller层向前端返回结果，前端将数据依次呈现出来。

当前端要向后端发送数据时使用post或者put请求，将数据封装为json格式发送给后端，再由后端进行反序列化。



#### 组件

每个组件要将其导出，以便使用。

相关组件使用的是element，可以至

[官网]: https://element.eleme.io/#/zh-CN

查看源码

##### 卡片

``` JavaScript
<template>  
<div :style="{mode:mode}">  
      <el-card class="box-card" v-loading="loading">  
        <div slot="header" class="clearfix">  
          <span style="font-weight: bold;font-size: 25px">压缩机</span>  
        </div>        
        <div>          
        <i class="el-icon-cpu"></i>  
          <span style="font-size: 55px;float: right" >{{value}}</span>  
        </div>      
        </el-card>
        </div>  
</template>  
  
<script>  
import axios from "axios";  
  
  
export default {  
  // eslint-disable-next-line vue/multi-word-component-names  
  name: "Card1",  
  props: {  
    mode: {  
      type: Boolean,  
      default: false  
    }  
  },  
  data(){  
    return {  
      value: "停止" ,  
      loading: true  
    }  
  },  
  mounted() {  
    axios.get("http://localhost:8080/perception").then((result) => {   
      this.value= result.data.value.compressor;  
      this.loading = false;  
    });  
  },  
  methods: {  
  
  }  
}  
</script>  
  
<style scoped>  
.text {  
  font-size: 14px;  
}  
  
.item {  
  margin-bottom: 18px;  
}  
  
.clearfix:before,  
.clearfix:after {  
  display: table;  
  content: "";  
}  
.clearfix:after {  
  clear: both  
}  
  
.box-card {  
  width: 350px;  
  height: 200px;  
}  
  
  
.clearfix:before,  
.clearfix:after {  
  display: table;  
  content: "";  
}  
  
.clearfix:after {  
  clear: both  
}  
.el-icon-cpu{  
  font-size: 100px;  
  color: #407eff;  
}  
  
</style>
```
##### 图表
定义一个drawline方法，画图相关内容可至echarts官网查看

```JavaScript
<template>  
  <div class="Echarts">  
    <div :style="{ height: height, width: width }" :id="id" v-loading="loading"></div>  
  </div></template>  
  
<script>  
import axios from "axios";  
  
let echarts = require("echarts/lib/echarts");  
export default {  
  
  // eslint-disable-next-line vue/multi-word-component-names  
  name: "Echarts",  
  props: {  
    height: {  
      type: String,  
      default: "700px",  
    },  
    width: {  
      type: String,  
      default: "1200px",  
    },  
    id: {  
      type: String,  
      default: "demo",  
    },  
  },  
  data() {  
    return {  
      chartData:  
        {  
          "categories": [],  
          "temp" :  [],  
          "setting_temp":[]  
        },  
        loading: true  
    };  
  },  
  mounted() {  

    axios.get("http://localhost:8080/perception").then((result) => {  
        this.chartData.categories = result.data.categories;  
        this.chartData.temp = result.data.temp;  
        this.chartData.setting_temp = result.data.setting_temp;  
        this.drawLine(this.chartData);  
        this.loading = false  
      });  
  
  },  
  methods: {  
    drawLine(data) {  
      // 基于准备好的dom，初始化echarts实例  
      console.log(this.id);  
      let myChart = echarts.init(document.getElementById(this.id));  
      // 绘制图表  
      myChart.setOption({  
        title: {  
          text: '温度与设定温度随时间的变化',  
        },  
        tooltip: {},  
        legend: {},  
        xAxis: {  
          data: data.categories  
        },  
        yAxis: {},  
        series: [  
          {  
            name: '温度',  
            type: 'line',  
            stack: 'x',  
            data: data.temp  
          },  
          {  
            name: '设定温度',  
            type: 'line',  
            stack: 'x',  
            data: data.setting_temp  
          }  
        ]  
      });  
    },  
  },  
};  
</script>  
  
  
<style>  
  
</style>
```
##### 开关
开关在感知页面禁用，只有在控制页面可以使用，定义一个mode属性 ，当其为true时，disabled启用

``` JavaScript
<template>  
  <div class="switch" v-loading="loading" :style="{mode: mode}">  
    <div class="switch1">  
    <el-row :gutter="72">  
      <el-col :span="4" >  
        <el-switch            style="display: block"  
            v-model="value[0]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉1"  
            :disabled=mode>  
        </el-switch>      </el-col>      <el-col :span="4" >  
        <el-switch            style="display: block"  
            v-model="value[1]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉2"  
            :disabled=mode>  
        </el-switch>      </el-col>      <el-col :span="4" >  
        <el-switch            style="display: block"  
            v-model="value[2]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉3"  
            :disabled=mode>  
        </el-switch>      </el-col>      <el-col :span="4" >  
        <el-switch            style="display: block"  
            v-model="value[3]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉4"  
            :disabled=mode>  
        </el-switch>      </el-col>      <el-col :span="4" >  
        <el-switch            style="display: block"  
            v-model="value[4]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉5"  
            :disabled=mode>  
        </el-switch>      </el-col>    </el-row>    </div>    <br><br><br><br>    <div class="switch2">  
    <el-row :gutter="72">  
      <el-col :span="4">  
        <el-switch            style="display: block"  
            v-model="value[5]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉6"  
            :disabled= mode>  
        </el-switch>      </el-col>      <el-col :span="4">  
        <el-switch            style="display: block"  
            v-model="value[6]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉7"  
            :disabled= mode>  
        </el-switch>      </el-col>      <el-col :span="4">  
        <el-switch            style="display: block"  
            v-model="value[7]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉8"  
            :disabled= mode>  
        </el-switch>      </el-col>      <el-col :span="4">  
        <el-switch            style="display: block"  
            v-model="value[8]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉9"  
            :disabled = mode>  
        </el-switch>      </el-col>      <el-col :span="4">  
        <el-switch            style="display: block "  
            v-model="value[9]"  
            active-color="#409eff"  
            inactive-color="#ff4949"  
            inactive-text="抽屉10"  
            :disabled = mode>  
        </el-switch>      </el-col>    </el-row>    </div>    <br><br>    <br><br>  </div></template>  
  
<script>  
import axios from "axios";  
  
export default {  
  // eslint-disable-next-line vue/multi-word-component-names  
  name: "Drawer",  
  props: {  
    mode: {  
      type: Boolean,  
      default: false,  
    }  
  },  
  data() {  
    return {  
      value: [],  
      loading: true  
    }  
  },  
  methods: {  
  
  },  
  mounted() {  
    axios.get("http://localhost:8080/perception").then((result) => {  
    //axios.get("http://yapi.smart-xwork.cn/mock/264565/drawer").then((result) => {  
      this.value= result.data.value.drawer;  
      //this.value= result.data.result.value;  
      this.loading = false;  
    });  
  }  
}  
</script>  
  
<style scoped>  
.switch1{  
  display: flex;  
  justify-content: center;  
  zoom: 1.5;  
}  
.switch2{  
  display: flex;  
  justify-content: center;  
  zoom: 1.5;  
}  
body{  
  margin: 0;  
}  
</style>
```
#### 页面
分为头部，侧边和主体并导入有关模块，要使用模块中的数据要使用refs。导入需要使用的组件。

##### 感知
``` JavaScript
<template>  
  <div>    <el-container  style="height: 500px; border: 1px solid #eee">  
      <el-header style="font-size: 40px;  
      background-color: #409eff;color: #eeeeee;  
      text-align: center;  
      font-family: 'Microsoft YaHei UI'">  
        感知与控制 - 感知  
      </el-header>  
      <el-container>        <el-aside width="200px" >  
          <el-menu :default-openeds="['1', '3']">  
            <el-submenu index="1">  
              <template slot="title"><i class="el-icon-view"></i>感知</template>  
              <el-menu-item index="1-1">  
                <router-link to="/perception">感知</router-link>  
              </el-menu-item>  
              <el-menu-item index="1-2">  
                <router-link to="/perception">感知</router-link>  
              </el-menu-item>            </el-submenu>            <el-submenu index="2">  
  
              <template slot="title"><i class="el-icon-upload2"></i>控制</template>  
              <el-menu-item index="2-1">  
                <router-link to="/control">控制</router-link>  
              </el-menu-item>  
              <el-menu-item index="2-2">  
                <router-link to="/control">控制</router-link>  
              </el-menu-item>            </el-submenu>          </el-menu>        </el-aside>        <el-main>          <el-row>            <el-col :span="8">  
              <Card3></Card3>            </el-col>            <el-col :span="8">  
              <Card2></Card2>            </el-col>            <el-col :span="8">  
              <Card1 :mode=true>  
              </Card1>            </el-col>          </el-row>          <br><br>          <drawer :mode="true"></drawer>  
          <br><br>          <div class="main-con">  
            <echarts                :width="width"  
                :height="height"  
                :id="id">  
            </echarts>          </div>        </el-main>      </el-container>    </el-container>  </div></template>  
  
<script>  
import echarts from '@/views/PerAndCon/component/Echarts.vue'  
import Drawer from "@/views/PerAndCon/component/Drawer.vue";  
import Card3 from "@/views/PerAndCon/component/Card3.vue";  
import Card2 from "@/views/PerAndCon/component/Card2.vue";  
import Card1 from "@/views/PerAndCon/component/Card1.vue";  
  
export default {  
  // eslint-disable-next-line vue/multi-word-component-names  
  name: 'perception',  
  data(){  
    return{  
      width: '100%',  
      height: '500px',  
      id: 'chartShow',  
      value2: "false",  
      value1: "true"  
    }  
  },  
  methods: {  
  
  },  
  mounted() {  
    //发送异步请求  
  },  
  
  components:{  
    Card3,  
    Card2,  
    Card1,  
    Drawer,  
    echarts  
  }  
  
}  
  
</script>  
  
<style lang="css" scoped>  
.main-con{  
  width: 100%;  
  height: 100%;  
  padding: 20px;  
}  
  
  
  
</style>
```
##### 控制
定义多个点击按钮事件触发的方法，触发方法后会异步传输数据。

``` JavaScript
<template>  
  <div>    <el-container  style="height: 500px; border: 1px solid #eee">  
      <el-header style="font-size: 40px;  
      background-color: #409eff;color: #eeeeee;  
      text-align: center;  
      font-family: 'Microsoft YaHei UI'">  
        感知与控制 - 控制  
      </el-header>  
      <el-container>        <el-aside width="200px" >  
          <el-menu :default-openeds="['1', '3']">  
            <el-submenu index="1">  
              <template slot="title"><i class="el-icon-view"></i>感知</template>  
              <el-menu-item index="1-1">  
                <router-link to="/perception">感知</router-link>  
              </el-menu-item>  
              <el-menu-item index="1-2">  
                <router-link to="/perception">感知</router-link>  
              </el-menu-item>            </el-submenu>            <el-submenu index="2">  
  
              <template slot="title"><i class="el-icon-upload2"></i>控制</template>  
              <el-menu-item index="2-1">  
                <router-link to="/control">控制</router-link>  
              </el-menu-item>  
              <el-menu-item index="2-2">  
                <router-link to="/control">控制</router-link>  
              </el-menu-item>            </el-submenu>          </el-menu>        </el-aside>        <el-main>          <el-row>            <el-col :span="8">  
              <Card2></Card2>            </el-col>            <el-col :span="8">  
              <Card1 :disabled=false></Card1>  
            </el-col>            <el-col :span="8">  
              <Card4></Card4>            </el-col>          </el-row>          <br>          <el-row>            <el-col :span="5">  
              <el-input v-model="input" placeholder="请输入内容" size="medium"></el-input>  
            </el-col>            <el-col :span="3">  
              <el-button type="primary" @click="submitTemp">确认</el-button>  
            </el-col>            <el-col :span="5">  
              <el-radio v-model="radio" value="1" label="1" size="medium" >打开</el-radio>  
              <el-radio v-model="radio" value="2" label="2" size="medium" >关闭</el-radio>  
            </el-col>            <el-col :span="4">  
              <el-button type="primary" @click="submitCompressor">确认</el-button>  
            </el-col>          </el-row>          <br><br><br><br>          <drawer :mode=false ref="switch">  
  
          </drawer>          <div class="drawerS">  
            <el-button  @click="submitDrawer" type="primary" size="big"  class="sbutton" style="font-size: 25px ;font-weight: bold">确认</el-button>  
          </div>        </el-main>      </el-container>    </el-container>  </div></template>  
  
<script>  
import Drawer from "@/views/PerAndCon/component/Drawer.vue";  
import Card2 from "@/views/PerAndCon/component/Card2.vue";  
import Card1 from "@/views/PerAndCon/component/Card1.vue";  
import Card4 from "@/views/PerAndCon/component/Card4.vue";  
import axios from "axios";  
axios.defaults.headers.common['Content-Type'] = 'application/json';  
  
  
export default {  
  // eslint-disable-next-line vue/multi-word-component-names  
  name: 'control',  
  data(){  
    return{  
      input:" ",  
      radio:'1'  
    }  
  },  
  methods: {  
    submitDrawer ()  
    {  
      const data ={  
  
          drawers: [this.$refs.switch.value[0],  
                  this.$refs.switch.value[1],  
                  this.$refs.switch.value[2],  
                  this.$refs.switch.value[3],  
                  this.$refs.switch.value[4],  
                  this.$refs.switch.value[5],  
                  this.$refs.switch.value[6],  
                  this.$refs.switch.value[7],  
                  this.$refs.switch.value[8],  
                  this.$refs.switch.value[9] ]  
      };  
  
      // 发送 PUT 请求给后端  
      //http://localhost:8080/setCompressor http://yapi.smart-xwork.cn/mock/264565/SetDrawer  
      axios.post('http://localhost:8080/setDrawer', data)  
          .then(response => {  
            // 请求成功处理  
            console.log(response.data.message);  
            alert(response.data.message);  
          })  
          .catch(error => {  
            // 请求失败处理  
            console.error(error);  
            alert("error");  
          });  
      alert("请求已发送");  
    },  
    submitCompressor ()  
    {  
      const data ={  
        compressor: this.radio  
  
      };  
  
      //http://localhost:8080/perception http://yapi.smart-xwork.cn/mock/264565/SetCompressor  
      // 发送 PUT 请求给后端  
      axios.post('http://localhost:8080/setCompressor', data)  
          .then(response => {  
            // 请求成功处理  
            console.log(response.data.message);  
            alert(response.data.message);  
          })  
          .catch(error => {  
            // 请求失败处理  
            console.error(error);  
            alert("response.data.message");  
          });  
      alert("请求已发送");  
    },  
    submitTemp ()  
    {  
      const data ={  
        temperature: this.input  
      };  
  
      // 发送 PUT 请求给后端  
      //http://localhost:8080/perception  
      //http://yapi.smart-xwork.cn/mock/264565/SetCompressor      axios.post('http://localhost:8080/setTemp', data)  
          .then(response => {  
            // 请求成功处理  
            console.log(response.data.message);  
  
          })  
          .catch(error => {  
            // 请求失败处理  
            console.error(error);  
          });  
      alert("请求已发送");  
    }  
  
  },  
  mounted() {  
    //发送异步请求  
  },  
  
  components:{  
    Card1,  
    Card2,  
    Card4,  
    Drawer  
  }  
  
}  
  
</script>  
  
<style lang="css" scoped>  
  
  
.text {  
  font-size: 14px;  
}  
  
.item {  
  margin-bottom: 18px;  
}  
  
.clearfix:before,  
.clearfix:after {  
  display: table;  
  content: "";  
}  
.clearfix:after {  
  clear: both  
}  
  
.box-card {  
  width: 350px;  
  height: 200px;  
}  
.drawerS{  
  display: flex;  
  justify-content: center;  
  align-items: center;  
}  
.sbutton{  
  height: 50px;  
  width: 200px;  
}  
  
</style>
```

### 后端SpringBoot
#### 串口

课程设计提供的快递柜为虚拟仿真程序，不是实际的硬件，所以我们需要先创建一对虚拟串口来分配给java后端和快递柜，来进行两者的建立连接。老师给我们提供了虚拟串口驱动程序Configure Virtual Serial Port Driver用于创建虚拟串口来满足实验需要。虚拟串口驱动安装完毕，打开后点击右侧的add按钮即可创建一对虚拟串口COM1和COM2， 根据设计要求，快递柜的系统参数设置为——通信端口COM2，波特率38400，数据位8， 停止位1，校验位None。故java要选择建立基于COM1的通信程序。 我们采用了基于RS232的协议设计与通信方法，所以java后端在进行串口通信前需要 进行环境的配置和相关jar包的导入，即需要将RXTXcomm.jar、rxtxParallel.dll和 rxtxSerial.dll三个文件，按如下图所示步骤放到对应目录下即可完成通信环境的配置，然后用idea创建动态web项目，将RXTXcomm.jar导入工程，就可以进行程序的开发。

为了进行串口通信，需设置读线程和写线程。当后端启动时进行串口连接并启动两个线程，读线程通过循环不断读取接收到的字节流。由于每次读取到的字节数不定需设置readBytes变量记录读到了多少个字节，若读取到了44个字节，14个字节或者判断到接收到“FFF7”则将readBytes置为0，开始读取下一个帧。

写线程不必一直开启，当接收到需要写数据时可以唤醒线程。

##### 读
设置一个静态变量表示读到的帧，方便之后操作，判断帧最后2个字节是否为FFF7，若是则该帧读完，重新开始读一个新的帧。注意要对异常进行捕获。

``` Java
public class SerialReader implements Runnable  
{  
    private InputStream in;  
    public static String read_Frame;  
    public SerialReader(InputStream in )  
    {  
        this.in = in;  
    }  
  
    public void run ()  
    {  
   
        byte[] buffer = new byte[44];  
        int len = buffer.length;  
        int readBytes=0;  
  
        try        {  
            while ( readBytes < len )  
            {  
  
                int read = in.read(buffer, readBytes, len - readBytes);  
                readBytes += read;  
                String s = Tool.bytesToHexString(buffer,readBytes);  
                StringBuilder sb=new StringBuilder(s);  
                System.out.println(read_Frame);  
                if (s.length() >= 4) {  
                    if (readBytes == 44 || sb.substring(s.length() - 4, s.length()).toString().equals("FFF7")) {  
                        if (readBytes == 44){  
                            read_Frame = Tool.bytesToHexString(buffer, len);}  
                        readBytes = 0;  
                    }  
                }  
  
            }  
            readBytes = 0;   
        }  
        catch ( Exception e )  
        {  
            e.printStackTrace();  
        }  
    }  
}
```
##### 写
设置一个静态变量flag，要写数据的时候将flag置为true即可

``` Java
public class SerialWriter implements Runnable {  
    OutputStream out;  
    public static boolean flag = false;  
  
    public SerialWriter(OutputStream out) {  
        this.out = out;  
    }  
  
    public static String frame ;  

    public void run() {  
        try {  
            while (true)  
            {  
                if (flag){  
                    byte[] data = Tool.hexStringToBytes(frame);  
                    this.out.write(data);  
                    flag = false;  
                }  
  
            }  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
    }  
}
```
##### 启动
使用rxtx通信方式，需下载对应jar包或添加依赖。设置串口号，波特率等属性，启动读写线程。

``` Java
 // 在项目启动后执行的操作
        CommPortIdentifier portIdentifier = CommPortIdentifier.getPortIdentifier("COM1");
        CommPort commPort = portIdentifier.open(this.getClass().getName(),2000);
        if ( commPort instanceof SerialPort)
        {
            SerialPort serialPort = (SerialPort) commPort;
            serialPort.setSerialPortParams(38400,SerialPort.DATABITS_8,SerialPort.STOPBITS_1,SerialPort.PARITY_NONE);

            InputStream in = serialPort.getInputStream();
            OutputStream out = serialPort.getOutputStream();
            SerialReader sr = new SerialReader(in);
            Thread read = new Thread(sr);
            SerialWriter sw = new SerialWriter(out);
            Thread writer = new Thread(sw);
            System.out.println("start");
            read.start();
            writer.start();
```
#### 帧

创建不同的类并设置缺省值。

对读取到的帧需进行拆分，对发送帧需进行包装。

##### 帧格式

帧格式（固定部分 10B+数据部分， 帧长为整个数据帧的长度） 。

数据帧大致可以分为四部分。 第一部分是信息头，这部分固定不变为“FFFF”。 第二部分为数据帧载荷，即需要进行crc校验的字段，这部分分为五个字段：帧长、 帧号、设备地址、功能号和数据。

每一类型的帧，其帧长都是固定不变的；帧号为一个 0~255范围内的数字，将其转换成十六进制字符串与前面进行拼接（注意：有两个十六进 制位，不够的话前面要补“0”）。

每一类型帧的功能号也是确定的，可以直接写出来，例如查询帧的功能号为“01”；最后的数据根据帧的类型来进行 设置，如查询帧，没有数据位，则可以设置为“”。 第三部分为校验位，通过数据帧载荷来生成。 

第四部分为结束标志，同样是确定的，可以直接写出，为“FFF7”。 这四部分全部设置成功后，进行字符串的拼接就完成了控制帧的封装。最后将封装好的十六进制字符串转换为字节数组写入串口输出流即可完成控制帧的发送。

![](./frameStruct.png)

``` Java
public class FrameStruct {  
    public static String header = "ffff";  
    public static String end = "fff7";  
    public String Frame_Len;  
    public String Frame_Num;  
    public String Device_Addr;  
    public String Func_Num;  
    public String Data;  
    public String Check = "0000";  
    public String CRC_Func(){  
        return "ffff";  
    }  
  
    public FrameStruct(){  
  
    }  
  
    public  String encapsulate(){  
  
        StringBuilder sb = new StringBuilder();  
        sb.append(this.header).append(this.Frame_Len).append(Frame_Num).append(this.Device_Addr);  
        sb.append(this.Func_Num).append(this.Data).append(this.Check).append(this.end);  
  
        return sb.toString();  
    }  
  
}
```
##### 上传状态帧

![](./statusFrame.png)

``` Java
public class StatusFrame extends FrameStruct{  
    public data getFrame_Data(){  
        System.out.println(this.Data);  
        data d = new data();  
        //StringBuilder sb = new StringBuilder(this.Data);  
        d.setCompressor(handleCompressor());  
        d.setDrawer(handleDrawer());  
        d.setTemp(handleTemp(54,56));  
        d.setSetting_temp(handleTemp(52,54));  
        if (data.temp_array.length < 20){  
            data.temp_array[data.temp_array.length-1]=d.getTemp();  
        }else {  
            for (int i = 0 ; i<19 ; i ++){  
                data.temp_array[i] = data.temp_array[i+1];  
            }  
            data.temp_array[19] = d.getTemp();  
        }  
        if (data.setting_array.length<20){  
            data.setting_array[data.setting_array.length-1]=d.getSetting_temp();  
        }else {  
            for (int i = 0 ; i<19 ; i ++){  
                data.setting_array[i] = data.setting_array[i+1];  
            }  
            data.setting_array[19] = d.getSetting_temp();  
        }  
        return d;  
    }  
    public sysPara handleSys(){  
        StringBuilder sb = new StringBuilder(this.Data);  
        sysPara sp = new sysPara();  
        String s = sb.substring(22,24);  
        s = Tool.hexTOdec(s);  
        sp.setDev_Addr(s);  
        s = sb.substring(28,30);  
        s = Tool.hexTOdec(s);  
        sp.setDev_Addr(s);  
        s = sb.substring(36,38);  
        s = Tool.hexTOdec(s);  
        sp.setDev_Addr(s);  
  
      return sp;  
  
    }  
    public String handleCompressor(){  
        String s = this.Data;  
        StringBuilder sb = new StringBuilder(s);  
        s = sb.substring(50,52);  
        switch (s) {  
            case "00":  
                return "停止";  
            case "01":  
                return "预启动";  
            case "02":  
                return "启动";  
            default:  
                return "故障";  
        }  
    }  
  
  
    public float handleTemp(int a,int b){  
        String s = this.Data;  
        StringBuilder sb2 = new StringBuilder(s);  
        s = sb2.substring(a,b);  
        float temp = 0f;     
        s = Tool.hexString2binaryString(s,8);  
        StringBuilder sb = new StringBuilder(s);  
        String item;  
        item = sb.substring(0,1);  
        if (item.equals("1")){  
            temp+= 0.5f;  
        }  
        for (int i = 1; i < 7; i++) {  
            item = sb.substring(i,i+1);  
            if (item.equals("1")){  
                temp+=1*pow(2,6-i);  
            }  
  
        }  
        item = sb.substring(7,8);  
        if (item.equals("1")){  
            temp=-temp;  
        }  
        return temp;  
    }  
  
    public boolean[] handleDrawer(){  
        String s = this.Data;  
        StringBuilder sb2 = new StringBuilder(s);  
        s = sb2.substring(60,64);  
        s = Tool.hexString2binaryString(s,16);  
        StringBuilder sb = new StringBuilder(s);  
        boolean[] drawer = new boolean[10];  
        for (int i = 0; i < 7; i++) {  
            drawer[7-i] = sb.substring(i, i + 1).equals("1");  
        }  
        drawer[9] = sb.substring(15, 16).equals("1");  
        drawer[8] = sb.substring(14, 15).equals("1");  
        return drawer;  
    }  
  
  
    public void decapsulate(String frame){  
  
        StringBuilder sb = new StringBuilder(frame);  
        header = sb.substring(0,4);  
        Frame_Len = sb.substring(4,6);  
        Frame_Num = sb.substring(6,8);  
        Device_Addr = sb.substring(8,10);  
        Func_Num = sb.substring(10,12);  
        Data = sb.substring(12,frame.length()-8);  
        Check = sb.substring(frame.length()-8,frame.length()-4);  
        end = sb.substring(frame.length()-4,frame.length());  
  
  
    }  
  
    public static void main(String[] args) {  
        StatusFrame sf = new StatusFrame();  
        //sf = sf.decapsulate(f);  
        System.out.println(sf.Data);  
        data d = new data();  
        d= sf.getFrame_Data();  
        System.out.println(d.getCompressor());  
    }  
}
```
##### 设置参数帧
![](./sysPara.png)

``` Java
public class SetSysParaFrame extends FrameStruct{  
    public SetSysParaFrame (sysPara sys){  
        this.Frame_Len    = "1C";  
        this.Func_Num     = "05";  
        this.Check        = "0000";  
        this.Frame_Num    = "01";  
        this.Device_Addr  = "00";  
        this.Data         = sys(sys);  
  
    }  
  
    private String sys(sysPara s){  
        StringBuilder sb = new StringBuilder();  
        sb.append("FFFFFFFFFF");  
        sb.append(s.getDev_Addr());  
        sb.append("0001");  
        sb.append(s.getDelay());  
        sb.append("0000");  
        sb.append("04");  
        sb.append(s.getTemp_deviation());  
        sb.append("FFFFFFFF00");  
        return sb.toString();  
    }  
}
```
##### 设置温度帧
``` Java
public class SetTempFrame extends FrameStruct{  
    public SetTempFrame (float set_temp){  
        this.Frame_Len    =  "0B"  ;  
        this.Func_Num     =  "04"  ;  
        this.Check        =  "0000";  
        this.Frame_Num    =  "10"  ;  
        this.Device_Addr  =  "01"  ;  
        this.Data         =  setTemp(set_temp)  ;  
  
    }  
    private String setTemp(float f){  
        StringBuilder sb = new StringBuilder();  
        int   a  = (int) f;  
        float b  = f-(float) a;  
        if ( Math.abs(b) < 0.5){  
            sb.append("0");  
        }else {  
            sb.append("1");  
        }  
        String s = Tool.decTObin(Integer.toString(Math.abs(a)));  
        if (s.length() < 6){  
            for (int i = 0; i < 6 - s.length(); i++) {  
                sb.append("0");  
            }  
        }  
        sb.append(s);  
        if (f < 0){  
            sb.append("1");  
        }else {  
            sb.append("0");  
        }  
        return Tool.bin2hex(sb.toString());  
    }  
}
```
##### 设置抽屉帧
``` Java
public class DrawerConFrame extends FrameStruct{  
    public DrawerConFrame (boolean[] drawer){  
        this.Frame_Len    = "0C";  
        this.Func_Num     = "03";  
        this.Check        = "0000";  
        this.Frame_Num    = "03";  
        this.Device_Addr  = "00";  
        this.Data         = fit(drawer);  
  
    }  
    private String fit(boolean[] b){  
        boolean[] booleans = enlarge(b);  
        StringBuilder sb = new StringBuilder();  
        for (int i = 0 ; i< 16; i++){  
            if (booleans[i]){  
                sb.append("1");  
            }else{  
                sb.append("0");  
            }  
        }  
        System.out.println(sb.toString());  
        String S = Tool.bin2hex(sb.toString());  
        return S;  
    }  
  
    private boolean[] enlarge(boolean[] booleans){  
        boolean[] b = new  boolean[16];  
        for (int i = 0; i < 8; i++){  
            b[7-i] = booleans[i];  
        }  
        b[15] = booleans[9];  
        b[14] = booleans[8];  
        return b;  
    }  
}
```
##### 设置压缩器帧
``` Java
public class CompressorConFrame extends FrameStruct{  
    public CompressorConFrame(boolean b){  
        this.Frame_Len   = "0B";  
        this.Func_Num    = "02";  
        //this.Check     = CRC_Func();  
        this.Check       = "0000";  
        this.Frame_Num   = "04";  
        this.Device_Addr = "00";  
        if (b){  
            this.Data    = "01";  
        }else {  
            this.Data    = "00";  
        }  
    }  
  
}
```

#### Controller
##### PerController
前端对/perception，/GetSysPara的请求由PerController接收

``` Java
public class PerController {  
    @Autowired  
    private PerService perService;    
    @CrossOrigin  
    @RequestMapping("/perception")  
    public result all(){  
        log.info("获取全部数据");  
        result r = new result();  
        r.setting_temp = data.setting_array;  
        r.temp = data.temp_array;   
        r.message = "success";  
        return r;  
    }  
    @CrossOrigin  
    @RequestMapping("/GetSysPara")  
    public result sysPara(){  
        log.info("compressor");  
        result r = new result();  
        r.value = perService.sysHandle();  
        r.message = "success";  
        r.code = 1;  
        return r;  
    }  
}
```
##### ConController
前端发送的post请求由ConController处理

``` Java
public class ConController {  
    @Autowired  
    private ConService conService;  
  
    @CrossOrigin  
    @RequestMapping ("/setCompressor")  
    public result setCompressor(@RequestBody compressor compre){  
  
        if (compre.getCompressor().equals("1"))  
            conService.sendCompressor(true);  
        else if (compre.getCompressor().equals("2")) {  
            conService.sendCompressor(false);  
        }  
        result r2 =  new result();  
        r2.code   =  1;  
        r2.message  =  "success";  
        return r2;  
    }  
    @CrossOrigin  
    @RequestMapping("/setDrawer")  
    public result SetDrawer(@RequestBody drawer d){  
        boolean[] drawer = d.getDrawers();  
        conService.sendDrawer(drawer);  
        result r =  new result();  
        r.code   =  1;  
        r.message  =  "success";  
        return r;  
    }  
  
    @CrossOrigin  
    @RequestMapping("/setTemp")  
    public result setTemp(@RequestBody temp t){   
        conService.sendTemp(t.getTemperature());  
        result r =  new result();  
        r.code   =  1;  
        r.message  =  "success";  
        return r;  
    }  
    @CrossOrigin  
    @RequestMapping ("/setSysPara")  
    public result SetPara(@RequestBody sysPara sp){   
        conService.sendPara(sp);  
        result r =  new result();  
        r.code   =  1;  
        r.message  =  "success";  
        return r;  
    }  
}
```
#### Service
对数据进行处理，准备好返回给前端的数据或者向串口发送的数据

##### PerService

``` Java
public class PerService {  
    @Autowired  
    private PerDao perDao ;  
    public result test(){  
        result r = perDao.test();  
        r.code = 2;  
        return r;  
  
    }  
  
    public sysPara sysHandle(){  
        StatusFrame statusFrame = perDao.getStatusFrame();  
        sysPara sp = statusFrame.handleSys();  
        return sp;  
    }  
    public data dataHandle(){  
        String frame = perDao.getFrame();  
        StatusFrame statusFrame = new StatusFrame();  
        statusFrame.decapsulate(frame);  
        return statusFrame.getFrame_Data();  
    }  
  
    public String compressorHandle(){  
        StatusFrame statusFrame = perDao.getStatusFrame();  
        //String s = statusFrame.handleCompressor();  
        return statusFrame.handleCompressor();  
    }  
    public Float tempHandle(){  
        StatusFrame statusFrame = perDao.getStatusFrame();  
        //Float a = statusFrame.handleTemp();  
        return statusFrame.handleTemp(54,56);  
    }  
  
    public Float SettingTemp_Handle(){  
        StatusFrame statusFrame = perDao.getStatusFrame();  
        //Float a = statusFrame.handle_SettingTemp();  
        return statusFrame.handleTemp(56,58);  
    }  
  
    public boolean[] drawerHandle(){  
        StatusFrame statusFrame = perDao.getStatusFrame();  
        return statusFrame.handleDrawer();  
    }  
    @Scheduled(fixedRate = 2500) // 每2.5秒执行一次  
    public data scheduleUpdate() {   
        data d = dataHandle();  
        return d;  
    }  
}
```
##### ConService
``` Java
public class ConService {  
    public void sendCompressor(boolean b){  
        CompressorConFrame compressorConFrame = new CompressorConFrame(b);  
        SerialWriter.frame = compressorConFrame.encapsulate();  
        SerialWriter.flag = true;  
    }  
    public void sendDrawer(boolean[] b){  
        DrawerConFrame drawerConFrame = new DrawerConFrame(b);  
        SerialWriter.frame = drawerConFrame.encapsulate();  
        SerialWriter.flag = true;  
    }  
    public void sendPara(sysPara sp){  
        SetSysParaFrame sysParaFrame = new SetSysParaFrame(sp);  
        SerialWriter.frame = sysParaFrame.encapsulate();  
        SerialWriter.flag = true;  
    }  
    public void sendTemp(String s){  
        float a = Float.valueOf(s);  
        SetTempFrame tempFrame = new SetTempFrame(a);  
        SerialWriter.frame = tempFrame.encapsulate();  
        SerialWriter.flag = true;  
    }  
}
```
#### Dao
获取帧返回给Service

##### PerDao

``` Java
public class PerDao {  
    data d ;  
  
    public String getFrame(){  
        try  
        { 
            return SerialReader.read_Frame;  
        }  
        catch ( Exception e )  
        {  
            e.printStackTrace();  
        }  
  
        return "d";  
    }  
  
    public StatusFrame getStatusFrame(){  
        try  
        {
            StatusFrame statusFrame = new StatusFrame();  
            statusFrame.decapsulate(SerialReader.read_Frame);  
            return statusFrame;  
        }  
        catch ( Exception e )  
        {  
            e.printStackTrace();  
        }  
  
        return new StatusFrame();  
    }  
  
}
```

### 运行结果及分析

#### 设计页面展示

> 将页面分为了三个部分，分别为header，aside，main。Header用于展示标题，aside作为导航栏，main部分用于数据展示。在感知页面不能进行控制操作，按钮被禁用。

![](./result/1.png)

> 在控制页面修改后感知页面和控制板都发生相应变化

![](./result/2.png)

![](./result/3.png)

#### 系统参数设置 

> 在控制页面输入相应数据后点击确认按钮即可对快递柜进行控制。

![](./result/4.png)

> 修改系统参数后控制板系统参数发生相应变化。

![](./result/5.png)

![](./result/6.png)

### 感想

在本次课设中，我们的目标是设计和实现一个现场快递柜状态采集与控制系统。通过理解现场网感知与控制的基本方法，并掌握基于RS232协议的设计与通信方法，我们成功地完成了该系统的开发。

我们的系统主要包括以下功能：快递柜状态数据的采集与显示，参数设置，抽屉打开和保鲜控制。为了实现这些功能，我们采用了后端与快递柜控制板之间的串口通信，并设计了相应的控制帧格式进行数据的传输。

在实验设计中，我们首先建立了后端与快递柜控制板的串口连接。通过配置环境和导入相应的jar包，我们实现了与控制板的数据交互。后端通过读线程不断监听串口的输入流，解析接收到的数据帧，并对垃圾数据进行拦截和错误数据的过滤。同时，我们也实现了写线程，可以根据前端发送的控制指令，将相应的控制帧发送给控制板。

前端部分我们采用了Vue框架进行开发，通过axios库实现与后端的异步数据交互。我们将页面拆分为多个组件，并使用Element组件库进行页面的展示和交互。通过轮询方式，前端定时发送get请求获取实时状态信息，并将数据展示在页面上。此外，用户还可以通过输入和点击完成对控制温度、设备地址等系统参数的配置，以及对抽屉和压缩机状态的控制。

在课设过程中，我们遇到了一些挑战，特别是在实现控制帧的封装和发送、以及前后端数据的交互方面。为了克服这些挑战，我们需要深入理解控制帧的格式和串口通信的原理，同时对数据的格式和类型进行严格的校验和处理。此外，我们还需要确保前后端数据的一致性和正确性，包括正确封装数据为JSON格式并进行传输，以及正确解析和处理后端返回的数据。

在课设之前我用Java写网页还是用的jsp，操作相当繁琐，前后端不分离，一旦出现错误往往要前后端一起修改。通过这次课设我接触到了spring和vue两个框架，他们不仅已经为我提供好整体的框架并且前后端分离，更符合现在企业需求，为我以后的就业提供了良好基础。

通过这次课设，我们不仅学到了现场网感知与控制的基本方法和基于RS232协议的通信设计，还锻炼了团队合作和问题解决的能力。我们通过分工合作，充分发挥每个成员的优势，顺利完成了系统的设计与实现。