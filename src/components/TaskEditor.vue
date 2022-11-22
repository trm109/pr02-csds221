<template>
  <form @submit.prevent="onSubmit" class="add-form">
    <div class="debug-label">
      <p>
        {{ id }}
      </p>
    </div>
    <FormInput
      id="title-input"
      label="Task Title"
      type="text"
      :value="titleValue"
      description="What is the title of your task?"
      placeholder="Task Title"
      v-model="title"
    />
    <FormInput
      id="description-input"
      label="Task Description"
      type="text"
      :value="descValue"
      description="What is the description of your task?"
      placeholder="Task Description"
      v-model="description"
    />
    <FormInput
      id="deadline-input"
      label="Task Deadline"
      type="date"
      :value="deadlineValue"
      description="What is the deadline of your task?"
      placeholder="Task Deadline"
      v-model="deadline"
    />
    <FormInput
      id="priority-input"
      label="Task Priority"
      type="range"
      :value="rangeValue"
      step="1"
      min="1"
      max="3"
      v-model="priority"
    />
    <button class="modal-submit" @click="modalSubmit()">
      <span
        v-bind:class="[this.editing ? 'glyphicon glyphicon-pencil' : 'glyphicon glyphicon-plus']"
      ></span>
      {{ this.editing ? "Edit" : "Add" }}
    </button>
  </form>
</template>

<script>
import Button from "./Button.vue";
import FormInput from "./FormInput.vue";
export default {
  created() {
    console.log("TaskEditor created: ");
    console.log(this.task);
    if (this.editing) {
      this.title = this.task.title;
      this.description = this.task.description;
      this.deadline = this.task.deadline;
      this.priority = this.task.priority;
      this.isComplete = this.task.isComplete;
    }
    this.emitInterface();
  },
  expose: ["importFromExistingTask"],
  name: "TaskEditor",
  components: {
    FormInput,
  },
  props: {
    editing: Boolean,
    id: Number,
    task: Object,
    tasks: Array,
  },
  data() {
    return {
      title: "",
      description: "",
      deadline: "",
      priority: "1",
      isComplete: false,
      titleValue: "dasda",
      descValue: "ddd",
      deadlineValue: "eee",
      rangeValue: 1,
      isActive: false,
    };
  },
  methods: {
    emitInterface() {
      this.$emit("interface", {
        importFromExistingTask: () => this.importFromExistingTask(),
      });
    },
    importFromExistingTask() {
      console.log("DEF");
      if (this.editing == true) {
        const taskToImport = this.fetchTask(this.id);
        this.title = taskToImport.title;
      }
    },
    debugPrint() {
      console.log("TESTING");
      console.log("ID: " + this.id);
      console.log("Title: " + this.title);
      console.log("Description: " + this.description);
      console.log("Deadline: " + this.deadline);
      console.log("Priority: " + this.priority);
      console.log("isComplete: " + this.isComplete);
      console.log("Editing: " + this.editing);
    },
    modalSubmit() {
      console.log("submit");
      //check if a task.title in tasks has the same title as the one being added.
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].title == this.title) {
          alert("Task with same title already exists.");
          return;
        }
      }
      if (this.title != "" && this.description != "" && this.deadline != "") {
        this.$emit("emittedSubmit", {
          id: this.id,
          title: this.title,
          description: this.description,
          deadline: this.deadline,
          priority: this.priority,
          isComplete: this.isComplete,
          editing: this.editing,
        });
        this.$emit("toggleModal");
      } else {
        alert("Please fill out all fields");
      }
      //close the modal.
    },
    async fetchTask(id) {
      const response = await fetch(`https://pr02-json-server.herokuapp.com/tasks/${id}`);
      const data = await response.json();
      return data;
    },
  },
  watch: {
    id(newVal, oldVal) {
      console.log("ID Changed");
    },
  },
};
</script>
<style scoped>
.form-control {
  outline: auto;
  display: block;
  margin: 10px;
}

input {
  display: block;
}
</style>
