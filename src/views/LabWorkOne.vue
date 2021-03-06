<template lang="html">
<div>
  <h2>Введіть обсяг вибірки</h2>
  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model.number="inputsCount"
        label="Обсяг вибірки"
        type="number" min="1"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="8">
      <v-btn
        rounded color="indigo" class="mx-2 white--text"
        @click="createInputs()"
      >
        Старт
      </v-btn>
      <template v-if="showControls">
        <v-btn
          rounded color="indigo" class="mx-2 white--text"
          :disabled="!isDataValid"
          @click="makeCalculation()"
        >
          Виконати
        </v-btn>
        <v-btn
          fab small color="indigo" class="mx-2 white--text"
          @click="addInput()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab small color="indigo" class="mx-2 white--text"
          :disabled="inputsCount < 1"
          @click="deleteInput()"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
    </v-col>
  </v-row>
  <v-row>
    <template v-for="(item, index) in inputData">
      <v-col cols="3" sm="2" :key="index">
        <v-text-field
          :rules="[validData[index] || 'Заповніть поле']"
          @change="saveValue(index, $event)"
          :label="`${index + 1})`"
          :value="item"
          type="number"
        >
        </v-text-field>
      </v-col>
    </template>
  </v-row>
  <div v-if="isDataValid && showResult">
    <h2>Дискретний статистичний ряд частот та вiдносних частот</h2>
    <v-row>
      <v-col cols="12">
        <div class="frequency-table">
          <table class="table">
            <caption>Табл. #1</caption>
            <tr>
              <th>x<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.frequencySorted"
                  :key="ind">{{value}}</td>
              <th>Сума</th>
            </tr>
            <tr>
              <th>n<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.appropriateValues"
                  :key="ind">{{value}}</td>
              <th>{{numbersAmount}}</th>
            </tr>
            <tr>
              <th>w<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.appropriateValues"
                  :key="ind">{{+(value / numbersAmount).toFixed(4)}}</td>
              <th>{{relativeFrequencySum}}</th>
            </tr>
          </table>
        </div>
      </v-col>
    </v-row>
    <h2>Розмах вибірки</h2>
    <v-row>
      <v-col cols="12">
        <p>Розмах вибірки: r = {{range.rangeStr}}</p>
      </v-col>
    </v-row>
    <h2>Мода</h2>
    <v-row>
      <v-col cols="12">
        <p v-for="(value, ind) in modalValues" :key="ind">
          Мода ряду: М<sub>0</sub>(x) = {{value.number}},
          оскiльки цьому значенню вiдповiдає найбiльша частота {{value.numberFreq}}
        </p>
        <p v-if="modalValues.length > 1">
          Такий статистичний ряд є мультимодальний
        </p>
        <p v-else>
          Такий статистичний ряд є одномодальний
        </p>
      </v-col>
    </v-row>
    <h2>Медіана</h2>
    <v-row>
      <v-col cols="12">
        <p>
          Медіана ряду: М<sub>e</sub>(x) = {{medianValue}}
        </p>
      </v-col>
    </v-row>
    <h2>Поліном частот зображений на рис.</h2>
    <v-row>
      <v-col cols="12" sm="10" md="7">
          <frequency-chart :chart-data="frequencyDataCollection"></frequency-chart>
      </v-col>
    </v-row>
    <h2>Iнтервальний статистичний ряд</h2>
    <v-row>
      <v-col cols="12">
        <p>
          Для визначення оптимальної кiлькостi <b><i>S</i></b> промiжкiв,
          за якої iнтервальний статистичний ряд не буде занадто громiздким,
          зберiгаючи при цьому особливостi генеральної сукупностi,
          за <b><i>S</i></b> виберемо цiле число, близьке до <b>1 + 3.2 lg(<i>n</i>)</b>,
          <br>де <i>n</i> — обсяг вибірки
        </p>
        <p><b><i>S</i> &#8776; {{frequencyIntervals.length}}</b></p>
        <div class="range-table">
          <table class="table">
            <caption>Табл. #2</caption>
            <tr>
              <th>&#916;<sub>j</sub></th>
              <td v-for="(value, index) in frequencyIntervals"
                  :key="`range-key-${index}`">{{value['rangeStr']}}</td>
            </tr>
            <tr>
              <th>n<sub>j</sub></th>
              <td v-for="(value, index) in frequencyIntervals"
                  :key="`range-freq-key-${index}`">{{value['rangeFreq']}}</td>
            </tr>
          </table>
        </div>
      </v-col>
    </v-row>
    <h2>Гістограми частот зображені на рис.</h2>
    <v-row>
      <v-col cols="12" sm="10" md="7">
        <p>Загальна площа гістограми "щільність частоти" дорівнює обсягові вибірки</p>
        <p>Загальна площа гістограми "відносна частота" дорівнює одиниці</p>
        <frequency-bar :chart-data="frequencyIntervalsDataCollection"></frequency-bar>
      </v-col>
    </v-row>
    <h2>Модальний інтервал</h2>
    <v-row>
      <v-col cols="12">
        <p v-for="(interval, index) in modalIntervals" :key="index">
          Модальним iнтервалом для iнтервального статистичного ряду є {{interval.interval}},
          оскiльки йому вiдповiдає найбiльша щiльнiсть частоти {{interval.freq}}
        </p>
        <p v-if="modalIntervals.length > 1">
          Такий інтервальний статистичний ряд є мультимодальний
        </p>
        <p v-else>
          Такий інтервальний статистичний ряд є одномодальний
        </p>
      </v-col>
    </v-row>
    <h2>Медіана інтервального ряду</h2>
    <v-row>
      <v-col cols="12">
        <p>
          Для визначення медiани для iнтервального статистичного ряду встановимо медiанний iнтервал,
          тобто той частинний iнтервал [ Z<sub>M-1</sub>; Z<sub>M</sub> ),
          лiворуч i праворуч вiд якого знаходиться не бiльше нiж половина елементiв вибiрки,
          враховуючи їх частоти.
        </p>
        <p>
          За медiану можна наближено взяти середину медiанного iнтервалу.
          Положення медiани можна уточнити, якщо:
          <br>[ Z<sub>M-1</sub>; Z<sub>M</sub> ) — медіанний інтервал,
          <br>n<sub>M</sub> — частота, що йому вiдповiдає,
          <br>m<sub>M-1</sub> — накопичена частота попередніх iнтервалів,
          <br>n — обсяг вибірки, то медіану розраховують за наступною формулою
        </p>
        <mathjax-median-formula></mathjax-median-formula>
        <ul>
          <li>{{medianInterval.interval.rangeStr}} — медіанний інтервал</li>
          <li>n<sub>M</sub> = {{medianInterval.interval.rangeFreq}}</li>
          <li>m<sub>M-1</sub> = {{medianIntervalValue.accumulateLeftSum}}</li>
          <li>n = {{numbersAmount}}</li>
        </ul>
        <mathjax-median-formula
          :hasBorder="false"
          :a="medianIntervalValue.rangeStart"
          :b="medianIntervalValue.rangeEnd"
          :c="medianIntervalValue.rangeFreq"
          :d="numbersAmount"
          :f="medianIntervalValue.accumulateLeftSum"
          :g="medianIntervalValue.medianValue"
        ></mathjax-median-formula>
      </v-col>
    </v-row>
    <h2>Емпiрична функцiя розподiлу для дискретного ряду</h2>
    <v-row>
      <v-col cols="12" sm="10" md="7">
          <discrete-cumulative-distribution-chart
            :chart-data="discreteCumulativeDataCollection"
          ></discrete-cumulative-distribution-chart>
      </v-col>
    </v-row>
    <h2>Емпiрична функцiя розподiлу для інтервального ряду</h2>
    <v-row>
      <v-col cols="12" sm="10" md="7">
        <cumulative-distribution-chart
          :chart-data="сumulativeDataCollection"
        ></cumulative-distribution-chart>
      </v-col>
    </v-row>
    <h2>Вибiркове середнє значення</h2>
    <v-row>
      <v-col cols="12">
        <p>
          Вибiрковим середнiм значенням <vue-mathjax :formula="'$ \\bar{x}_B $'"></vue-mathjax>
          дискретного статистичного ряду називають середнє арифметичне
          варiант <b>х<sub>і</sub></b> iз врахуванням їх частот.
        </p>
        <mathjax-sample-mean-formula></mathjax-sample-mean-formula>
        <mathjax-sample-mean-formula
          :hasBorder="false"
          :a="numbersAmount"
          :b="sampleMean.accumulateStr"
          :c="sampleMean.value"
        ></mathjax-sample-mean-formula>
        <p>
          Для знаходження вибiркового середнього значення
          <vue-mathjax :formula="'$ \\bar{x}_B $'"></vue-mathjax>
          iнтервального статистичного ряду побудуємо спочатку
          вiдповiдний дискретний статистичний ряд
        </p>
        <div class="frequency-table">
          <table class="table">
            <caption>Табл. #3</caption>
            <tr>
              <th>x<sub>i</sub></th>
              <td v-for="(value, name, ind) in discreteCumulativeDistribution.chartLabels"
                  :key="ind">{{value}}</td>
            </tr>
            <tr>
              <th>n<sub>i</sub></th>
              <td v-for="(interval, name, ind) in frequencyIntervals"
                  :key="ind">{{interval.rangeFreq}}</td>
            </tr>
          </table>
        </div>
        <br>
        <p>Тоді</p>
        <mathjax-sample-mean-formula
          :hasBorder="false"
          :a="numbersAmount"
          :b="sampleMean.intervalAccumulateStr"
          :c="sampleMean.intervalValue"
        ></mathjax-sample-mean-formula>
      </v-col>
    </v-row>
    <h2>Дисперсія</h2>
    <v-row>
      <v-col cols="12" md="6">
        <p>
          Вибiрковою дисперсiєю <vue-mathjax :formula="'$ {D}_B $'"></vue-mathjax>
          статистичного ряду називають середнє значення квадратiв вiдхилень
          його членiв вiд вибiркового середнього значення
          <vue-mathjax :formula="'$ \\bar{x}_B $'"></vue-mathjax>
          статистичного ряду
        </p>
      </v-col>
      <v-col cols="12" md="6" order="0" order-md="1">
        <mathjax-variance-formula formulaTemplate="formulaA"></mathjax-variance-formula>
      </v-col>
      <v-col cols="12" md="6">
        <p>Для обчислення дисперсiї також можна використовувати іншу формулу згiдно якої</p>
      </v-col>
      <v-col cols="12" md="6">
        <mathjax-variance-formula formulaTemplate="formulaB"></mathjax-variance-formula>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p>
          Дисперсiю <vue-mathjax :formula="'$ {D}_B $'"></vue-mathjax>
          iнтервального статистичного ряду обчислюємо за даними
          вiдповiдного дискретного ряду Табл. #3
        </p>
        <mathjax-variance-formula
          :hasBorder="false"
          :a="numbersAmount"
          :b="variance.accumulateStr"
          :c="variance.value"
        ></mathjax-variance-formula>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>

import { mapState, mapGetters } from 'vuex';

import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
  SAVE_VALUE,
  MAKE_CALCULATION,
} from '../store/mutation-types';

import frequencyChart from '@/components/chart/LineChart.vue';
import frequencyBar from '@/components/chart/BarChart.vue';
import discreteCumulativeDistributionChart from '@/components/chart/DiscreteCumulativeDistributionChart.vue';
import cumulativeDistributionChart from '@/components/chart/CumulativeDistributionChart.vue';

import mathjaxMedianFormula from '@/components/mathjaxFormulas/MedianFormula.vue';
import mathjaxSampleMeanFormula from '@/components/mathjaxFormulas/SampleMeanFormula.vue';
import mathjaxVarianceFormula from '@/components/mathjaxFormulas/VarianceFormula.vue';

export default {
  components: {
    frequencyChart,
    frequencyBar,
    discreteCumulativeDistributionChart,
    cumulativeDistributionChart,
    mathjaxMedianFormula,
    mathjaxSampleMeanFormula,
    mathjaxVarianceFormula,
  },
  data() {
    return {
      showControls: false,
      showResult: false,
      frequencyDataCollection: {},
      frequencyIntervalsDataCollection: {},
      discreteCumulativeDataCollection: {},
      сumulativeDataCollection: {},
    };
  },
  computed: {
    ...mapState({
      inputData: state => state.lab1.inputData,
      validData: state => state.lab1.validData,
    }),
    ...mapGetters([
      'isDataValid',
      'sortedFrequency',
      'numbersAmount',
      'relativeFrequencySum',
      'range',
      'modalValues',
      'medianValue',
      'frequencyIntervals',
      'modalIntervals',
      'medianInterval',
      'medianIntervalValue',
      'discreteCumulativeDistribution',
      'cumulativeDistribution',
      'sampleMean',
      'variance',
    ]),
    inputsCount: {
      get() {
        return this.$store.getters.inputsCount;
      },
      set(value) {
        this.$store.commit(SET_INPUTS_COUNT, value);
      },
    },
  },
  watch: {
    sortedFrequency() {
      this.frequencyDataCollection = {
        labels: this.sortedFrequency.frequencySorted,
        datasets: [{
          label: 'частота',
          data: this.sortedFrequency.appropriateValues,
          fill: false,
          borderColor: '#3f51b5',
          borderWidth: 3,
          lineTension: 0,
        }],
      };
      this.frequencyIntervalsDataCollection = {
        labels: this.frequencyIntervals.map(item => item.rangeStr),
        datasets: [
          {
            label: 'щільність частоти',
            data: this.frequencyIntervals.map(item => item.rangeFreqScaled),
            backgroundColor: 'rgba(63, 81, 181, 0.8)',
            borderWidth: 1,
            borderColor: '#3F51B5',
            categoryPercentage: 1, // set gap between bars to zero
            barPercentage: 1, // set gap between bars to zero
          },
          {
            label: 'відносна частота',
            data: this.frequencyIntervals.map(item => item.rangeRelativeFreq),
            backgroundColor: 'rgba(236, 64, 122, 0.8)',
            borderWidth: 1,
            borderColor: '#ec407a',
            categoryPercentage: 1,
            barPercentage: 1,
          },
        ],
      };
      this.discreteCumulativeDataCollection = {
        labels: ['-Infinity', ...this.discreteCumulativeDistribution.chartLabels, '+Infinity'],
        datasets: [{
          label: 'F*(x)',
          data: [0, ...this.discreteCumulativeDistribution.cumulativeFreq, 1],
          fill: false,
          borderColor: '#3F51B5',
          borderWidth: 2,
          steppedLine: true,
          borderDash: [15, 15],
          pointStyle: 'triangle',
          backgroundColor: '#3F51B5',
          radius: this.discreteCumulativeDistribution.pointsRadius,
          hoverRadius: 10,
          rotation: 30,
        }],
      };
      this.сumulativeDataCollection = {
        datasets: [{
          label: 'F*(x)',
          data: this.cumulativeDistribution,
          fill: false,
          borderColor: '#3F51B5',
          borderWidth: 3,
          lineTension: 0,
        }],
      };
    },
  },
  methods: {
    createInputs() {
      this.$store.commit(CREATE_INPUTS);
      this.showControls = true;
    },
    addInput() {
      this.showResult = false;
      this.$store.commit(ADD_INPUT);
    },
    deleteInput() {
      this.showResult = false;
      this.$store.commit(DELETE_INPUT);
    },
    saveValue(index, value) {
      this.showResult = false;
      this.$store.commit(SAVE_VALUE, { index, value });
    },
    makeCalculation() {
      this.$store.commit(MAKE_CALCULATION);
      this.showResult = true;
    },
  },
};
</script>

<style lang="scss">
  $fs-base: 16px;
  $fs-large: 20px;

  .frequency-table,
  .range-table {
    overflow-x: auto;
  }
  .table {
    width: 100%;
    white-space: nowrap;
    border-collapse: collapse;
    font-size: $fs-base;
    caption {
      text-align: left;
    }
    th,td {
      text-align: center;
      border: 1px solid #dee2e6;
    }
    th {
      font-size: $fs-large;
      font-weight: bold;
    }
  }
  .mathjax-formula {
    margin: 20px 0;
    padding: 20px 0;
    &--bordered {
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
