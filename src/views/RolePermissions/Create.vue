<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
const permissions = ref([]);
const groupedPermissions = ref({});
const selectedPermissions = ref([]);
const roleName = ref('');
const description = ref('');
const roleNameError = ref('');
const router = useRouter();
const handleSubmit = async () => {
  roleNameError.value = '';

  if (!roleName.value) {
    roleNameError.value = 'Role name is required.';
    return;
  }

  // Prepare data for submission
  const data = {
    roleName: roleName.value,
    description: description.value,
    permissions: selectedPermissions.value,
  };

  try {
    // Make the API call to create the role with permissions
    const response = await axios.post('http://127.0.0.1:8000/api/create-role-with-permissions', data);
    console.log('Role created successfully:', response);
    toast.success('Role created successfully!');
	selectedPermissions.value = [];
    roleName.value = '';
    description.value = '';
	router.push('/roles');
    // Optionally, you can reset the form or redirect the user after successful creation
  } catch (error) {
    console.error('Error creating role:', error);
	if (error.status == 422) {
		console.log(error.status == 422);
		
		toast.error('The role name has already been taken.');
	}
    else{
		toast.error('Error creating role. Please try again.');}
    // Handle error (e.g., show a notification to the user)
  }
};

const getPermissions = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/permissions');
  const permissionsData = response.data;

  // Group permissions by group_name
  permissionsData.forEach(permission => {
    if (!groupedPermissions.value[permission.group_name]) {
      groupedPermissions.value[permission.group_name] = [];
    }
    groupedPermissions.value[permission.group_name].push(permission);
  });
};

const toggleGroupPermissions = (groupName) => {
  const permissionsInGroup = groupedPermissions.value[groupName];
  const allSelected = permissionsInGroup.every(permission => selectedPermissions.value.includes(permission.name));

  if (allSelected) {
    // If all are selected, deselect them
    permissionsInGroup.forEach(permission => {
      const index = selectedPermissions.value.indexOf(permission.name);
      if (index > -1) {
        selectedPermissions.value.splice(index, 1);
      }
    });
  } else {
    // If not all are selected, select them
    permissionsInGroup.forEach(permission => {
      if (!selectedPermissions.value.includes(permission.name)) {
        selectedPermissions.value.push(permission.name);
      }
    });
  }
};

const updateGroupSelection = (groupName) => {
  const permissionsInGroup = groupedPermissions.value[groupName];
  const allSelected = permissionsInGroup.every(permission => selectedPermissions.value.includes(permission.name));
  const anySelected = permissionsInGroup.some(permission => selectedPermissions.value.includes(permission.name));

  // If all permissions are selected, check the group checkbox
  if (allSelected) {
    // Do nothing, already handled by the group checkbox
  } else if (anySelected) {
    // If some are selected, the group checkbox should remain unchecked
  } else {
    // If none are selected, the group checkbox should be unchecked
  }
};

const isGroupSelected = (groupName) => {
  const permissionsInGroup = groupedPermissions.value[groupName];
  return permissionsInGroup.every(permission => selectedPermissions.value.includes(permission.name));
};

onMounted(getPermissions);
</script>
<template>
<div class="card border-top border-0 border-4 border-danger">
	<div class="card-body p-5">
		<div class="card-title d-flex align-items-center">
			<div><i class="bx bxs-user me-1 font-22 text-danger"></i>
			</div>
			<h5 class="mb-0 text-danger">Create Role</h5>
		</div>
		<hr>
		<p class="text-muted">This page allows you to create a new role and assign specific permissions to it. Fill in the role name and description, and select the permissions that this role should have.</p>
		<form class="row g-3" @submit.prevent="handleSubmit">
			<div class="col-md-12">
				<label for="rolename" class="form-label">Role Name</label>
				<div class="input-group"> <span class="input-group-text bg-transparent"><i class="bx bxs-user"></i></span>
					<input type="text" class="form-control border-start-0" id="rolename" placeholder="Role Name" v-model="roleName">
				</div>
				<div v-if="roleNameError" class="text-danger mt-1">{{ roleNameError }}</div>
			</div>
			<div class="col-md-12">
				<label for="description" class="form-label">Description:<span class="text-muted">(optional)</span></label>
				<div class="input-group"> <span class="input-group-text bg-transparent"><i class="bx bxs-info-circle"></i></span>
					<input type="text" class="form-control border-start-0" id="description" placeholder="Description">
				</div>
			</div>
			<h6 class="mt-4">Assign Permissions to This Role</h6>
			<div class="col-md-12">
				<div v-for="(permissions, groupName) in groupedPermissions" :key="groupName" class="border rounded p-3 mb-3">
					<h6 class="d-flex align-items-center">
						<input type="checkbox" :id="'group-' + groupName" @change="toggleGroupPermissions(groupName)" :checked="isGroupSelected(groupName)" class="me-2" />
						<label :for="'group-' + groupName" class="fw-bold">{{ groupName }}</label>
					</h6>
					<div class="d-flex flex-wrap">
						<span v-for="permission in permissions" :key="permission.id" class="form-check me-3">
							<input class="form-check-input" type="checkbox" :value="permission.name" :id="'permission' + permission.id" v-model="selectedPermissions" @change="updateGroupSelection(groupName)" />
							<label class="form-check-label" :for="'permission' + permission.id">{{ permission.name.charAt(0).toUpperCase() + permission.name.slice(1) }}</label>
						</span>
					</div>
				</div>
			</div>
			
			<div class="col-12 text-end">
				<button type="submit" class="btn btn-danger px-5">Save</button>
			</div>
		</form>
	</div>
</div>
  </template>
  