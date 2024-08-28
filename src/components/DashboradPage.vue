<template>
    <SideBar>
      <div class="dashboard">
        <div class="title">
          <h1>Tekab dev<span>Task Master</span></h1>
        </div>
        <div class="board">
          <div class="column" v-for="status in statuses" :key="status">
            <h1>{{ statusLabels[status] }}</h1>
            <div
              class="task-list"
              @dragover.prevent
              @drop="dropTask($event, status)"
            >
              <div
                v-for="task in tasks.filter(task => task.status === status)"
                :key="task.id"
                class="task"
                draggable="true"
                @dragstart="dragTask(task)"
              >
                <b-card
                  :border-variant="getCardVariant(task)"
                  :header-bg-variant="getCardVariant(task)"
                  text-variant="black"
                  class="mb-2"
                  :header="task.title"
                >
                  <h3></h3>
                  <p>{{ task.description }}</p>
                  <p>Date limite: {{ task.deadline }}</p>
                  <p>Priorité: {{ task.priority }}</p>
                  <p>Assigné à: {{ task.assignedTo }}</p>
                  <b-button @click="editTask(task)" variant="light">
                    <i class="bi bi-pencil-square"></i>
                  </b-button>
                  <b-button @click="deleteTask(task.id)" variant="light">
                    <i class="bi bi-trash-fill"></i>
                  </b-button>
                </b-card>
              </div>
            </div>
            <b-button
              v-if="status === 'todo'"
              @click="showTaskForm = true; newTask.status = status"
              variant="black"
            >
            <i class="bi bi-plus-square-fill fs-2"></i>
            </b-button>
          </div>
        </div>
        <b-modal v-model="showTaskForm" title="Créer une tâche">
          <form @submit.prevent="handleSubmit">
            <b-form-group label="Titre">
              <b-form-input v-model="newTask.title" placeholder="Titre" required />
            </b-form-group>
            <b-form-group label="Description">
              <b-form-input v-model="newTask.description" placeholder="Description" required />
            </b-form-group>
            <b-form-group label="Date limite">
              <b-form-input v-model="newTask.deadline" type="date" required />
            </b-form-group>
            <b-form-group label="Priorité">
              <b-form-select v-model="newTask.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </b-form-select>
            </b-form-group>
            <b-form-group label="Assigné à">
              <b-form-select v-model="newTask.assignedTo" :options="usersOptions" required />
            </b-form-group>
            <b-button type="submit" variant="primary">{{ isEditing ? 'Modifier' : 'Ajouter' }}</b-button>
            <b-button @click="resetForm" variant="secondary">Annuler</b-button>
          </form>
        </b-modal>
      </div>
    </SideBar>
  </template>  
  
  <script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SideBar from './SideBar.vue';

export default {
  components: {
    SideBar,
  },
  setup() {
    const newTask = ref({
      id: null,
      title: '',
      description: '',
      deadline: '',
      priority: 'low',
      status: 'todo',
      assignedTo: ''
    });
    const tasks = ref([]);
    const showTaskForm = ref(false);
    const isEditing = ref(false);
    const statuses = ['todo', 'in-progress', 'to-deliver', 'to-test', 'done'];
    const statusLabels = {
      'todo': 'À faire',
      'in-progress': 'En cours',
      'to-deliver': 'À livrer',
      'to-test': 'À tester',
      'done': 'Terminé'
    };
    const usersOptions = ref([]);
    let draggedTask = ref(null);

    const fetchTasks = async () => {
      try {
        const response = await axios.get(process.env.VUE_APP_TASKS_API_URL);
        tasks.value = response.data;
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(process.env.VUE_APP_USERNAMES_API_URL);
        usersOptions.value = response.data;
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    const handleSubmit = async () => {
      if (isEditing.value) {
        await updateTask(newTask.value);
      } else {
        await createTask(newTask.value);
      }
      resetForm();
    };

    const createTask = async (task) => {
      try {
        await axios.post(process.env.VUE_APP_TASKS_API_URL, task);
        await fetchTasks();
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    };

    const updateTask = async (task) => {
      try {
        await axios.put(`${process.env.VUE_APP_TASKS_API_URL}/${task.id}`, task);
        await fetchTasks();
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    };

    const deleteTask = async (id) => {
      try {
        await axios.delete(`${process.env.VUE_APP_TASKS_API_URL}/${id}`);
        await fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    };

    const dragTask = (task) => {
      draggedTask.value = task;
    };

    const dropTask = async (event, status) => {
      if (draggedTask.value) {
        draggedTask.value.status = status;
        await updateTask(draggedTask.value);
        draggedTask.value = null;
      }
    };

    const editTask = (task) => {
      newTask.value = { ...task }; 
      isEditing.value = true; 
      showTaskForm.value = true;
    };

    const resetForm = () => {
      newTask.value = {
        id: null,
        title: '',
        description: '',
        deadline: '',
        priority: 'low',
        status: 'todo',
        assignedTo: ''
      };
      isEditing.value = false;
      showTaskForm.value = false;
    };

    const getCardVariant = (task) => {
      if (task.status === 'done') return 'success';
      switch (task.priority) {
        case 'low':
          return 'primary';
        case 'medium':
          return 'warning';
        case 'high':
          return 'danger';
        default:
          return 'secondary';
      }
    };

    onMounted(async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.$router.push('/');
      } else {
        await fetchTasks();
        await fetchUsers();
      }
    });

    return {
      newTask,
      tasks,
      showTaskForm,
      isEditing,
      statuses,
      statusLabels,
      usersOptions,
      dragTask,
      dropTask,
      editTask,
      deleteTask,
      handleSubmit,
      getCardVariant,
      resetForm
    };
  }
};

  </script>
  
  <style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  .title h1 {
    text-align: center;
    font-size: 70px;
    text-transform: uppercase;
    color: #02A6FD;
    letter-spacing: 1px;
    font-family: "Playfair Display", serif;
    font-weight: 400;
  }
  .title h1 span {
    margin-top: 5px;
    font-size: 25px;
    color: #02A6FD;
    word-spacing: 1px;
    font-weight: normal;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: "Raleway", sans-serif;
    font-weight: 500;
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
  }
  .title h1 span:after, .title h1 span:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    height: 5px;
    background-color: #f8f8f8;
  }
  
  .board {
    display: flex;
    justify-content: space-between;
  }
  
  .column {
    width: 30%;
    background-color: #dfebee;
    padding: 10px;
  }
  
  .task-list {
    min-height: 200px;
  }
  
  .task {
    margin: 10px 0;
  }
  
  .column h1 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-transform: capitalize;
  }

  </style>
  