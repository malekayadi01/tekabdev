<template>
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <div class="col-auto col-md-1.5 px-sm-2 px-0 bg-dark"> 
          <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="#" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span class="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li class="nav-item">
                <a href="dashboard" class="nav-link align-middle px-0">
                  <i class="fs-4 bi-house"></i> <span class="ms-1 d-none d-sm-inline">Dashboard</span>
                </a>
                <a href="UserPage" class="nav-link align-middle px-0">
                  <i class="bi bi-people-fill"></i> <span class="ms-1 d-none d-sm-inline">Utilisateurs</span>
                </a>
              </li>
            </ul>
            <hr>
            <div class="dropdown pb-4">
              <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://w7.pngwing.com/pngs/722/101/png-transparent-computer-icons-user-profile-circle-abstract-miscellaneous-rim-account.png" alt="profile picture" width="30" height="30" class="rounded-circle">
                <span class="d-none d-sm-inline mx-1">User</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                <hr class="dropdown-divider">
                <a class="dropdown-item" @click="signOut">Sign out</a>
              </ul>
            </div>
          </div>
        </div>
        <div class="col py-3">
          <slot></slot> 
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SideBar',
    methods: {
      signOut() {
        localStorage.removeItem('authToken');
          this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  