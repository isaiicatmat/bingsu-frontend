<template>
  <v-container>
    <h1>Manejar Archivos</h1>
    <v-file-input
        v-model="file"
        type="file"
        accept="application/msword, application/pdf"
        label="File input"
    ></v-file-input>
    <v-btn class="upload-button"
           color="#f6c40e"
           :style="{'color': 'white'}">
      Subir
    </v-btn>

  </v-container>
</template>

<script>
import File from '../mixins/File';
export default {
  data() {
    return {
      posts: [],
      file: null
    }
  },
  mixins: [File],
  methods: {
    async uploadFile() {
      await this.$http.get('/example');
    }
  }
}
</script>
