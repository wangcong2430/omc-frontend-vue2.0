// 引入highcharts
import Vue from 'vue'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'

// Highcharts主题
Highcharts.theme = {
  colors: ['#068dfe', '#6b5aed', '#54d575', '#ffab00', '#559bfa', '#b37f00', '#fc5a58', '#0097a7', '#e091be', '#7795f8', '#f33155', '#68d4f8', '#a77d74'],
  chart: {
    backgroundColor: null,
    style: {
      overflow: 'visible',
      fontFamily: 'Microsoft Yahei, Arial, sans-serif'
    }
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  xAxis: {
    gridLineColor: '#e9eaf0',
    gridLineWidth: 1,
    gridLineDashStyle: 'longDash',
    tickLength: 2,
    lineColor: '#d5d8e3',
    labels: {
      style: {
        color: '#6a6f85'
      }
    }
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: '#e9eaf0',
    gridLineDashStyle: 'longDash',
    lineColor: '#d5d8e3',
    lineWidth: 1,
    title: {
      text: ''
    }
  },
  lang: {
    thousandsSep: ','
  }
}
// 应用自定义主题
Highcharts.setOptions(Highcharts.theme)

Vue.use(HighchartsVue)
