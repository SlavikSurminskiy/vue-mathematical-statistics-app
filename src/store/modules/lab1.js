import Vue from 'vue';

import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
  SAVE_VALUE,
} from '../mutation-types';

export default {
  state: {
    inputsCount: 0,
    inputData: [],
    validData: [],
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
  },
  getters: {
    inputsCount(state) {
      return state.inputsCount;
    },
  },
};
