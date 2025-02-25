<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from 'vue-router';
import axios from "axios";

// Roles ke liye reactive state banayi
const roles = ref([]);

// API Call function
const fetchRoles = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/roles");
    roles.value = response.data; // API response store kar rahe hain
  } catch (error) {
    console.error("API Error:", error);
  }
};

// Component mount hone par API call karega
onMounted(fetchRoles);
</script>

<template>
  <div class="about">
    <div class="row">
      <div class="col">
        <h6 class="mb-0 text-uppercase">Role & Access</h6>
        <hr>
     <div class="row">
		<div class="col-md-6">
            <RouterLink to="roles/create" class="btn btn-primary mb-3" style="width: 6.25rem; justify-content: end">Add Role</RouterLink>
        </div>
	
	 </div>
        <div class="card">
          <div class="card-body">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Role</th>
                  <th scope="col">Description</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(role, index) in roles" :key="role.id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ role.name }}</td>
                  <td>{{ role.description }}</td>
                  <td>{{ role.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* CSS Styling yahan add karein */
</style>
