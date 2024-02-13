<template>
  <v-data-table :headers="headers"
                :items="usersArticles"
                sort-by="name"
                class="mx-8 article-table"
                height="567">
    <template v-slot:[`item.name`]="{ item }">
      <div class="noselect">
        {{ item.name }}
      </div>
    </template>
    <template v-slot:[`item.articleName`]="{ item }">
      <div v-for="article in item.articles" :key="article.value" class="noselect py-2">
        {{ article.name }}
      </div>
    </template>
    <template v-slot:[`item.serial`]="{ item }">
      <div v-for="article in item.articles" :key="article.value" class="noselect py-2">
        {{ article.serial }}
      </div>
    </template>
    <template v-slot:[`item.date`]="{ item }">
      <div v-for="article in item.articles" :key="article.value" class="noselect py-2">
        {{ article.date }}
      </div>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <tr v-for="article in item.articles" :key="article.value" class="d-flex justify-center">
        <v-btn icon @click="$emit('downloadlArticleFormat', article.id)">
          <DownloadIcon></DownloadIcon>
        </v-btn>
        <v-btn icon @click="$emit('openUpdateArticle', article.id)">
          <EditIcon></EditIcon>
        </v-btn>
        <v-btn icon @click="$emit('openDeleteArticle', article.id)">
          <DeleteIcon></DeleteIcon>
        </v-btn>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import DeleteIcon from "@/components/Table/DeleteIcon";
import EditIcon from "@/components/Table/EditIcon";
import DownloadIcon from "@/components/Table/DownloadIcon.vue"

export default {
  name: "ArticleTable",
  components: { EditIcon, DeleteIcon, DownloadIcon },
  props: {
    usersArticles: {
      default: () => []
    },
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Articulo',
          value: 'articleName',
          sortable: false,
        },
        {
          text: 'Numero de serie',
          value: 'serial',
          sortable: false,
        },
        {
          text: 'Fecha de entrega',
          value: 'date',
          sortable: false,
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        },
      ]
    }
  },
}
</script>

<style>
.article-table tbody>tr:nth-child(even) {
  background-color: #F1F4F4;
}
</style>