<template lang="html">
  <div :class="styleClass">
    <vue-mathjax :formula="formula"></vue-mathjax>
  </div>
</template>

<script>

export default {
  /*
    this component render mathjax formula which looks like templates below
    xB = (1/a) * b = c
    xB = (1/a) * b
  */
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    a: {
      type: [Number, String],
      default: 'n',
    },
    b: {
      type: [Number, String],
      default: '\\sum_{i=1}^{k} n_i x_i',
    },
    c: {
      type: [Number, String],
      default: '',
    },
  },
  computed: {
    styleClass() {
      if (this.hasBorder) {
        return 'mathjax-formula mathjax-formula--bordered';
      }
      return 'mathjax-formula';
    },
    formula() {
      if (this.c !== '') {
        return `$$ \\bar{x}_B = \\frac{1}{${this.a}} (${this.b}) = ${this.c} $$`;
      }
      return `$$ \\Large \\bar{x}_B = \\frac{1}{\\mbox ${this.a}} ${this.b} $$`;
    },
  },
};

</script>
