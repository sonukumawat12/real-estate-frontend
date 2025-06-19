<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const dialog = ref(false)
const leads = ref([])

// Form fields
const name = ref('')
const phone = ref('')
const email = ref('')
const source = ref('')
const leadType = ref('')
const assignedTo = ref('')
const notes = ref('')
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})
// Options
const sources = ['Facebook', 'Google Ads', 'Walk-in', 'Referral']
const leadTypes = ['Buyer', 'Seller']
const agents = [
  { id: 1, name: 'Ravi Sharma' },
  { id: 2, name: 'Anjali Mehta' },
  { id: 3, name: 'Aman Kumar' }
]
const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

const fetchLeads = async () => {
  try {
    const response = await axios.get('/leads')
    leads.value = response.data.data || [] 
  } catch (error) {
    console.error('Error fetching leads:', error)
  }
}

// Call fetch on mount
onMounted(() => {
  fetchLeads()
})

const resetForm = () => {
  name.value = ''
  phone.value = ''
  email.value = ''
  source.value = ''
  leadType.value = ''
  assignedTo.value = ''
  notes.value = ''
}

const submitLead = async () => {
  if (!name.value || !phone.value || !source.value || !leadType.value || !assignedTo.value) {
    alert('Please fill in all required fields.')
    return
  }

  const payload = {
    name: name.value,
    phone: phone.value,
    email: email.value,
    source: source.value,
    type: leadType.value,
    assigned_to: assignedTo.value,
    notes: notes.value
  }

  try {
    const response = await axios.post('/leads', payload)
    
    leads.value.push(response.data.data)
    resetForm()
    dialog.value = false
    toast.success("Lead added successfully!")
  } catch (error) {
    console.error(error.response.data.message)
    toast.error(error.response.data.message)
  }
}
</script>


<template>
  <v-container>
    <!-- Toolbar with Add Button -->
    <v-card elevation="2" class="mb-4">
      <v-toolbar flat>
        <v-toolbar-title>Lead Management</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" @click="dialog = true">
          + Add Lead
        </v-btn>
      </v-toolbar>
    </v-card>

    <!-- Leads Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="[
          { title: 'Name', key: 'name' },
          { title: 'Phone', key: 'phone' },
          { title: 'Email', key: 'email' },
          { title: 'Source', key: 'source' },
          { title: 'Type', key: 'type' },
          { title: 'Assigned To', key: 'assigned_to' }
        ]"
        :items="leads"
        class="elevation-1"
      ></v-data-table>
    </v-card>

    <!-- Add Lead Dialog -->
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Add New Lead</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitLead">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="name" label="Name" required outlined />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="email" label="Email" outlined />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="phone" label="Phone" required outlined />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="source"
                  :items="sources"
                  label="Lead Source"
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="leadType"
                  :items="leadTypes"
                  label="Lead Type"
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="assignedTo"
                  :items="agents"
                  :item-title="item => item.name"
                  :item-value="item => item.id"
                  label="Assign To Agent"
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="notes" label="Notes" rows="2" outlined />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitLead">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

