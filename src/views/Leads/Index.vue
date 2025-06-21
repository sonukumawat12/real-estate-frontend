<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import moment from 'moment'
import { watch } from 'vue'
// Dialog and data list
const dialog = ref(false)
const leads = ref([])

watch(dialog, (newVal, oldVal) => {

    if (!newVal) {
      console.log('sssssssssss');
      resetForm()
    }
})

// Validation Schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  source: yup.string().required('Source is required'),
  leadType: yup.string().required('Type is required'),
  assignedTo: yup.string().required('Assigned to is required'),
})

// useForm & useField (validation)
const { handleSubmit } = useForm({ validationSchema: schema })

const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: source, errorMessage: sourceError } = useField('source')
const { value: leadType, errorMessage: leadTypeError} = useField('leadType')
const { value: assignedTo, errorMessage: assignedToError} = useField('assignedTo')

const notes = ref('')
const loading = ref(false)
// Options
const sources = ['Facebook', 'Google Ads', 'Walk-in', 'Referral']
const leadTypes = ['Buyer', 'Seller']
const agents = [
  { id: 1, name: 'Ravi Sharma' },
  { id: 2, name: 'Anjali Mehta' },
  { id: 3, name: 'Aman Kumar' }
]

// Fetching leads
const fetchLeads = async () => {
  try {
    const response = await axios.get('/leads')
    leads.value = response.data.data || [] 
  } catch (error) {
    console.error('Error fetching leads:', error)
  }
}

onMounted(() => {
  fetchLeads()
})

// Reset
const resetForm = () => {
  console.log('sssssssaasasasass')
  name.value = ''
  phone.value = ''
  email.value = ''
  source.value = ''
  leadType.value = ''
  assignedTo.value = ''
  notes.value = ''
}

// Submit
const submitLead = handleSubmit(async () => {
  if (!phone.value || !source.value || !leadType.value || !assignedTo.value) {
    toast.error('Please fill in all required fields.')
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
    loading.value = true
    const response = await axios.post('/leads', payload)
    leads.value.unshift(response.data.data)
    resetForm()
    dialog.value = false
    loading.value = false
    toast.success("Lead added successfully!")
  } catch (error) {
    console.error(error.response?.data?.message || error.message)
    toast.error(error.response?.data?.message || "Something went wrong")
    loading.value = false
  } 
})

const formattedLeads = computed(() =>
  leads.value.map(lead => ({
    ...lead,
    created_at: lead.created_at ? moment(lead.created_at).format('YYYY-MM-DD hh:mm A') : ''
  }))
)

// Function to open lead profile in new tab
const openLeadProfile = (leadId) => {
  
  const url = `/leads/${leadId}/profile`
  window.open(url, '_blank')
}
</script>


<template>
  <v-container>
    <!-- Toolbar with Add Button -->
    <v-card elevation="2" class="mb-4">
      <v-toolbar flat>
        <v-toolbar-title>Lead Management</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" @click="dialog = true" variant="tonal">
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
          { title: 'Assigned To', key: 'assigned_to' },
          { title: 'Created At', key: 'created_at' },
          { title: 'Actions', key: 'actions', sortable: false }
        ]"
        :items="formattedLeads"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip text="View Profile">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                color="primary"
                variant="text"
                @click="openLeadProfile(item.id)"
                v-bind="props"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add Lead Dialog -->
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Add New Lead</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitLead">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="name" label="Name" required  variant="outlined" :error-messages="nameError" type="text" maxlength="50" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="email" label="Email" variant="outlined" :error-messages="emailError" type="email" maxlength="50" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="phone" label="Phone" required variant="outlined"  :error-messages="phoneError" maxlength="10" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="source"
                  :items="sources"
                  label="Lead Source"
                  variant="outlined"
                  required
                  :error-messages="sourceError"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="leadType"
                  :items="leadTypes"
                  label="Lead Type"
                  variant="outlined"
                  required
                  :error-messages="leadTypeError"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="assignedTo"
                  :items="agents"
                  :item-title="item => item.name"
                  :item-value="item => item.id"
                  label="Assign To Agent"
                  variant="outlined"
                  required
                  :error-messages="assignedToError"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="notes" label="Notes (Optional)" rows="2" variant="outlined" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false" :disabled="loading">Cancel</v-btn>
          <v-btn color="primary" @click="submitLead"  variant="tonal" :disabled="loading">
            <span v-if="!loading">Save</span>
            <span v-else>
              <v-progress-circular indeterminate size="20" width="2" color="white"></v-progress-circular>
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

