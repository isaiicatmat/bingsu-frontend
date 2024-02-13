import Vue from 'vue';
import axios from "axios";

export default Vue.extend({
    methods: {
        getBase64FromFile(file: File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                }
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },
        async getFileToDownload (url: string) {
            const fileName = this.getFileNameFromSignedURL(url);
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const type = response.headers['content-type']
            const blob = new Blob([response.data], { type });
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName;
            link.click();
        },
        
        getFileNameFromSignedURL(signedURL: string) {
            const rx = /:(.*)\?/g;
            const replaceRegexp = /(\/\/.*\/)/g;
            const replacedURL = signedURL.replace(replaceRegexp, "") ?? [];
            const matches = rx.exec(replacedURL);
            return matches ? matches[1] : "";
        }
    }
})

export function isPdfOrXml(fileContent: string){
    const mime_type = fileContent?.substring("data:".length, fileContent.indexOf(";base64"));
    if (!(mime_type?.includes('application/xml') || mime_type?.includes('application/pdf') || mime_type?.includes('text/xml'))){
        const errorC = {response: {data:{
            message: 'wrong_mimetype',
        }}}
        throw errorC;
    }
}

export function isPDF(fileContent: string){
    const mime_type = fileContent?.substring("data:".length, fileContent.indexOf(";base64"));
    if (!(mime_type?.includes('application/pdf'))){
        const errorC = {response: {data:{
            message: 'wrong_mimetype',
        }}}
        throw errorC;
    }
}