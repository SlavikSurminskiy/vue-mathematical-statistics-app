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
  },
};
