import { saveArticle, getArticles, deleteArticle, getArticle, updateArticle } from "@/services/articles";
import {GetterTree, MutationTree} from 'vuex'
import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { Article, ArticleState } from "./types";
import {Module} from "vuex";

export const state: ArticleState = {
    article: {
        name: "",
        uid: "",
        serial: "",
        date: "",
        format: "",
    }
};

const actions: ActionTree<ArticleState, RootState> = {
    async SAVE_ARTICLE(_, article: Article) {
        await saveArticle(article);
    },
    async GET_ARTICLES() {
        return getArticles();
    },
    async GET_ARTICLE(_,id){
        return getArticle(id);
    },
    async UPDATE_ARTICLE(_, payload){
        return updateArticle(payload.id, payload.article);
    },
    async DELETE_ARTICLE(_, id) {
        return await deleteArticle(id);
    },
}

const getters: GetterTree<ArticleState, RootState> = {
    ARTICLE(state): Article {
        const {article} = state;
        return article;
    }
}

const mutations: MutationTree<ArticleState> = {
    SET_ARTICLE(state, article: Article) {
        state.article = article;
    }
}

export const article: Module<ArticleState, RootState> = {
    state,
    actions,
    mutations,
    getters
}
