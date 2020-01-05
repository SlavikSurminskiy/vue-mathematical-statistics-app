<template lang="html">
  <vue-mathjax :formula="formula"></vue-mathjax>
</template>

<script>

export default {
  /*
    this component render mathjax formula which looks like templates below
    Me(x) = a + ((a-b)/c) * (d/2 - f)
    Me(x) = a + ((a-b)/c) * (d/2 - f) = g
  */
  props: ['a', 'b', 'c', 'd', 'f', 'g'],
  computed: {
    formula() {
      if (this.g !== undefined) {
        return `$$ \\Large M_e(x) = { ${this.a} + \\frac{${this.b} - ${this.a}}{${this.c}} \\bigg(\\frac{${this.d}}{2} - ${this.f}\\bigg) } = ${this.g}$$`;
      }
      return `$$ \\Large M_e(x) = { ${this.a} + \\frac{${this.b} - ${this.a}}{${this.c}} \\bigg(\\frac{${this.d}}{2} - ${this.f}\\bigg) }$$`;
    },
  },
};

</script>
