<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { toast } from 'vue3-toastify';
const loading = ref(false);
const items = ref([]);
const dialog = ref(false);
const deletingId = ref(null);
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: yup.string()
    .required('Email is required')
    .email('Email must be valid'),
  pincode: yup.string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  role: yup.string().required('Role is required'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pincode: '',
    country: 'India',
    state: '',
    city: '',
    role: '',
  }
});

const { value: firstName, errorMessage: firstNameError } = useField('firstName');
const { value: lastName, errorMessage: lastNameError } = useField('lastName');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: email, errorMessage: emailError } = useField('email');
const { value: pincode, errorMessage: pincodeError } = useField('pincode');
const { value: country } = useField('country');
const { value: state, errorMessage: stateError } = useField('state');
const { value: city, errorMessage: cityError } = useField('city');
const { value: role, errorMessage: roleError } = useField('role');

const roles = ref([]);
const getAgents = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/get-agents");
    items.value = response.data.data.allAgents;
  } catch (error) {
    console.error("API Error:", error);
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/roles");
    const roleNames = response.data.map(role => role.name);
    roles.value = roleNames;
  } catch (error) {
    console.error("API Error:", error);
  }
};

const editAdmin = async (a) =>{
console.log('edited',a);
}
const deleteAdmin = async (selectedAdminId) => {
  try {
    deletingId.value = selectedAdminId;
    const response = await axios.delete(`http://127.0.0.1:8000/api/delete-admin/${selectedAdminId}`);
    console.log('Deleted user', response);
    deletingId.value = null;
    await getAgents(); 
    toast.success('Admin deleted successfully!');
  } catch (error) {
    deletingId.value = null;
    console.error("Error deleting admin:", error);
    toast.error('Failed to delete admin. Please try again.'); 
  }
}
const fetchData = async () => {
  await fetchRoles();
  await getAgents();
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await axios.post("http://127.0.0.1:8000/api/create-user", values);
    dialog.value = false;
    toast.success('Admin created successfully!');
    await getAgents();
    resetForm();
  } catch (error) {
    console.error("Form Submission Error:", error);
  } finally {
    loading.value = false;
  }
});

onMounted(fetchData);
</script>

<template>
  	<div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
					<div class="breadcrumb-title pe-3">Admin</div>
					<div class="ps-3">
						<nav aria-label="breadcrumb">
							<ol class="breadcrumb mb-0 p-0">
								<li class="breadcrumb-item"><a href="javascript:;"><i class="bx bx-user"></i></a>
								</li>
								<li class="breadcrumb-item active" aria-current="page">List Admins</li>
							</ol>
						</nav>
					</div>
					<div class="ms-auto">
						<div class="btn-group">
							   
          <v-btn @click="dialog = true" color="primary" class="ml-2">
           + Add Agent
          </v-btn>
						</div>
					</div>
				</div>

      <!-- Dialog with Form -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-card-title class="text-h5" color="#ff521d">
            Add New Agent
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="firstName"
                      label="First Name"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter first name"
                      :error-messages="firstNameError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="lastName"
                      label="Last Name"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter last name"
                      :error-messages="lastNameError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="phone"
                      label="Phone No"
                      required
                      type="tel"
                      maxlength="10"
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter phone number"
                      :error-messages="phoneError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="email"
                      label="Email Address"
                      type="email"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter email address"
                      :error-messages="emailError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="pincode"
                      label="Pincode"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter pincode"
                      :error-messages="pincodeError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="country"
                      label="Country"
                      required
                      disabled
                      variant="outlined"
                      color="#ff521d"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="state"
                      label="State"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter state"
                      :error-messages="stateError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="city"
                      label="City"
                      required
                      variant="outlined"
                      color="#ff521d"
                      placeholder="Enter city"
                      :error-messages="cityError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="role"
                      :items="roles"
                      item-text="name"
                      item-value="id"
                      label="Role"
                      required
                      variant="outlined"
                      color="#ff521d"
                      :error-messages="roleError"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialog = false" color="red">Cancel</v-btn>
            <v-btn :loading="loading" @click="onSubmit" color="#ff521d"> 
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  <!-- Data Table -->
  <v-data-table :items="items" :loading="loading">
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
    </template>
    <template #headers>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>City</th>
        <th>State</th>
        <th>Created Date</th>
        <th>Actions{{ deletingId }}</th>
      </tr>
    </template>
    <template #item="{ item }">
      <tr>
        <td>{{ item.firstName }} {{ item.lastName }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.roles.map(role => role.name.charAt(0).toUpperCase() + role.name.slice(1)).join(', ') }}</td>
        <td>{{ item.city }}</td>
        <td>{{ item.state }}</td>
        <td>{{ item.created_at }}</td>
        <td class="d-flex align-center gap-2">
          <v-icon color="warning" icon="mdi-pencil" size="x-large" @click="editAdmin(item.id)"></v-icon>
              <v-progress-circular
              :width="3"
              color="red"
              indeterminate
              v-if="deletingId === item.id"
            ></v-progress-circular>
          <v-icon color="danger" icon="mdi-trash-can" size="x-large" @click="deleteAdmin(item.id)" v-else></v-icon>
       
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
