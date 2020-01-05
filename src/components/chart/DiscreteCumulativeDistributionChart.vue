<script>
// It is custom chart type
// How to create custom chart type you can find here
// https://vue-chartjs.org/guide/#custom-new-charts
// https://www.chartjs.org/docs/latest/developers/charts.html

import Chart from 'chart.js';

import { generateChart, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

Chart.defaults.DiscreteCumulativeDistribution = Chart.defaults.line;
Chart.controllers.DiscreteCumulativeDistribution = Chart.controllers.line.extend({
  draw(ease) {
    Chart.controllers.line.prototype.draw.call(this, ease);

    const meta = this.getMeta();
    const { ctx } = this.chart.chart;
    // draw solid horizontal lines to overlap dashed lines
    ctx.save();
    for (let i = 0; i < meta.data.length - 1; i += 1) {
      ctx.beginPath();
      /* eslint no-underscore-dangle: ["error", { "allow": ["_view"] }] */
      ctx.moveTo(meta.data[i]._view.x, meta.data[i]._view.y);
      ctx.lineTo(meta.data[i + 1]._view.x, meta.data[i]._view.y);
      ctx.stroke();
    }
    ctx.restore();
  },
});

const CustomLine = generateChart('discrete-cumulative-distribution', 'DiscreteCumulativeDistribution');

export default {
  extends: CustomLine,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        legend: {
          labels: {
            /**
             * @param legendItem
             * @param data
             */
            filter(legendItem) {
              // by default labels inherit style from datasets property
              // remove dashed border from legend labels
              const noDashLegendItem = legendItem;
              noDashLegendItem.lineDash = [0];
              return noDashLegendItem;
            },
          },
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
              stepSize: 0.1,
              max: 1.1,
            },
          }],
          xAxes: [{
            ticks: {
              fontSize: 18,
            },
            offset: true,
          }],
        },
        tooltips: {
          callbacks: {
            /**
             * @param tooltipItems
             * @param data
             */
            title(tooltipItems) {
              const [{ xLabel }] = tooltipItems;
              return `x > ${xLabel}`;
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
