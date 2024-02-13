<template>
  <v-card class="rounded-lg mb-4"
          outlined>
    <v-card-title class="font-weight-black mb-2 pb-0"
                  style="letter-spacing: -0.25px">
      Asistencia
    </v-card-title>

    <template>
      <v-data-table
          :headers="headers"
          :hide-default-footer="true"
          :items="attendanceList"
          class="mx-2 mb-4"
          :loading="attendanceList.length < 0"
          loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.counter`]="{ item }">
          <svg v-if="item.winner" fill="none" height="24" viewBox="0 0 30 30" width="24"
               xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <mask id="mask0_785_3745" height="30" maskUnits="userSpaceOnUse" style="mask-type:alpha" width="30" x="0"
                  y="0">
              <path clip-rule="evenodd"
                    d="M30 0H0V30H30V0ZM15.5613 15.4775L15 13.75L14.4387 15.4775H12.6224L14.0918 16.5451L13.5305 18.2725L15 17.2049L16.4695 18.2725L15.9082 16.5451L17.3776 15.4775H15.5613Z"
                    fill="url(#pattern0)" fill-rule="evenodd"/>
            </mask>
            <g mask="url(#mask0_785_3745)">
              <rect fill="url(#paint0_linear_785_3745)" height="29.6875" width="38.4375" x="-6.25" y="-0.9375"/>
            </g>
            <defs>
              <pattern id="pattern0" height="1" patternContentUnits="objectBoundingBox" width="1">
                <use transform="scale(0.0104167)" xlink:href="#image0_785_3745"/>
              </pattern>
              <linearGradient id="paint0_linear_785_3745" gradientUnits="userSpaceOnUse" x1="29.0625" x2="-6.25"
                              y1="28.75" y2="1.25">
                <stop stop-color="#F5C322"/>
                <stop offset="1" stop-color="#FEE491"/>
              </linearGradient>
              <image id="image0_785_3745" height="96" width="96"
                     xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFGklEQVR4nO3czW4bVRQH8P8ZmyZ22obAtimyY4HULBokFtDECWUBUkSXWZGnoJuiIqV9gNBVX4DApmFHhUBR1fqDBAlBs2kkKteBGLGClMaxiVV7Dotm0tTj8dx7x5/1+S1978wcnZO5M+fKMSCEEEIIIYQQQgghBgV1OwAT5dTEOIf4BjE+BAAG7tSIr5ye2f6t27Hp6rsClFMT42zxJoDX6oYek03no3OPCt2Iy5TV7QB0cYhvwJ18ABhjC8udjieoviuAs+w0xh91LpLW6LsCMMFuMtxsrCf1XQHAuOM9SGudC6Q1+q4AIeAzALsNhv4OIXSl0/EE1XcFGE7mHzLjy/rPmbAynHyY70ZMQfTfa2h6YpqJ7wEI1w1Vyaa56Nyj9W7EZaqvCrC7Fh8dGsZ9ADGPKdsHr1hTr7+b2+tkXEH01RI0PISb8E4+AMQiVftmp+Jphb4pwH46tsiET/zmMWNxPxv3ndcrGi5BvbbX8l/qjZhthTYBnFY6gPDEqtXejsz9sd3eyBrTyZ+rAL2218J33w+XwzspABc0D12PVs/O0cV71XbE5UU3f64lqNf2Wsrhnc+hn3wAuHB4bEfp5s9VgF7aaymnJ6YBXA1wiqvl1IRJ8Yzp5k/3IVzRnG9sdy0+ysQrcL/v6wizxV/trsVHWxWXHwYOPAcJXP+RewlCk70WwolSJr5UTCfOmQaoSuGVU1Xs8FxtVUwnzpUy8SUQTnjNYaYf6j9zPYT3srG3QkwbAMZ8rvkAwKrN1uqp2dyWdsRN7Kdji0S00spzMmHx5Ez+61aes5hOnLPIXgCwAGCyeQD8D9VCU9GLuT+Pf+z9Gmph+XDNCgOI+sTSsmJov3Kq27Ps2lTQV1OtpANlAFUGfW9V6XJ98gGFrQj+LjFUPmX/C2BYMcYtPCvGLd1iBHjlVLwAfo5Gx6bpnV+e6hx2kHkzbqN6iZ8lfVrxsEq0aI3SfK7pc1NpL6iUjq2D6D3FCx+nVYxSJn4NwJLBdXRcG0nmr/tNMkz6c8wbI7Pbvn9ISgXYz8SXCfhUO4gXbRHwLRFuR2by2frBJrucrWZbbH8Qmf09VT9QzCYmie2PCbgEk6Qfw8AXJ5P5y37zlApQzsQWGHQrSEAv4jwDt0NEq5GZfFZhl7PVCk9RPf9qcudxMZuYtPhoTW/Z2x0xL0Rnt7/xnadysvLdxBkO2+3agngA4Anate57WwcwCv8HqRGqWuONHrqueaonLGXiBQBnAkU1OAojyfxZlYkanTBtmEYzaFgjV8oFIGYpgCKL1HOlfgdYthRAmf2T6kzlAkT2wvfRbKNJOCqHuVKivgTN5ypgVj7xwGL+1a/7PU5rO5otUr61BhWT3suKVgEseRD70s2R3h1A1R/1whlAtZDWKqFVgJGZwl8AfLu7AVZQ6X6PM/hekDRkXnQaMId2AaQh86bTgB0do38Vaci8qTdgDu0CSEPmSasBc+gvQdKQNabZgDmMvpwrDZmbbgPmMCqANGRupjkxuwOkIXPTbMAcRgWQhsxFuwFzBPgHDWnIHCYNmMO4ANKQPWfSgB0da35VaciOsHkujAtw2HR07OvqPawSKYY3TQ82X4LmcxWApCEzbMAcgf5LkgOsfS8L0wbMEagA0pAFz0HAO0AaMtMGTAghhBBCCDG4Av9kWSkTd/3+wSAZSeYD5bBvfjHrZSUF6DIpQJdJAbpMCtBlUoAukwIIIYQQQgghhBBCCCGEEEK02f/yNPHsMpUbAgAAAABJRU5ErkJggg=="/>
            </defs>
          </svg>
          <div v-else>{{item.counter}}</div>
        </template>
      </v-data-table>

    </template>

  </v-card>
</template>


<script>
import {mapActions, mapMutations} from "vuex";

export default {
  name: "CheckInResumeTable",
  props: {
    usersDictionary: {
      default: () => new Map(),
    }
  },

  data() {
    return {
      namesAndDays: [],
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'user.name',
        },
        {
          text: 'Días',
          align: 'center',
          sortable: false,
          value: 'counter'
        }
      ],
      allCheckIns: [],
    }
  },
  computed: {
    attendanceList() {
      let attendanceMap = new Map();
      let maxValue = 1;
      let currentWinnerUserId = null;

      this.allCheckIns.forEach((checkIn) => {

        if (attendanceMap.has(checkIn.uid)) {

          if (maxValue < attendanceMap.get(checkIn.uid).counter + 1) {
            maxValue++;
          }

          attendanceMap.set(checkIn.uid, {
            counter: attendanceMap.get(checkIn.uid).counter + 1,
            score: attendanceMap.get(checkIn.uid).score + +checkIn.date._seconds,
            user: this.usersDictionary.get(checkIn.uid),
            winner: false,
          });
        } else {
          attendanceMap.set(checkIn.uid, {
            counter: 1,
            score: +checkIn.date._seconds,
            user: this.usersDictionary.get(checkIn.uid),
            winner: false,
          });
        }
      });

      attendanceMap.forEach((value, key, map) => {
        if (value.counter === maxValue) {
          if (currentWinnerUserId && map.get(currentWinnerUserId).score > map.get(key).score) {
            currentWinnerUserId = key;
          } else if (!currentWinnerUserId) {
            currentWinnerUserId = key;
          }
        }
      });

      let currentWinnerUser = attendanceMap.get(currentWinnerUserId);
      if (currentWinnerUser) {
        currentWinnerUser.winner = true;
        attendanceMap.set(currentWinnerUserId, currentWinnerUser);
      }

      return Array.from(attendanceMap.values());
    },
  },
  methods: {
    ...mapMutations([
        "SET_LOADING",
        "SHOW_ERROR_ALERT",
        ""
    ]),
    ...mapActions([
        "GET_CHECK_INS"
    ]),
    async getAllCheckIns() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        this.allCheckIns = await this.GET_CHECK_INS({startDate, endDate});
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
  },
  async mounted() {
    await this.getAllCheckIns();
  }
}

</script>

<style scoped>

</style>
