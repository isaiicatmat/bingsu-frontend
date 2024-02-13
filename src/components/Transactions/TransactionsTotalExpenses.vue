<template>
    <v-col class="white mb-6 rounded-lg"
      style="max-width: 372px">
             <div class="mx-6 mt-1">
               <div class="d-flex align-center" >
                 <img :src="getImgUrl('wallet')" style="width: 38px; height: 38px;" class="mr-2 mb-4" v-if="monthTransactionAmounts">
                  <v-sheet v-else >
                    <v-skeleton-loader type="avatar" class="mr-2 mb-4" id="sk_avatar_wallet"></v-skeleton-loader>
                  </v-sheet>
                 <div>
                   <p class="text-lg-h6 font-weight-bold mb-0 mt-1" style="line-height: 1"  v-if="monthTransactionAmounts">
                    Resumen de gastos
                  </p>
                  <v-sheet v-else >
                    <v-skeleton-loader type="list-item" id="sk_gastos_title_line"></v-skeleton-loader>
                  </v-sheet>

                  <p v-if="monthTransactionAmounts" class="mt-0 d-flex align-center mr-0" style="color:#95999a"> <img :src="getImgUrl('arrow')" style="width: 18px"><span class="font-weight-bold" :style="getImgUrl('color')"> {{ monthDifference }} % {{ getImgUrl('stats') }} &nbsp;</span> que el mes pasado</p>
                  <v-sheet v-else >
                    <v-skeleton-loader type="list-item" style="margin: 0 0 8px 0;" id="sk_gastos_line"></v-skeleton-loader>
                  </v-sheet>
                 </div>
               </div>


               <MonthTransactionChart class="month-chart-container mx-8 mb-3"
                              v-if="monthTransactionAmounts"
                              :month-transaction-amounts="monthTransactionAmounts"
                              :chart-color1="chartColor1"
                              :chart-color2="chartColor2"
                              :solid-color="solidColor"
                              >
               </MonthTransactionChart>
                <v-sheet v-else >
                  <v-skeleton-loader type="image" :style="{'height': sevenTwentyHieght ? '114px' : '118px', 'width': '235.556px', 'margin': '0px 32px 12px 32px'} " ></v-skeleton-loader>
                </v-sheet>
                <AllExpenses :total-amount="totalAmount" v-if="monthTransactionAmounts"></AllExpenses>
                <v-sheet v-else >
                  <v-skeleton-loader id="sk_one_line" type="list-item" style="width: 35%; margin: 12px 0 12px 0;" ></v-skeleton-loader>
                </v-sheet>


             </div>
      </v-col>
</template>

<script>

import AllExpenses from "@/components/Transactions/TransactionCard";
import MonthTransactionChart from "@/components/UserTransactions/MonthTransactionChart"

export default{
    name: "TransactionsTotalExpenses",
    data: () => {
    return {
      sevenTwentyHieght: window.innerHeight <= 720,
      }
    },
    props:{
      totalAmount: {
        default: -1,
        type: Number
      },
      monthStatus:{
        default: null,
        type: String
      },
      monthDifference: {
        default: 0,
        type: Number
      },
      monthTransactionAmounts: {
        default: null,
        type: Array
      },
      chartColor1: {
        default: '',
        type: String
      },
      chartColor2: {
        default: '',
        type: String
      },
      solidColor:{
        default: '',
        type: String
      }

    },
    components:{
      MonthTransactionChart,
      AllExpenses
    },
    methods: {
      getImgUrl(typeOfPic){
      if(this.monthStatus == 'GOOD'){
        switch (typeOfPic){
          case 'stats':
            return 'menos';
          case 'arrow':
            return require('../../assets/green_arrow.jpg');
          case 'wallet':
            return require('../../assets/green_wallet.jpg');
          case 'color':
            return 'color:#00A123';
          default:
            return '#00A123';
        }

      }else{
        switch (typeOfPic){
          case 'stats':
            return 'más';
          case 'arrow':
            return require('../../assets/red_arrow.jpg');
          case 'wallet':
            return require('../../assets/red_wallet.jpg');
          case 'color':
            return 'color:#F5223B';
          default:
            return '#F5223B';
        }
      }
    }
    }
}
</script>
