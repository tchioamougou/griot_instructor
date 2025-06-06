<template>
  <div id="chartdiv1"></div>
</template>

<script setup lang="ts">
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import {onMounted, watch} from "vue";
const props = defineProps({
  gdata:{
    required:true,
    type:Array
  }
})
const initChart = () => {
  am5.ready(function() {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new("chartdiv1");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout
        })
    );

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
        "scrollbarX",
        am5.Scrollbar.new(root, {
          orientation: "horizontal"
        })
    );

    const data = props.gdata;
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const xRenderer = am5xy.AxisRendererX.new(root, {});
    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "month",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
        })
    );
    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          extraMax: 0.1,
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
          })
        })
    );


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

    const series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Earm",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "totalValue",
          categoryXField: "month",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY} {info}"
          })
        })
    );

    series1.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: "columnSettings"
    });

    series1.data.setAll(data);

    const series2 = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Refund",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "netEarnings",
          categoryXField: "month",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY} {info}"
          })
        })
    );

    series2.strokes.template.setAll({
      strokeWidth: 3,
      templateField: "strokeSettings"
    });


    series2.data.setAll(data);

    series2.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          strokeWidth: 3,
          stroke: series2.get("stroke"),
          radius: 5,
          fill: root.interfaceColors.get("background")
        })
      });
    });
/** this section is used to set series three tax --started*/
const series3 = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Tax",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "withholdingTax",
      categoryXField: "month",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{name} in {categoryX}: {valueY} {info}"
      })
    })
);

    series3.strokes.template.setAll({
      strokeWidth: 3,
      templateField: "strokeSettings"
    });


    series3.data.setAll(data);

    series3.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          strokeWidth: 1,
          stroke: series3.get("stroke"),
          radius: 5,
          fill: root.interfaceColors.get("background")
        })
      });
    });
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
    );
    legend.data.setAll(chart.series.values);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    series1.appear();


  }); // end am5.ready()
};

onMounted(()=>{
  initChart();
});
watch(()=>props.gdata,(value)=>{
  initChart();
})
</script>

<style scoped>
#chartdiv1 {
  width: 100%;
  min-height: 300px !important;
}
</style>