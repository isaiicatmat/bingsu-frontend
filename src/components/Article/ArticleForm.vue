<template>
  <v-form ref="articleForm" lazy-validation>

    <div class="row row--dense">
      <div class="col">
        <v-text-field v-model="article.name" :rules="[requiredRule]" dense label="Nombre del artículo" outlined required
          type="text"></v-text-field>
      </div>
      <div class="col">
        <v-select :items="users" :rules="[requiredRule]" item-text="text" hide-details item-value="value"
          label="Poseedor" v-model="article.uid" dense outlined>
        </v-select>
      </div>

      <div class="col">
        <v-text-field v-model="article.serial" dense label="Número de serie" outlined type="text">
        </v-text-field>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" max-width="290px" min-width="auto" offset-y
          transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="dateFormatted" dense label="Fecha de entrega" outlined :rules="[requiredRule]"
              v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date" :allowed-dates="allowedDates" no-title @input="menu = false"></v-date-picker>
        </v-menu>
      </div>

      <div class="col">
        <v-file-input v-model="format" :rules="update ? [fileSize] : [requiredRule, fileSize]" accept="application/pdf"
          dense label="Formato llenado" outlined type="file">
        </v-file-input>
      </div>
    </div>

    <div class="d-flex justify-center">
      <v-btn class="mr-2" color="#F5223B" depressed @click="$emit('close-dialog')">
        <div style="color:white">
          Cerrar
        </div>
      </v-btn>
      <v-btn class="ml-2" color="primary" depressed @click="validate()">{{ update? 'Actualizar': 'Guardar' }}</v-btn>
    </div>

  </v-form>
</template>

<script>

import Rules from "@/mixins/Rules";
import File from '../../mixins/File';
import { mapGetters } from "vuex";

export default {
  name: "articleForm",
  props: {
    update: {
      type: Boolean
    },
    users: {
      default: () => []
    },
    activeDialog: {
      type: Boolean
    },
  },
  mixins: [File, Rules],
  data: (vm) => {
    return {
      article: {
        name: "",
        uid: "",
        serial: "",
        date: "",
        format: null,
      },
      format: null,
      menu: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0],
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]),
    }
  },
  computed: {
    ...mapGetters(['ARTICLE']),
  },
  methods: {
    allowedDates(val) {
      return new Date(val) < new Date();
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${year}-${month}-${day}`
    },
    parseDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    async validate() {
      if (this.$refs.articleForm.validate()) {
        this.article.date = this.date;
        this.article.format = this.format ? await this.getBase64FromFile(this.format) : null;
        if (this.update) {
          this.$emit('onUpdateArticle', this.article);
        } else {
          this.$emit('onAddArticle', this.article);
        }
      }
    },
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
    activeDialog: {
      handler(activeDialog) {
        if (activeDialog) {
          if (this.update) {
            this.article = this.ARTICLE;
            this.date = new Date(this.ARTICLE.date._seconds * 1000).toISOString().split('T')[0];
            this.dateFormatted = this.formatDate(this.date);
          }
          //When "Add article" button is pressed after the first time, show date
          this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          this.dateFormatted = this.formatDate(this.date);
        } else {
          this.$refs.articleForm.reset();
        }

      }
    }
  },

  mounted() {
    this.article = this.ARTICLE ? this.ARTICLE : null;
    if (this.article.date != "" && this.article) this.date = new Date(this.article.date._seconds * 1000).toISOString().split('T')[0];
  }
}
</script>
