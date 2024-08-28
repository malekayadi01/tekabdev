<template>
    <SideBar>
      <div class="user-management">
        <div class="title">
          <h1>Tekab dev<span>Task Master</span></h1>
        </div>
        <b-button @click="openUserForm" variant="primary">Ajouter Utilisateur</b-button>
  
        <b-table :items="users" :fields="fields">
          <template #cell(actions)="row">
            <b-button @click="editUser(row.item)" variant="light">Edit</b-button>
            <b-button @click="deleteUser(row.item.id)" variant="danger">Delete</b-button>
          </template>
        </b-table>
  
        <b-modal v-model="showUserForm" :title="isEditing ? 'Edit User' : 'Create User'">
          <form @submit.prevent="isEditing ? updateUser() : createUser()">
            <b-form-group label="Username">
              <b-form-input v-model="newUser.username" required />
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input v-model="newUser.email" type="email" required />
            </b-form-group>
            <b-button type="submit" variant="primary">{{ isEditing ? 'Update' : 'Save' }}</b-button>
            <b-button @click="showUserForm = false" variant="secondary">Cancel</b-button>
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
    components: { SideBar },
    setup() {
      const users = ref([]);
      const showUserForm = ref(false);
      const newUser = ref({ username: '', email: '' });
      const fields = ['username', 'email', 'actions'];
      const isEditing = ref(false);
      const currentUserId = ref(null);
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('https://restless-night-e697.malekaydi.workers.dev/users');
          users.value = response.data;
        } catch (err) {
          console.error('Failed to fetch users:', err);
        }
      };
  
      const createUser = async () => {
        try {
          await axios.post('https://restless-night-e697.malekaydi.workers.dev/users', newUser.value);
          await fetchUsers();
          resetForm();
          showUserForm.value = false;
        } catch (err) {
          console.error('Failed to create user:', err);
        }
      };
  
      const updateUser = async () => {
        try {
          await axios.put(`https://restless-night-e697.malekaydi.workers.dev/users/${currentUserId.value}`, newUser.value);
          await fetchUsers();
          resetForm();
          showUserForm.value = false;
        } catch (err) {
          console.error('Failed to update user:', err);
        }
      };
  
      const editUser = (user) => {
        newUser.value = { ...user };
        currentUserId.value = user.id;
        isEditing.value = true;
        showUserForm.value = true;
      };
  
      const deleteUser = async (id) => {
        try {
          await axios.delete(`https://restless-night-e697.malekaydi.workers.dev/users/${id}`);
          await fetchUsers();
        } catch (err) {
          console.error('Failed to delete user:', err);
        }
      };
  
      const openUserForm = () => {
        isEditing.value = false;
        resetForm();
        showUserForm.value = true;
      };
  
      const resetForm = () => {
        newUser.value = { username: '', email: '' };
        isEditing.value = false;
        currentUserId.value = null;
      };
  
      onMounted(() => {
        fetchUsers();
      });
  
      return {
        users,
        showUserForm,
        newUser,
        fields,
        createUser,
        updateUser,
        editUser,
        deleteUser,
        openUserForm,
        resetForm,
        isEditing,
      };
    }
  };
  </script>
  
  <style>
  .user-management {
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
  </style>
  