import Vue from 'vue';

import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
  SAVE_VALUE,
  MAKE_CALCULATION,
} from '../mutation-types';

export default {
  state: {
    inputsCount: 0,
    inputData: [],
    validData: [],
    frequency: {},
  },
  mutations: {
    [SET_INPUTS_COUNT](state, payload) {
      if (payload < 0) {
        state.inputsCount = 0;
      } else {
        state.inputsCount = payload;
      }
    },
    [CREATE_INPUTS](state) {
      state.inputData = [];
      state.validData = [];
      for (let i = 0; i < state.inputsCount; i += 1) {
        state.inputData.push('');
        state.validData.push(false);
      }
    },
    [ADD_INPUT](state) {
      state.inputData.push('');
      state.validData.push(false);
      state.inputsCount += 1;
    },
    [DELETE_INPUT](state) {
      state.inputData.pop();
      state.validData.pop();
      state.inputsCount -= 1;
    },
    [SAVE_VALUE](state, payload) {
      const { index, value } = payload;
      const isValid = value !== '';
      Vue.set(state.validData, index, isValid);
      if (isValid) {
        Vue.set(state.inputData, index, +value);
      } else {
        Vue.set(state.inputData, index, '');
      }
    },
    [MAKE_CALCULATION](state) {
      state.frequency = {};
      state.inputData.forEach((element) => {
        if (Object.prototype.hasOwnProperty.call(state.frequency, element)) {
          state.frequency[element] += 1;
        } else {
          state.frequency[element] = 1;
        }
      });
    },
  },
  getters: {
    inputsCount(state) {
      return state.inputsCount;
    },
    isDataValid(state) {
      return !state.validData.includes(false) && state.validData.length;
    },
    sortedFrequency(state) {
      const frequencySorted = Object.keys(state.frequency)
        .map(val => +val)
        .sort((a, b) => a - b);
      const appropriateValues = [];
      frequencySorted.forEach((frequency) => {
        appropriateValues.push(state.frequency[frequency]);
      });
      return { frequencySorted, appropriateValues };
    },
    numbersAmount(state) {
      return Object.values(state.frequency)
        .reduce((acc, value) => acc + value, 0);
    },
    relativeFrequencySum(state, getters) {
      return Object.values(state.frequency)
        .reduce((acc, value) => acc + value / getters.numbersAmount, 0)
        .toFixed(4);
    },
    range(state) {
      const max = Math.max(...state.inputData);
      const min = Math.min(...state.inputData);
      const range = max - min;
      let rangeStr = '';
      if (min < 0) {
        rangeStr = `${max} - (${min}) = ${range}`;
      } else {
        rangeStr = `${max} - ${min} = ${range}`;
      }
      return {
        min, max, range, rangeStr,
      };
    },
    modalValues(state) {
      let modalValues = [];
      let freq = -Infinity;
      Object.entries(state.frequency).forEach((property) => {
        const [number, numberFreq] = property;
        if (numberFreq > freq) {
          modalValues = [];
          freq = numberFreq;
          modalValues.push({ number, numberFreq });
        } else if (numberFreq === freq) {
          modalValues.push({ number, numberFreq });
        }
      });
      return modalValues;
    },
    medianValue(state) {
      const inputDataSorted = state.inputData.sort((a, b) => a - b);
      const index = Math.floor(inputDataSorted.length / 2);
      let median = '';
      // check is odd or even
      if (inputDataSorted.length & 1) { // eslint-disable-line no-bitwise
        median = inputDataSorted[index];
      } else {
        median = (inputDataSorted[index] + inputDataSorted[index - 1]) / 2;
      }
      return median;
    },
    frequencyIntervals(state, getters) {
      const ranges = [];
      const rangesAmount = Math.round(1 + 3.2 * Math.log10(getters.numbersAmount));
      const rangeLength = +(getters.range.range / rangesAmount).toFixed(3);
      const endRange = getters.range.max;
      const frequencyEntries = Object.entries(state.frequency);

      let barStartRange = getters.range.min;
      let barEndRange = +(barStartRange + rangeLength).toFixed(3);

      function calcFreqSumInRange(entries, rangeStart, rangeEnd) {
        return entries.filter(item => item[0] >= rangeStart && item[0] < rangeEnd)
          .reduce((acc, val) => acc + val[1], 0);
      }

      for (let i = 0; i < rangesAmount; i += 1) {
        const range = {};
        let sumFreqInRange = '';

        if (i === rangesAmount - 1) {
          sumFreqInRange = calcFreqSumInRange(frequencyEntries, barStartRange, Infinity);
          range.rangeStr = `[ ${barStartRange}; ${endRange} ]`;
          range.rangeEnd = endRange;
        } else {
          sumFreqInRange = calcFreqSumInRange(frequencyEntries, barStartRange, barEndRange);
          range.rangeStr = `[ ${barStartRange}; ${barEndRange} )`;
          range.rangeEnd = barEndRange;
        }

        Object.assign(range, {
          rangeStart: barStartRange,
          rangeFreq: sumFreqInRange,
          rangeFreqScaled: +(sumFreqInRange / rangeLength).toFixed(3),
          rangeRelativeFreq: +(sumFreqInRange / rangeLength / getters.numbersAmount).toFixed(3),
        });

        ranges.push(range);

        barStartRange = barEndRange;
        barEndRange = +(barStartRange + rangeLength).toFixed(3);
      }

      return ranges;
    },
    modalIntervals(state, getters) {
      const ranges = getters.frequencyIntervals.map(item => [item.rangeStr, item.rangeFreqScaled]);
      let modalIntervals = [];
      let freq = -Infinity;
      let interval;

      ranges.forEach((item) => {
        const [range, rangeFreq] = item;
        if (rangeFreq > freq) {
          modalIntervals = [];
          freq = rangeFreq;
          interval = range;
          modalIntervals.push({ interval, freq });
        } else if (rangeFreq === freq) {
          interval = range;
          modalIntervals.push({ interval, freq });
        }
      });

      return modalIntervals;
    },
    medianInterval(state, getters) {
      const { numbersAmount, frequencyIntervals } = getters;
      const halfNumbersAmount = numbersAmount / 2;
      const freqInRanges = frequencyIntervals.map(item => item.rangeFreq);
      let sumPreviewsRanges = 0;
      let sumNextRanges = 0;
      let medianIntervalIndex;

      for (let i = 0; i < freqInRanges.length; i += 1) {
        sumPreviewsRanges = freqInRanges.slice(0, i).reduce((acc, val) => acc + val, 0);
        sumNextRanges = freqInRanges.slice(i + 1).reduce((acc, val) => acc + val, 0);
        if (sumPreviewsRanges <= halfNumbersAmount && sumNextRanges <= halfNumbersAmount) {
          medianIntervalIndex = i;
        }
      }

      const interval = frequencyIntervals[medianIntervalIndex];

      return { interval, medianIntervalIndex };
    },
    medianIntervalValue(state, getters) {
      const { medianInterval, numbersAmount, frequencyIntervals } = getters;
      const halfNumbersAmount = numbersAmount / 2;
      const { medianIntervalIndex, interval: { rangeStart, rangeEnd, rangeFreq } } = medianInterval;

      const accumulateLeftSum = frequencyIntervals
        .slice(0, medianIntervalIndex)
        .map(item => item.rangeFreq)
        .reduce((acc, val) => acc + val, 0);

      const expressionPartA = (rangeEnd - rangeStart) / rangeFreq;
      const expressionPartB = halfNumbersAmount - accumulateLeftSum;
      const medianValue = +(expressionPartA * expressionPartB + rangeStart).toFixed(3);

      return {
        medianValue,
        rangeStart,
        rangeEnd,
        rangeFreq,
        accumulateLeftSum,
      };
    },
    discreteCumulativeDistribution(state, getters) {
      const { frequencyIntervals, numbersAmount } = getters;
      const cumulativeFreq = [];

      // calc arithmetic mean of each interval
      const chartLabels = frequencyIntervals.map((item) => {
        const label = +((item.rangeStart + item.rangeEnd) / 2).toFixed(3);
        return label;
      });

      frequencyIntervals.reduce((acc, interval) => {
        const { rangeFreq } = interval;
        const result = +((acc + rangeFreq) / numbersAmount).toFixed(3);
        cumulativeFreq.push(result);
        return acc + rangeFreq;
      }, 0);

      chartLabels.unshift('-Infinity');
      chartLabels.push('+Infinity');

      cumulativeFreq.unshift('0');
      cumulativeFreq.push('1');

      const radius = 10;
      const pointsRadius = [];
      pointsRadius.push(0); // set radius for first point which is '-Infinity'

      for (let i = 0; i < chartLabels.length - 2; i += 1) {
        pointsRadius.push(radius);
      }

      pointsRadius.push(0); // set radius for last point which is '+Infinity'

      return { chartLabels, cumulativeFreq, pointsRadius };
    },
  },
};
