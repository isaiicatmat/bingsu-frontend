<template>
  <div>
    <v-row>
      <ArticleFilter :users="filterUsers" @filterInAction="filterItems"></ArticleFilter>
    </v-row>
    <div class="row white rounded-lg">
      <div class="col-12" style="padding: 12px">
        <div class="align-center justify-space-between px-4 py-4 ml-6">
          <!--<div class="d-flex row pa-4 justify-start">
                      <p class="text-lg-h6 font-weight-bold" v-if="userRole == 'admin'">Resumen de bienes activos</p>
                  </div>-->
          <div class="d-flex row">
            <div class="col-6">
              <v-btn color="primary"
                v-if="userRole === 'admin' || userRole === 'human_resources' || userRole === 'maintainer'"
                @click="registerArticleDialog = true">Agregar</v-btn>
            </div>
            <div class="col-6 d-flex justify-end">
                <v-btn
                    v-if="userRole === 'admin' || userRole === 'maintainer' || userRole === 'human_resources'"
                    class="white--text ma-1"
                    style="height: 32px"
                    color="primary"
                    outlined
                    small
                    href="https://storage.googleapis.com/bingsu-backend.appspot.com/Carta%20Responsiva.docx"
                    >
                    Carta responsiva
                    <v-icon dark right>
                    mdi-cloud-download
                    </v-icon>
                </v-btn>
            </div>
          </div>
        </div>
        <ArticleTable
          :usersArticles="usersArticles"
          @downloadlArticleFormat="downloadArticleFormat"
          @openUpdateArticle="openUpdateArticle"
          @openDeleteArticle="openDeleteArticle">
        </ArticleTable>
      </div>
    </div>

    <v-dialog v-model="registerArticleDialog" transition="dialog-bottom-transition" width="960">

      <template v-slot:default="dialog">
        <v-card width="960px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Nuevo artículo</div>
          </v-card-title>
          <v-card-text>
            <Article-form
              :active-dialog="dialog.value"
              :users="selectUsers"
              @onAddArticle="handleNewArticle"
              @close-dialog="dialog.value = false">
            </Article-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog transition="dialog-bottom-transition" width="400" v-model="deleteArticleDialog">
      <ConfirmDelete
        :title="articleToDelete + userToDelete"
        @cancel="deleteArticleDialog = false"
        @confirm="handleDeleteArticle"
        confirmation-text="¿Estás seguro que deseas eliminar este artículo?">
      </ConfirmDelete>
    </v-dialog>

    <v-dialog transition="dialog-bottom-transition" width="960" v-model="updateArticleDialog">
      <template v-slot:default="dialog">
        <v-card width="960px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Editar artículo</div>
          </v-card-title>
          <v-card-text>
            <Article-form
              :active-dialog="dialog.value"
              :users="selectUsers"
              update @onUpdateArticle="handleUpdateArticle"
              @close-dialog="dialog.value = false">
            </Article-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>

import { mapMutations, mapActions, mapGetters } from 'vuex';
import authService from "@/services/auth";
import ArticleForm from "@/components/Article/ArticleForm";
import ArticleFilter from "@/components/Article/ArticleFilter.vue";
import ArticleTable from "@/components/Article/ArticleTable.vue";
import ConfirmDelete from "@/components/ConfirmDelete";
import File from "@/mixins/File"
export default {
  name: "ArticleView",
  components: { ArticleForm, ArticleFilter, ArticleTable, ConfirmDelete },
  data: () => {
    return {
      userRole: null,
      registerArticleDialog: false,
      users: null,
      articles: [],
      selectUsers: null,
      filterUsers: null,
      usersArticles: [],
      selectedUserArticles: [],
      filterSelected: null,
      deleteArticleDialog: false,
      updateArticleDialog: false,
      currentArticleId: null,
      articleToDelete: [],
      userToDelete: [],
    }
  },

  mixins: [File],

  methods: {
    ...mapActions([
      'GET_USERS',
      'SAVE_ARTICLE',
      'GET_ARTICLES',
      'DELETE_ARTICLE',
      'GET_ARTICLE',
      'UPDATE_ARTICLE'
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT',
      'SET_ARTICLE',
    ]),

    async downloadArticleFormat(articleId) {
      try {
        this.SET_LOADING(true);
        const article = await this.GET_ARTICLE(articleId);
        await this.getFileToDownload(article.format)
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },

    async handleNewArticle(article) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_ARTICLE(article);
        this.filterSelected ? await this.filterItems(this.filterSelected) : await this.getUserArticles();
        this.SHOW_SUCCESS_ALERT("El artículo se ha agregado");
        this.registerArticleDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdateArticle(article) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_ARTICLE({ id: article.id, article: article });
        this.SHOW_SUCCESS_ALERT("El artículo se ha actualizado");
        await this.getUserArticles();
        this.updateArticleDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },

    async openDeleteArticle(articleId) {
      try {
        this.SET_LOADING(true);
        this.currentArticleId = articleId;
        const article = this.articles.find(article => article.id === articleId);
        this.articleToDelete = article.name;
        const user = this.users.find(user => user.id === article.uid);
        this.userToDelete = ` (${user.name})`;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deleteArticleDialog = true;
    },

    async openUpdateArticle(articleId) {
      try {
        this.SET_LOADING(true);
        const article = await this.GET_ARTICLE(articleId);
        this.SET_ARTICLE(article);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.updateArticleDialog = true;
    },

    async handleDeleteArticle() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_ARTICLE(this.currentArticleId);
        await this.getUserArticles();
        this.SHOW_SUCCESS_ALERT("El articulo ha sido eliminado");
        this.deleteArticleDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },

    async getUsers() {
      let users = await this.GET_USERS();
      const usersRecordMap = new Map();
      users.forEach(user => {
        usersRecordMap.set(user.id, {
          'value': user.id,
          'text': `${user.name} ${user.firstLastName} ${user.secondLastName}`,
        });
      });

      this.selectUsers = Array.from(usersRecordMap, ([_, value]) => ({
        'value': value.value, 'text': value.text,
      }))
        ;
      this.filterUsers = [...this.selectUsers];
      this.filterUsers.unshift({
        'value': 'All',
        'text': 'Todos',
      });
      this.users = users;
    },

    async getUserArticles() {
      try {
        this.SET_LOADING(true);
        let articles = await this.GET_ARTICLES();
        let articlesRecordMap = new Map();
        articles.forEach(article => {
          if (articlesRecordMap.get(article.uid)) {
            const userArticle = articlesRecordMap.get(article.uid);
            userArticle.articles.push(
              {
                name: article.name,
                date: new Date(article.date._seconds * 1000).toISOString().substr(0, 10),
                serial: article.serial ? article.serial : 'S/N',
                id: article.id,
                format: article.format,
              }
            )
          } else {
            const user = this.users.find(user => user.id === article.uid);
            const userName = `${user.name} ${user.firstLastName}`;
            articlesRecordMap.set(article.uid, {
              name: userName,
              articles:
                [{
                  name: article.name,
                  date: new Date(article.date._seconds * 1000).toISOString().substr(0, 10),
                  serial: article.serial ? article.serial : 'S/N',
                  id: article.id,
                  format: article.format,
                }],
            })
          }
        })
        this.usersArticles = Array.from(articlesRecordMap, ([key, value]) => ({ name: value.name, uid: key, articles: value.articles }));
        this.articles = articles;

      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },

    async filterItems(value) {
      await this.getUserArticles();
      const foundArticles = this.usersArticles.find(item => item.uid === value);
      if (foundArticles) {
        this.usersArticles = [foundArticles];
      } else if (value !== 'All') {
        this.usersArticles = [];
      }
      this.filterSelected = value;
    },
  },

  async mounted() {
    try {
      this.userRole = await authService.getRole();
      await this.getUsers();
      await this.getUserArticles();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    }

  }
}
</script>
