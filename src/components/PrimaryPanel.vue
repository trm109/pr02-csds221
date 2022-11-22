<template>
  <div class="PrimaryPanel">
    <div>
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h1>Framework Task Table</h1>
          <Button
            class="button glyphicon glyphicon-plus"
            @btn-click="openModelAdd"
            text="      Add New Task"
          ></Button>

          <TaskEditorModal
            v-if="showEditorModal"
            :toggleModal="() => toggleModal()"
          >
            <h2>My Modal</h2>
            <p>Some content</p>
            <TaskEditor
              ref="taskEditor"
              :editing="editing"
              :id="editingTaskId"
              @interface="getEditorInterface"
              @emittedSubmit="modalSubmit"
              :isActive="showEditorModal"
              :task="taskToEdit"
              @toggleModal="toggleModal"
              :tasks="tasks"
            />
          </TaskEditorModal>
        </div>
        <div class="panel-body">
          <TaskTable
            :tasks="tasks"
            @editClick="openModalEdit"
            @deleteClick="deleteTask"
            @updateIsComplete="updateIsComplete"
          />
        </div>
      </div>
    </div>
    <div v-if="showToast" class="panel panel-success">
      <div class="panel-heading">
        <transition name="toast">
          <Toast>
            {{ toastMessage }}
          </Toast>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TaskTable from "./TaskTable.vue";
import Button from "./Button.vue";
import TaskEditorModal from "./TaskEditorModal.vue";
import TaskEditor from "./TaskEditor.vue";
import Toast from "./Toast.vue";

export default defineComponent({
  name: "PrimaryPanel",
  editorInterface: {
    importFromExistingTask: (task) => {},
  },
  data() {
    return {
      tasks: [],
      showEditorModal: false,
      editing: false, //if not editing, then adding.
      editingTaskId: -1, //default to -1.
      taskToEdit: {},
      toastMessage: "defaultToastMessage",
      showToast: false,
    };
  },
  props: {},
  components: {
    TaskTable,
    Button,
    TaskEditorModal,
    TaskEditor,
  },
  methods: {
    updateIsComplete(task) {
      task.isComplete = !task.isComplete;
      this.modifyTask(task);
    },
    getEditorInterface(editorInterface) {
      this.$options.editorInterface = editorInterface;
    },
    toggleModal() {
      this.showEditorModal = !this.showEditorModal;
    },
    openModelAdd() {
      this.editing = false;
      this.editingTaskId = -1;
      this.toggleModal();
    },
    async openModalEdit(id) {
      console.log("PrimaryPanel editClick");
      this.editing = true;
      this.editingTaskId = id;
      console.log("ABC");
      this.taskToEdit = await this.fetchTask(id);
      this.toggleModal();
    },
    modalSubmit(object) {
      console.log(object);
      //Determine whether to update or create.
      if (object.editing === true) {
        console.log("Updating task");
        //safety check:
        if (object.id === -1) {
          console.log("Error: Editing task with id -1.");
          console.log(object);
        }
        this.modifyTask(object);
        //Update
      } else {
        console.log("Creating task");
        //Create
        //Assign an id
        delete object["id"];
        this.addTask(object);
      }
    },
    async fetchTasks() {
      const response = await fetch("https://pr02-json-server.herokuapp.com/tasks");
      const data = await response.json();
      return data;
    },
    async fetchTask(id) {
      const response = await fetch(`https://pr02-json-server.herokuapp.com/tasks/${id}`);
      const data = await response.json();
      return data;
    },
    async addTask(task) {
      const response = await fetch("https://pr02-json-server.herokuapp.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await response.json();

      this.tasks = [...this.tasks, data];
      this.triggerToast("Task added.");
    },
    async deleteTask(id) {
      console.log("PPanel delclick " + id);
      if (confirm("Are you sure?")) {
        const res = await fetch(`https://pr02-json-server.herokuapp.com/tasks/${id}`, {
          method: "DELETE",
        });
        res.status === 200
          ? (this.tasks = this.tasks.filter((task) => task.id !== id))
          : alert("Error Deleting This Task");
        if(res.status === 200){
          this.triggerToast("Task deleted.");
        }
      }
      
    },
    async modifyTask(task) {
      const res = await fetch(`https://pr02-json-server.herokuapp.com/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      this.tasks = this.tasks.map((task) =>
        task.id === data.id ? { ...task, ...data } : task
      );
      this.triggerToast("Task updated.");
    },
    triggerToast(toastMessage) {
      this.showToast = true;
      this.toastMessage = toastMessage;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
  },
  async mounted() {
    this.tasks = await this.fetchTasks();
  },
});
</script>
<style scoped>
.button {
  position: fixed;
  top: 90px;
  right: 100px;
  float: right;
  color: white;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-enter-active {
  transition: all 0.5s;
}
</style>
