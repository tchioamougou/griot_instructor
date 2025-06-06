<template>
  <canvas :id="id" height="100"></canvas>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "GChart",
  data: function () {
    return {
      columns: [
        {
          name: "Time Period",
          value: "time_period",
          isLink: true,
        },
        {
          name: "Pre-tax Amount",
          value: "pre_tax_amount",
          isCurrency: true,
          currency: {
            symbol: "$",
          },
          isText: true,
        },
        {
          name: "Withholding Tax",
          value: "withholding_tax",
          isCurrency: true,
          currency: {
            symbol: "$",
          },
          isText: true,
        },
        {
          name: "Net Earnings",
          value: "net_earnings",
          isCurrency: true,
          currency: {
            symbol: "$",
          },
          isText: true,
        },
        {
          name: "Expected Payment Date",
          value: "expected_payment_date",
          isText: true,
        },
      ],
      records: [
        {
          time_period: "Mars 2023",
          pre_tax_amount: "30000",
          withholding_tax: "4000",
          net_earnings: "26000",
          expected_payment_date: "28/10/2023",
        },
        {
          time_period: "Mars 2023",
          pre_tax_amount: "30000",
          withholding_tax: "4000",
          net_earnings: "26000",
          expected_payment_date: "28/10/2023",
        },
        {
          time_period: "Mars 2023",
          pre_tax_amount: "30000",
          withholding_tax: "4000",
          net_earnings: "26000",
          expected_payment_date: "28/10/2023",
        },
        {
          time_period: "Mars 2023",
          pre_tax_amount: "30000",
          withholding_tax: "4000",
          net_earnings: "26000",
          expected_payment_date: "28/10/2023",
        },
      ],
    };
  },
  props:{
    id:{
      type: String,
      default:"myChart"
    },
  },

  mounted() {
    let ctx = document.getElementById(this.id);
    // For example:
    const labels =  ['January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December']
    const data = {
      labels: labels,
      datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        label:'',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(100, 100, 100)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };
    const config = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };
    const myLineChart = new Chart(ctx, config);

  }
}
</script>

<style scoped>

</style>