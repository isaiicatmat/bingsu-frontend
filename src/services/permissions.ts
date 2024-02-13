import {axiosInstance} from "@/plugins/axios";
import {Permission} from "@/modules/permission/types";

interface getPermissionsPayload {
    uid: string,
    startDate: string,
    endDate: string,
    type: string,
    status: string,
}

export async function savePermission(permission: Permission) {
    await axiosInstance.post('/permissions', permission);
}

export async function updatePermission(permission: Permission) {
    await axiosInstance.put(`/permissions/${permission.id}`, permission);
}

export async function deletePermission(id: string) {
    await axiosInstance.delete(`/permissions/${id}`);
}

export async function getPermission(id: string) {
    const response = await axiosInstance.get(`permissions/${id}`);
    return response.data;
}

export async function getPermissions(payload: getPermissionsPayload) {
    let endpoint = '/permissions?';

    if (payload.uid) {
        endpoint += `uid=${payload.uid}&`;
    }

    if (payload.startDate && payload.endDate) {
        endpoint += `lte=${payload.endDate}&gte=${payload.startDate}&`;
    }

    if (payload.type) {
        endpoint += `type=${payload.type}&`;
    }

    if (payload.status) {
        endpoint += `status=${payload.status}&`;
    }

    const response = await axiosInstance.get(endpoint);
    return response.data;
}
