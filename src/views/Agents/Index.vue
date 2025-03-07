<script setup>
import { ref } from 'vue';

const showForm = ref(false);
const searchQuery = ref('');

const agents = ref([
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_no: '1234567890', agency_name: 'ABC Realty', city: 'New York', status: 'Active' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone_no: '9876543210', agency_name: 'XYZ Homes', city: 'Los Angeles', status: 'Pending' },
]);

const agentData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_no: '',
  agency_name: '',
  city: '',
  status: 'Pending',
});

// Function to add agent
const addAgent = () => {
  agents.value.push({ id: agents.value.length + 1, ...agentData.value });
  showForm.value = false;
  agentData.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    agency_name: '',
    city: '',
    status: 'Pending',
  };
};
</script>

<template>
 
    <v-card class="rounded-lg shadow-lg pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <h2 class="text-primary font-weight-bold">Manage Agents</h2>
        <v-btn color="indigo-darken-3" @click="showForm = !showForm">
          <v-icon class="mr-2">mdi-account-plus</v-icon> {{ showForm ? 'Close' : 'Add Agent' }}
        </v-btn>
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <!-- Search Field -->
      <v-text-field v-model="searchQuery" label="Search Agents..." variant="outlined" prepend-inner-icon="mdi-magnify" class="mb-4" />

      <!-- Add Agent Form (Collapsible) -->
      <v-expand-transition>
        <v-card v-if="showForm" class="pa-4 mb-4">
          <v-form @submit.prevent="addAgent">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="agentData.first_name" label="First Name" variant="outlined" required />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="agentData.last_name" label="Last Name" variant="outlined" required />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="agentData.email" label="Email" variant="outlined" type="email" required />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="agentData.phone_no" label="Phone Number" variant="outlined" type="tel" required />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="agentData.agency_name" label="Agency Name" variant="outlined" required />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="agentData.city" label="City" variant="outlined" required />
                </v-col>
                <v-col cols="6">
                  <v-select v-model="agentData.status" label="Status" variant="outlined" :items="['Active', 'Inactive', 'Pending']" />
                </v-col>
                <v-col cols="12">
                  <v-btn block color="indigo-darken-3" @click="addAgent">Save Agent</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-expand-transition>

      <!-- Agents Table -->
      <v-table class="elevation-2 rounded-lg">
        <thead>
          <tr class="text-indigo-darken-4 font-weight-bold">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Agency</th>
            <th>City</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agent in agents.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()))" :key="agent.id">
            <td class="font-weight-medium">{{ agent.id }}</td>
            <td>{{ agent.first_name }} {{ agent.last_name }}</td>
            <td>{{ agent.email }}</td>
            <td>{{ agent.phone_no }}</td>
            <td>{{ agent.agency_name }}</td>
            <td>{{ agent.city }}</td>
            <td>
              <v-chip
                class="font-weight-bold"
                :color="agent.status === 'Active' ? 'green' : agent.status === 'Pending' ? 'orange' : 'red'"
                variant="outlined"
              >
                {{ agent.status }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  
</template>
