import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import es from 'vuetify/src/locale/es';
Vue.use(Vuetify);



export default new Vuetify({
    lang: {
        locales: { es },
        current: 'es',
    },
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#09151E',
                secondary: '#B3C6CC'
            },
        },
    },
});
