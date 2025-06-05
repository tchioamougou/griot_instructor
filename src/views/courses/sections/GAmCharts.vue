<template>
  <div id="chartdiv"></div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
export default {
  name: "GAmCharts",
  methods:{
    init(){
      const self = this;
      am5.ready(function() {

// Create root element
        var root = am5.Root.new("chartdiv");

// Set themes
        root.setThemes([
          am5themes_Animated.new(root)
        ]);

// Create chart
// start and end angle must be set both for chart and series
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
          startAngle: 180,
          endAngle: 360,
          layout: root.verticalLayout,
          innerRadius: am5.percent(50)
        }));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
        var series = chart.series.push(am5percent.PieSeries.new(root, {
          startAngle: 180,
          endAngle: 360,
          valueField: "value",
          categoryField: "category",
          alignLabels: false,
          colorField: "color"
        }));

        series.states.create("hidden", {
          startAngle: 180,
          endAngle: 180
        });

        series.slices.template.setAll({
          cornerRadius: 0
        });

        series.ticks.template.setAll({
          forceHidden: true
        });
        series.labels.template.setAll({fontSize: 12,
          text: "{category}",
          textType: "radial",
          inside: true,
          radius: 10,
          centerX: am5.percent(100),
          fill: am5.color(0xffffff)})

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll([
          { value: self.correct, category: "Correct" ,color:"#babf95"},
          { value: self.failed, category: "wrong" ,fill:"#babf95"},
          { value: self.skip, category: "Skip" ,fill:"#babf95"}
        ]);

        var legend = chart.children.push(am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          layout: root.horizontalLayout
        }));

        legend.data.setAll(series.dataItems);



        series.appear(1000, 100);

      }); // end am5.ready()
    }
  },
  mounted() {
    this.init();
  },
  props:{
    correct: {
      type:Number,
      required:true
    },
    failed: {
      type:Number,
      required:true
    },
    skip: {
      type:Number,
      required:true
    },
  },
  data:function(){
    return {

    }
  }
}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 250px;
}
</style>
