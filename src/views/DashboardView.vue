<template>
  <div>

    <v-row class="rounded-lg mb-5">
      <v-col class="pr-2" :style="$vuetify.breakpoint.xsOnly ? '' : 'max-width: 42%'">
        <v-card class="rounded-lg mb-4"
                outlined>
          <div class="text-container">
            <div class="d-flex flex-column">
              <v-card-title class="font-weight-black mb-3 pb-3" style="letter-spacing: -0.25px">
                Fecha de hoy
              </v-card-title>
              <v-card-subtitle class="font-weight-black d-block" style="letter-spacing: -1px">
                <div style="font-size: 1rem;" class="text-body-2 pl-3">
                  {{
                    new Date().toLocaleDateString('es-MX', {month: 'long', day: 'numeric', year: 'numeric'})
                  }}
                </div>
              </v-card-subtitle>
            </div>
          </div>
        </v-card>

        <v-card v-if="currentBirthDays.length > 0"
                class="rounded-lg mb-4"
                outlined>
          <div class="text-container">
            <div class="d-flex flex-column">
              <v-card-title class="font-weight-black mb-3" style="letter-spacing: -0.25px">
                {{ currentBirthDays.length }} cumpleaños este mes
              </v-card-title>

              <v-card-subtitle>
                <v-item-group v-for="(item, index) in currentBirthDays"
                              :key="item.id"
                              :item="item"
                              class="d-flex">
                  <div class="d-flex justify-space-between mb-3 ml-3"
                       style="width: 100%">
                    <div class="d-flex">
                      <v-avatar :color="colorAvatar[index % 4]">
                        <p class="d-flex align-center justify-center font-weight-bold mb-0"
                           style="color: white">
                          {{ year - new Date((item.birthday._seconds + 30000) * 1000).toLocaleDateString('es-MX', {year: 'numeric'}) }}
                        </p>
                      </v-avatar>

                      <div class="d-flex flex-column ml-2">
                        <h2 class="text-capitalize"
                            style="font-size: 1rem; letter-spacing: -1px">
                          {{ item.name + ' ' + item.firstLastName }}
                        </h2>

                        <div class="d-flex grey--text font-weight-regular"
                             style="font-size: 0.8rem; text-transform: lowercase;">
                          {{
                            new Date((item.birthday._seconds + 30000) * 1000).toLocaleDateString('es-MX', {
                              month: 'long',
                              day: 'numeric'
                            })
                          }}
                        </div>
                      </div>
                    </div>


                    <img
                        v-if="new Date((item.birthday._seconds +30000) * 1000).toLocaleDateString('es-MX', { month: 'numeric', day: 'numeric' }) == todayDayMonth"
                        alt="cake icon"
                        height="48px"
                        src="../assets/cake_loader.gif"
                        width="48px">
                  </div>
                </v-item-group>
              </v-card-subtitle>
            </div>
          </div>
        </v-card>

        <v-card v-if="nextBirthDays.length > 0"
                class="rounded-lg"
                outlined>
          <div class="text-container">
            <div class="d-flex flex-column">
              <v-card-title class="font-weight-black mb-3" style="letter-spacing: -0.25px">
                {{ nextBirthDays.length }} cumpleaños el mes siguiente
              </v-card-title>

              <v-card-subtitle>
                <v-item-group v-for="(item, index) in nextBirthDays"
                              :key="item.id"
                              :item="item"
                              class="d-flex">
                  <div class="d-flex mb-3 ml-3">
                    <v-avatar :color="colorAvatar[index % 4]">
                      <p class="d-flex align-center justify-center font-weight-bold mb-0"
                         style="color: white">
                        {{ year - new Date((item.birthday._seconds + 30000) * 1000).toLocaleDateString('es-MX', {year: 'numeric'}) }}
                      </p>
                    </v-avatar>
                    <div class="d-flex flex-column ml-2">
                      <h2 class="text-capitalize"
                          style="font-size: 1rem; letter-spacing: -0.5px !important;">
                        {{ item.name + ' ' + item.firstLastName }}
                      </h2>
                      <div class="d-flex grey--text font-weight-regular text-lowercase" style="font-size: 0.8rem;">
                        {{
                          new Date((item.birthday._seconds + 30000) * 1000).toLocaleDateString('es-MX', {
                            month: 'long',
                            day: 'numeric'
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </v-item-group>
              </v-card-subtitle>

            </div>
          </div>
        </v-card>
      </v-col>

<!--      <v-col style="padding-left: 8px !important; max-width: 27%">-->
<!--        <v-card v-if="userRole === 'user'"-->
<!--                class="rounded-lg mb-4"-->
<!--                outlined>-->
<!--          <v-card-title class="font-weight-black pb-2">Asistencia</v-card-title>-->
<!--          <v-row class="d-flex ml-3 mb-4 mt-1">-->
<!--            <v-card-subtitle class="px-1 grey&#45;&#45;text pt-1 pl-4 pb-4">Has marcado asistencia</v-card-subtitle>-->
<!--            <v-card-subtitle class="px-0 font-weight-black pt-1">{{ this.dayCheckIns.length }}</v-card-subtitle>-->
<!--            <v-card-subtitle class="px-1 grey&#45;&#45;text pt-1">días este mes</v-card-subtitle>-->
<!--          </v-row>-->
<!--          <div class="text-container d-flex justify-center ma-2">-->
<!--            <div class="d-flex flex-column justify-center">-->
<!--              <div>-->
<!--                <div class="d-flex flex-column justify-center">-->

<!--                  <v-row class="row-limit d-flex justify-center">-->
<!--                    <div v-for="n in 7"-->
<!--                         :key="n"-->
<!--                         class="square font-weight-black">-->
<!--                      {{ n === 1 ? 'Do' : '' }}-->
<!--                      {{ n === 2 ? 'Lu' : '' }}-->
<!--                      {{ n === 3 ? 'Ma' : '' }}-->
<!--                      {{ n === 4 ? 'Mi' : '' }}-->
<!--                      {{ n === 5 ? 'Ju' : '' }}-->
<!--                      {{ n === 6 ? 'Vi' : '' }}-->
<!--                      {{ n === 7 ? 'Sá' : '' }}-->
<!--                    </div>-->
<!--                  </v-row>-->
<!--                  <v-row class="row-limit justify-center">-->
<!--                    <div v-for="n in calendarDays"-->
<!--                         :key="n">-->
<!--                      <div v-if="checkInDays.includes( n - firstDayMonth + 1)">-->
<!--                        <img class="img-limit" src="../assets/bingsu_active.svg">-->
<!--                      </div>-->
<!--                      <div v-else>-->
<!--                        <img class="img-limit" src="../assets/bingsu_disabled.svg">-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </v-row>-->

<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <v-row-->
<!--              class="d-flex justify-end ma-6">-->

<!--            <v-btn v-if="(dayWeek === 0) || (dayWeek === 6)"-->
<!--                   class="px-6"-->
<!--                   depressed-->
<!--                   disabled>Marcar asistencia-->
<!--            </v-btn>-->
<!--            <v-btn v-else-if=" !checkInDays.includes(actualDay)"-->
<!--                   class="px-6"-->
<!--                   color="primary"-->
<!--                   depressed-->
<!--                   @click="addCheckIn">Marcar asistencia-->
<!--            </v-btn>-->
<!--            <v-btn v-else-->
<!--                   class="px-6"-->
<!--                   depressed-->
<!--                   disabled-->
<!--                   style="background-color: #96D8A4 !important">¡Bien hecho!-->
<!--            </v-btn>-->

<!--          </v-row>-->
<!--        </v-card>-->
<!--        <CheckInResumeTable v-if="userRole === 'admin' || userRole === 'maintainer'"-->
<!--                            :usersDictionary="usersDictionary">-->
<!--        </CheckInResumeTable>-->
<!--      </v-col>-->

<!--      <v-col style="max-width: 27%; padding-left: 8px !important;">-->

<!--        <v-card v-if="winner"-->
<!--                class="rounded-lg mb-4"-->
<!--                outlined>-->
<!--          <div class="text-container justify-space-between">-->
<!--            <v-card-title class="font-weight-black mb-3"-->
<!--                          style="letter-spacing: -0.25px">-->
<!--              <div class="d-flex">-->
<!--                <svg fill="none" height="32" viewBox="0 0 30 30" width="24"-->
<!--                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
<!--                  <mask id="mask0_785_3745" height="30" maskUnits="userSpaceOnUse" style="mask-type:alpha" width="30" x="0"-->
<!--                        y="0">-->
<!--                    <path clip-rule="evenodd"-->
<!--                          d="M30 0H0V30H30V0ZM15.5613 15.4775L15 13.75L14.4387 15.4775H12.6224L14.0918 16.5451L13.5305 18.2725L15 17.2049L16.4695 18.2725L15.9082 16.5451L17.3776 15.4775H15.5613Z"-->
<!--                          fill="url(#pattern0)" fill-rule="evenodd"/>-->
<!--                  </mask>-->
<!--                  <g mask="url(#mask0_785_3745)">-->
<!--                    <rect fill="url(#paint0_linear_785_3745)" height="29.6875" width="38.4375" x="-6.25" y="-0.9375"/>-->
<!--                  </g>-->
<!--                  <defs>-->
<!--                    <pattern id="pattern0" height="1" patternContentUnits="objectBoundingBox" width="1">-->
<!--                      <use transform="scale(0.0104167)" xlink:href="#image0_785_3745"/>-->
<!--                    </pattern>-->
<!--                    <linearGradient id="paint0_linear_785_3745" gradientUnits="userSpaceOnUse" x1="29.0625" x2="-6.25"-->
<!--                                    y1="28.75" y2="1.25">-->
<!--                      <stop stop-color="#F5C322"/>-->
<!--                      <stop offset="1" stop-color="#FEE491"/>-->
<!--                    </linearGradient>-->
<!--                    <image id="image0_785_3745" height="96" width="96"-->
<!--                           xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFGklEQVR4nO3czW4bVRQH8P8ZmyZ22obAtimyY4HULBokFtDECWUBUkSXWZGnoJuiIqV9gNBVX4DApmFHhUBR1fqDBAlBs2kkKteBGLGClMaxiVV7Dotm0tTj8dx7x5/1+S1978wcnZO5M+fKMSCEEEIIIYQQQgghBgV1OwAT5dTEOIf4BjE+BAAG7tSIr5ye2f6t27Hp6rsClFMT42zxJoDX6oYek03no3OPCt2Iy5TV7QB0cYhvwJ18ABhjC8udjieoviuAs+w0xh91LpLW6LsCMMFuMtxsrCf1XQHAuOM9SGudC6Q1+q4AIeAzALsNhv4OIXSl0/EE1XcFGE7mHzLjy/rPmbAynHyY70ZMQfTfa2h6YpqJ7wEI1w1Vyaa56Nyj9W7EZaqvCrC7Fh8dGsZ9ADGPKdsHr1hTr7+b2+tkXEH01RI0PISb8E4+AMQiVftmp+Jphb4pwH46tsiET/zmMWNxPxv3ndcrGi5BvbbX8l/qjZhthTYBnFY6gPDEqtXejsz9sd3eyBrTyZ+rAL2218J33w+XwzspABc0D12PVs/O0cV71XbE5UU3f64lqNf2Wsrhnc+hn3wAuHB4bEfp5s9VgF7aaymnJ6YBXA1wiqvl1IRJ8Yzp5k/3IVzRnG9sdy0+ysQrcL/v6wizxV/trsVHWxWXHwYOPAcJXP+RewlCk70WwolSJr5UTCfOmQaoSuGVU1Xs8FxtVUwnzpUy8SUQTnjNYaYf6j9zPYT3srG3QkwbAMZ8rvkAwKrN1uqp2dyWdsRN7Kdji0S00spzMmHx5Ez+61aes5hOnLPIXgCwAGCyeQD8D9VCU9GLuT+Pf+z9Gmph+XDNCgOI+sTSsmJov3Kq27Ps2lTQV1OtpANlAFUGfW9V6XJ98gGFrQj+LjFUPmX/C2BYMcYtPCvGLd1iBHjlVLwAfo5Gx6bpnV+e6hx2kHkzbqN6iZ8lfVrxsEq0aI3SfK7pc1NpL6iUjq2D6D3FCx+nVYxSJn4NwJLBdXRcG0nmr/tNMkz6c8wbI7Pbvn9ISgXYz8SXCfhUO4gXbRHwLRFuR2by2frBJrucrWZbbH8Qmf09VT9QzCYmie2PCbgEk6Qfw8AXJ5P5y37zlApQzsQWGHQrSEAv4jwDt0NEq5GZfFZhl7PVCk9RPf9qcudxMZuYtPhoTW/Z2x0xL0Rnt7/xnadysvLdxBkO2+3agngA4Anate57WwcwCv8HqRGqWuONHrqueaonLGXiBQBnAkU1OAojyfxZlYkanTBtmEYzaFgjV8oFIGYpgCKL1HOlfgdYthRAmf2T6kzlAkT2wvfRbKNJOCqHuVKivgTN5ypgVj7xwGL+1a/7PU5rO5otUr61BhWT3suKVgEseRD70s2R3h1A1R/1whlAtZDWKqFVgJGZwl8AfLu7AVZQ6X6PM/hekDRkXnQaMId2AaQh86bTgB0do38Vaci8qTdgDu0CSEPmSasBc+gvQdKQNabZgDmMvpwrDZmbbgPmMCqANGRupjkxuwOkIXPTbMAcRgWQhsxFuwFzBPgHDWnIHCYNmMO4ANKQPWfSgB0da35VaciOsHkujAtw2HR07OvqPawSKYY3TQ82X4LmcxWApCEzbMAcgf5LkgOsfS8L0wbMEagA0pAFz0HAO0AaMtMGTAghhBBCCDG4Av9kWSkTd/3+wSAZSeYD5bBvfjHrZSUF6DIpQJdJAbpMCtBlUoAukwIIIYQQQgghhBBCCCGEEEK02f/yNPHsMpUbAgAAAABJRU5ErkJggg=="/>-->
<!--                  </defs>-->
<!--                </svg>-->
<!--                <span class="ml-2">Ganador mes pasado</span>-->
<!--              </div>-->
<!--            </v-card-title>-->
<!--            <v-card-subtitle>-->
<!--              <div class="d-flex pl-3">-->
<!--                <v-avatar-->
<!--                    color="primary"-->
<!--                    size="48">-->
<!--                  <span class="white&#45;&#45;text text-subtitle-1">{{ winner.name[0] }}</span>-->
<!--                </v-avatar>-->
<!--                <h2 class="mx-2 text-capitalize d-flex align-center"-->
<!--                    style="font-size: 1rem; letter-spacing: -1px"-->
<!--                >{{ winner.name + ' ' + winner.firstLastName }}</h2>-->
<!--              </div>-->
<!--            </v-card-subtitle>-->
<!--          </div>-->
<!--        </v-card>-->
<!--      </v-col>-->

    </v-row>

    <v-dialog v-model="updateDialog"
              transition="dialog-bottom-transition"
              width="800">
      <v-card width="800">

        <h2 div class="font-weight-black  pt-10 ml-10" style="text-transform: capitalize">Bingsu 2.0</h2>

        <v-card-subtitle class="ml-4" style="color: #95999A; font-size: 1rem;">Prueba las nuevas actualizaciones</v-card-subtitle>
        <v-item-group class="pb-10">

          <div  class="d-flex align-center mb-4 ml-14 mt-6"
                style="width: 90%">
            <div class="d-flex mr-3">
              <v-avatar color="#F5C322"><img src="../assets/dashboard_icon.svg" style="width: 20px;" ></v-avatar>
            </div>
            <div class="d-flex flex-column ml-2">
              <h3>Dashboard</h3>
              <caption class="text-left" style="color: #95999A;">Se centralizó la información que necesita ser vista por todos</caption>
            </div>
          </div>

          <div  class="d-flex align-center mb-4 ml-14 mt-6"
                style="width: 90%">
            <div class="d-flex mr-3">
              <v-avatar color="#F5223B"><img src="../assets/birthday_icon.svg" style="width: 20px;" ></v-avatar>
            </div>
            <div class="d-flex flex-column ml-2">
              <h3>Cumpleaños</h3>
              <caption class="text-left" style="color: #95999A;">Los cumpleaños correspondientes al mes actual y al siguiente aparecerán en el <br>dashboard</caption>
            </div>
          </div>

<!--          <div  class="d-flex align-center mb-4 ml-14 mt-6"-->
<!--                style="width: 90%">-->
<!--            <div class="d-flex mr-3">-->
<!--              <v-avatar color="#17A3EB"><img src="../assets/trophy_icon.svg" style="width: 20px;" ></v-avatar>-->
<!--            </div>-->
<!--            <div class="d-flex flex-column ml-2">-->
<!--              <h3>Recompensas</h3>-->
<!--              <caption class="text-left" style="color: #95999A; ">Los usuarios que hagan check-in todos los días laborales recibirán una recompensa</caption>-->
<!--            </div>-->
<!--          </div>-->

          <div  class="d-flex align-center mb-4 ml-14 mt-6"
                style="width: 90%">
            <div class="d-flex mr-3">
              <v-avatar color="#051E26"><img src="../assets/credit_card_icon.svg" style="width: 20px;" ></v-avatar>
            </div>
            <div class="d-flex flex-column ml-2">
              <h3>Uso de la tarjeta de crédito</h3>
              <caption class="text-left" style="color: #95999A; ">Se habilitó la subida de gastos hechos por la tarjeta empresarial</caption>
            </div>
          </div>

          <div  class="d-flex align-center mb-4 ml-14 mt-6"
                style="width: 90%">
            <div class="d-flex mr-3">
              <v-avatar color="#F5C322"><img src="../assets/checkbox_icon.svg" style="width: 20px;" ></v-avatar>
            </div>
            <div class="d-flex flex-column ml-2">
              <h3>Transacciones especiales</h3>
              <caption class="text-left" style="color: #95999A; ">Ahora se pueden agregar transacciones que no requieren factura o XML</caption>
            </div>
          </div>

        </v-item-group>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
import authService from "@/services/auth";
import {mapActions, mapMutations} from 'vuex';
// import CheckInResumeTable from "@/components/CheckIn/CheckInResumeTable";

export default {
  name: "DashboardView",
  components: {},

  data: () => {
    return {
      checkIn: {
        date: new Date().toISOString(),
      },
      userRole: null,
      updateDialog: false,
      authService: authService,
      users: [],
      thisMonthBirthdays: [],
      nextMonthBirthday: [],
      dayCheckIns: [],
      pastMonthCheckIns: [],
      checkInDays: [],
      colorAvatar: ['#051E26', '#F5C322', '#F5223B', '#17A3EB'],
    }
  },
  computed: {
    firstDayMonth() {
      return new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
    },
    todayDayMonth() {
      return new Date().toLocaleDateString('es-MX', {month: 'numeric', day: 'numeric'})
    },
    year() {
      return new Date().getFullYear()
    },
    actualDay() {
      return +new Date().toLocaleDateString('es-MX', {day: 'numeric'})
    },
    calendarDays() {
      return [...Array(42).keys()]
    },
    dayWeek() {
      return +new Date(new Date()).getDay()
    },
    currentBirthDays() {
      let actualMonth = new Date().getMonth();
      let usersBirthday = [];
      this.users.forEach((user) => {
        if (!user.disabled){
          const currentUserBirthDayMonth = Number(new Date(user.birthday._seconds * 1000).toISOString().split('-')[1]) - 1;
          if (+currentUserBirthDayMonth === actualMonth) {
            usersBirthday.push(user);
          }
        }
      });
      return usersBirthday;
    },
    nextBirthDays() {
      let actualMonth = new Date().getMonth();
      let usersBirthday = [];
      this.users.forEach((user) => {
        const currentUserBirthDayMonth = Number(new Date(user.birthday._seconds * 1000).toISOString().split('-')[1]) - 1;
        if (+currentUserBirthDayMonth === (actualMonth + 1)) {
          usersBirthday.push(user);
        }
      });
      return usersBirthday;
    },
    usersDictionary() {
      let usersMap = new Map();

      this.users.forEach(user => {
        usersMap.set(user.id, user);
      });

      return usersMap;
    },
    winner() {
      let winnersMap = new Map();
      let maxValue = 1;
      let currentWinner = null;

      this.pastMonthCheckIns.forEach((checkIn) => {
        if (winnersMap.has(checkIn.uid)) {

          if (maxValue < winnersMap.get(checkIn.uid).counter + 1) {
            maxValue++;
          }

          winnersMap.set(checkIn.uid, {
            counter: winnersMap.get(checkIn.uid).counter + 1,
            score: winnersMap.get(checkIn.uid).score + +checkIn.date._seconds,
          });
        } else {
          winnersMap.set(checkIn.uid, {
            counter: 1,
            score: +checkIn.date._seconds,
          });
        }
      });

      winnersMap.forEach((value, key, map) => {
        if (value.counter === maxValue) {
          if (currentWinner && map.get(currentWinner).score > map.get(key).score) {
            currentWinner = key;
          } else if (!currentWinner) {
            currentWinner = key;
          }
        }
      });

      return this.usersDictionary.get(currentWinner);
    }
  },
  methods: {
    ...mapActions([
      'GET_USERS',
      'SAVE_CHECK_IN',
      'GET_CHECK_INS'
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT',
    ]),
    async addCheckIn(checkIn) {
      try {
        this.SET_LOADING(true);
        checkIn.uid = authService.user.uid;
        checkIn.date = this.checkIn.date;
        await this.SAVE_CHECK_IN(checkIn);
        await this.getThisMonthCheckIns();
        await this.counterMonthDays();
        this.SHOW_SUCCESS_ALERT("¡Gracias por hacer visitarnos hoy!");
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async counterMonthDays() {
      this.checkInDays = [];
      for (let i = 0; i < this.dayCheckIns.length; i++) {
        const currentDate = new Date((this.dayCheckIns[i].date._seconds) * 1000);
        this.checkInDays.push(currentDate.getDate());
      }
    },
    async getThisMonthCheckIns() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        this.dayCheckIns = await this.GET_CHECK_INS({userId: authService.user.uid, startDate, endDate});
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getPastMonthCheckIns() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        this.pastMonthCheckIns = await this.GET_CHECK_INS({startDate, endDate});
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    setPopUpShowingTime() {
      let popUpWasShowed = localStorage.getItem('showedPopUp');
      if (!popUpWasShowed) {
        this.updateDialog = true;
        localStorage.setItem('showedPopUp', 'yes');
      } else {
        this.updateDialog = false;
      }
    },
  },
  async mounted() {
    try {
      this.SET_LOADING(true);
      this.users = await this.GET_USERS();
      // await this.getThisMonthCheckIns();
      // await this.getPastMonthCheckIns();
      // await this.counterMonthDays();
      this.userRole = await authService.getRole();
      this.setPopUpShowingTime();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
      this.SET_LOADING(false);
    }
  }
}
</script>

<style>
.square {
  font-size: 12px;
  width: 40px;
  height: 40px;
  padding: 10px;
}

.row-limit {
  max-width: 300px
}

.img-limit {
  height: 40px;
  width: 40px;
  padding: 8px;
}

</style>
