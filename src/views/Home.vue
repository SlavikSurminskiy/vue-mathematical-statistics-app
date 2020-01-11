<template>
  <div>
    <h1>Home component</h1>
    <p>App for automation laboratory work on probability theory</p>
    <p>Link to <a href="./mat_stat_doc.pdf" target="_blank"> laboratory document</a></p>
    <p>Check how this app works</p>
      <v-list :dark="true">
        <v-list-item link to="/labwork_1">
          <v-list-item-action>
            <v-icon>mdi-math-compass</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Лабораторна №1</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>
