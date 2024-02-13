<template>
    <div>
        <div class="row white rounded-lg">
            <div class="col-12 mx-3">
                <div class="d-flex pa-4 justify-start">
                    <p class="text-lg-h6 font-weight-bold">¿Tienes alguna pregunta?</p>
                </div>
                <div    
                        class="d-flex mx-16 mb-4 justify-end">
                    <v-btn
                        v-if="userRole === 'admin' || userRole === 'maintainer' || userRole === 'human_resources'"
                        style="height: 32px"
                        href="https://drive.google.com/uc?export=download&id=1zubDoJ00f7owkTs3r7neAGXBTknPIbFF"
                        small
                        outlined
                        color="primary"
                        class="white--text">
                        Manual de administrador
                        <v-icon
                            right
                            dark>
                            mdi-cloud-download
                        </v-icon>
                    </v-btn>
                    <v-btn
                        v-if="userRole === 'user'"
                        style="height: 32px"
                        href="https://drive.google.com/uc?export=download&id=1hN_w5svS2Izmly2wN_0DHg82qQMGi9sT"
                        small
                        outlined
                        color="primary"
                        class="white--text">
                        Manual de usuario
                        <v-icon
                            right
                            dark>
                            mdi-cloud-download
                        </v-icon>
                    </v-btn>
                </div>
                <div    class="mx-16"
                        style="height: 74.7vh">
                    <template>
                        <v-expansion-panels
                            flat>
                            <v-expansion-panel
                                class="rounded-lg ma-1"
                                style="border-style: solid; border-width: thin; border-color: #B3C6CC;">
                                <v-expansion-panel-header class="font-weight-bold" style="padding:20px 24px;">
                                    ¿Cómo recuperar mi contraseña en caso de olvidarla?
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="mx-6 ">
                                    Si olvidas tu contraseña envía un correo al equipo de IT para reestablecerla. Ellos te indicarán 
                                    el procedimiento.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel
                                class="rounded-lg ma-1"
                                style="border-style: solid; border-width: thin; border-color: #B3C6CC; ">
                                <v-expansion-panel-header class="font-weight-bold" style="padding:20px 24px;">
                                    ¿Es obligatorio subir archivos de facturación al cargar un gasto?
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="mx-6">
                                    No, solo es necesario que subas una factura o un ticket en formato PDF. ¡El XML es opcional! 
                                    Pero si gustas, puedes subirlo sin problemas.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel
                                class="rounded-lg ma-1"
                                style="border-style: solid; border-width: thin; border-color: #B3C6CC;">
                                <v-expansion-panel-header class="font-weight-bold" style="padding:20px 24px;">
                                    ¿Se puede eliminar un permiso?
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="mx-6">
                                    Sí, pero solo los permisos pendientes.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel
                                class="rounded-lg ma-1"
                                style="border-style: solid; border-width: thin; border-color: #B3C6CC;">
                                <v-expansion-panel-header class="font-weight-bold" style="padding:20px 24px;">
                                    Recibí más dinero para viáticos, ¿cómo lo registro?
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="mx-6">
                                    El único que puede modificar esta cantidad es el administrador del sistema. Comunícate con él para 
                                    que modifique dicha cantidad.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel
                                class="rounded-lg ma-1"
                                style="border-style: solid; border-width: thin; border-color: #B3C6CC;">
                                <v-expansion-panel-header class="font-weight-bold" style="padding:20px 24px;">
                                    ¿Qué diferencia hay entre un permiso y las vacaciones?
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="mx-6">
                                    Un permiso hace referencia a un permiso ocasional que está a consideración del dueño de la empresa, mientras que las 
                                    vacaciones son aquellas asignadas por ley.
                                    En ambos casos deben ser autorizados por el administrador de la plataforma antes de ser tomadas.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import authService from "@/services/auth";
import {mapMutations} from 'vuex';

export default {
    name: "HelpView",

    data: () => {
        return {
            authService: authService,
            userRole: null,
        }
    },
    methods: {
        ...mapMutations([
            'SET_LOADING',
        ]),
    },
    async mounted() {
        try {
            this.SET_LOADING(true);
            this.userRole = await authService.getRole();
        } catch (e) {
            this.SHOW_ERROR_ALERT(e.response.data.message);
        } finally {
            this.SET_LOADING(false);
        }
    }
}
</script>
