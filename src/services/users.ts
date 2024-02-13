import {axiosInstance} from "@/plugins/axios";
import {User} from "@/modules/user/types";


export async function saveUser(user: User) {
    isPdfOrImg(user.ine);
    isPdfOrImg(user.birthCertificate);
    isPdfOrImg(user.bachelorCertificate);
    isPdfOrImg(user.addressCertificate);
    isPdfOrImg(user.avatar);
    await axiosInstance.post('/users', user);
}

export async function getUsers() {
    const response = await axiosInstance.get('/users');
    return response.data;
}

export async function getUser(id: string) {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
}

export async function updateUser(id: string, user: User) {
    const response = await axiosInstance.put(`/users/${id}`, user);
    return response.data;
}

export async function deleteUser(id: string) {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
}

function isPdfOrImg(fileContent: string){
    const mime_type = fileContent?.substring("data:".length, fileContent.indexOf(";base64"));
    if (!(mime_type?.includes('image') || mime_type?.includes('application/pdf'))){
        const errorC = {response: {data:{
            error: 'wrong_mimetype',
        }}}
        throw errorC;
    }

}
