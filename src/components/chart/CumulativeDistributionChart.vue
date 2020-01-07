<script>

import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        legend: {
          /**
           * @param event
           * @param legendItem
           */
          onClick(e) {
            e.stopPropagation();
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 1.1,
              stepSize: 0.1,
            },
          }],
          xAxes: [{
            offset: true,
            type: 'linear',
            ticks: {
              fontSize: 18,
              callback(value, index, values) {
                // change first and last xAxes labels
                if (index === 0) {
                  return '-Infinity';
                } if (index === values.length - 1) {
                  return ' +Infinity';
                }
                return value;
              },
            },
          }],
        },
        tooltips: {
          callbacks: {
            title(tooltipItems, data) {
              // change first and last tooltip title
              const [{ index, xLabel }] = tooltipItems;
              const lastIndex = data.datasets[0].data.length - 1;
              if (index === 0) {
                return '-Infinity';
              } if (index === lastIndex) {
                return '+Infinity';
              }
              return xLabel;
            },
          },
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};

</script>
