<template>
  <div v-show="showTaskEditor">
    <TaskEditor />
  </div>
  <PrimaryPanel />
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import PrimaryPanel from "./components/PrimaryPanel.vue";
import TaskEditor from "./components/TaskEditor.vue";


export default defineComponent({
  name: "App",
  components: {
    PrimaryPanel,
    TaskEditor,
  },
  data() {
    return {
      showTaskEditor: false,
    };
  },
  created() {
    console.log("App created");
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
