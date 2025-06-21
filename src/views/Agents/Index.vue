<script setup>
import { ref } from 'vue'

const selected = ref([])
const dialog = ref(false) // 🔹 Dialog control

const items = [
  {
    name: '🍎 Apple',
    location: 'Washington',
    height: '0.1',
    base: '0.07',
    volume: '0.0001',
  }
]

// New agent form fields
const newAgent = ref({
  first_name: '',
  last_name: '',
  email: ''
})

const saveAgent = () => {
  console.log('New Agent:', newAgent.value)
  // 🔹 Save logic here (API call or push into list)
  dialog.value = false
  // Reset form (optional)
  newAgent.value = { first_name: '', last_name: '', email: '' }
}
</script>

<template>
  <!-- 🔹 Top Card with Toolbar -->
  <v-card elevation="2" class="mb-4">
    <v-toolbar flat>
      <v-toolbar-title>Agent Management</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="dialog = true" variant="tonal">
        + Add Agent
      </v-btn>
    </v-toolbar>
  </v-card>

  <!-- 🔹 Data Table -->
  <v-data-table
    v-model="selected"
    :items="items"
    item-value="name"
    show-select
  ></v-data-table>

  <!-- 🔹 Add Agent Dialog -->
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h6">Add New Agent</span>
      </v-card-title>

      <v-card-text>
        <v-text-field label="First Name" v-model="newAgent.first_name" />
        <v-text-field label="Last Name" v-model="newAgent.last_name" />
        <v-text-field label="Email" v-model="newAgent.email" type="email" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveAgent">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
