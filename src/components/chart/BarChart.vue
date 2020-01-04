<script>

import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        scales: {
          xAxes: [{
            ticks: {
              fontSize: 20,
            },
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 0.2,
            },
          }],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};

</script>
