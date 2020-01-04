<script>

import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          }],
          xAxes: [{
            ticks: {
              fontSize: 18,
            },
            offset: true,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: 'nearest',
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};

</script>
