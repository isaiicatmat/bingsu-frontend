<template>
    <v-data-table
            :headers="headers" height="347px"
            fixed-header
            @dblclick:row="openIndividualExpense"
            :items="expenses" class="mx-8">
        <template v-slot:[`item.cardDateOut`]="{ item }">
            {{ getFmtDate(item.cardDateOut) }}
        </template>
        <template v-slot:[`item.cardDateIn`]="{ item }">
            {{ getFmtDate(item.cardDateIn) }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
            {{ getFmtAmount(item.amount) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon
            v-if="item.status !== 'ACCEPTED'"
            @click="$emit('openUpdateExpense', item.id)">
                <img src="../../assets/edit_icon.svg" style="width: 22px; height: 22px">
            </v-btn>
            <v-btn v-else icon disabled>
                <img src="../../assets/edit_icon_grey.svg" alt="edit icon grey" style="width: 22px; height: 22px">
            </v-btn>

            <v-btn icon @click="$emit('openDeleteExpense', item.id)">
                <img src="../../assets/delete_icon.svg" style="width:22px; height: 22px">
            </v-btn>
        </template>
    </v-data-table>

</template>

<script>
import {getFmtDate,getFmtAmount} from '@/services/utils';
import authService from "@/services/auth";

export default {
    name: "UserExpensesTable",
    data: () => {
        return {
            userRole: null,
            authService,
        }
    },
    computed: {
        headers() {
            if (this.userRole) {
                return [
                {
                    text: 'Concepto',
                    aling: 'start',
                    sortable: true,
                    value: 'concept',
                },
                {text: 'Monto', value: 'amount'},
                {text: this.userRole === 'admin' ? 'Fecha entregada': 'Fecha recibida', sortable: false, value: 'cardDateOut'},
                {text: this.userRole === 'admin' ? 'Fecha recibida' : 'Fecha entregada', sortable: false, value: 'cardDateIn'},
                {text: 'Acciones', sortable: false, value: 'actions'}
            ];
            } else {
                return [];
            }
        }
    },
    props: {
        expenses: {
            default: () => [],
            required: true,
        },
        userName: {
            type: String,
            default: null
        }
    },
    methods: {
        getFmtDate,
        getFmtAmount,
        openIndividualExpense(event, {item}) {
            this.$emit('openIndividualExpense', item.id);
        }
    },
    async mounted() {
        this.userRole = await authService.getRole();
    }
}
</script>

<style scoped>
</style>