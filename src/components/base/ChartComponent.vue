<template>
  <div ref="chartRef" class="chart-container" :style="{ height: height, width: width }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
// 按需加载ECharts，减少初始加载时间
let echarts: any = null
let chartInstance: any = null

interface Props {
  type: 'line' | 'bar' | 'pie' | 'map' | 'radar' | 'scatter'
  data: any[]
  height?: string
  width?: string
  options?: echarts.EChartsOption
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  width: '100%',
  options: () => ({})
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 计算图表配置
const chartOptions = computed(() => {
  const baseOptions: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    ...props.options
  }

  switch (props.type) {
    case 'line':
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: props.data.map(item => item.name),
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数值',
            type: 'line',
            data: props.data.map(item => item.value),
            smooth: true,
            lineStyle: {
              width: 3
            },
            itemStyle: {
              borderRadius: 4,
              borderWidth: 2
            }
          }
        ]
      }

    case 'bar':
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: props.data.map(item => item.name),
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数值',
            type: 'bar',
            data: props.data.map(item => item.value),
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
          }
        ]
      }

    case 'pie':
      return {
        ...baseOptions,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '60%',
            data: props.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

    case 'map':
      return {
        ...baseOptions,
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: Math.max(...props.data.map(item => item.value)),
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true
        },
        series: [
          {
            name: '数值',
            type: 'map',
            map: 'china',
            data: props.data,
            roam: true
          }
        ]
      }

    default:
      return baseOptions
  }
})

// 初始化图表
const initChart = async () => {
  if (chartRef.value) {
    // 动态导入ECharts，减少初始加载时间
    if (!echarts) {
      const echartsModule = await import('echarts')
      echarts = echartsModule.default || echartsModule
    }
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(chartOptions.value)
  }
}

// 响应式更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(chartOptions.value)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 生命周期钩子
onMounted(async () => {
  await initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})

// 监听数据变化
watch(
  () => [props.data, props.options],
  async () => {
    if (!chartInstance) {
      await initChart()
    } else {
      updateChart()
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.chart-container {
  min-height: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
