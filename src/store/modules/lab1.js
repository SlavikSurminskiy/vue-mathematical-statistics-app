import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
} from '../mutation-types';

export default {
  state: {
    inputsCount: 0,
    inputData: [],
  },
  mutations: {
    [SET_INPUTS_COUNT](state, payload) {
      state.inputsCount = +payload;
      if (payload < 0) {
        state.inputsCount = 0;
      }
    },
    [CREATE_INPUTS](state) {
      state.inputData = [];
      for (let i = 0; i < state.inputsCount; i += 1) {
        state.inputData.push('');
      }
    },
    [ADD_INPUT](state) {
      state.inputData.push('');
      state.inputsCount += 1;
    },
    [DELETE_INPUT](state) {
      state.inputData.pop();
      state.inputsCount -= 1;
    },
  },
  getters: {
    inputsCount(state) {
      return state.inputsCount;
    },
  },
};
