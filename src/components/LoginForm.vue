<template>
  <v-form ref="loginForm">
    <v-text-field
        outlined
        v-model="email"
        :rules="[requiredRule, emailRule]"
        type="email"
        dense
        background-color="#FFFFFF"
        @keydown.enter="sendForm()"
        label="Correo electrónico"
        required
    ></v-text-field>
    <v-text-field
        v-model="password"
        outlined
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[requiredRule]"
        dense
        background-color="#FFFFFF"
        @keydown.enter="sendForm()"
        :type="show ? 'text' : 'password'"
        label="Contraseña"
        @click:append="show = !show">
    </v-text-field>
    <div class="d-flex justify-center mt-10">
      <v-btn class="px-6"
             @click="sendForm()"
             :disabled="disabledButton"
             color="primary"
             depressed>Iniciar sesión</v-btn>
    </div>
  </v-form>
</template>

<script>
import rules from "@/mixins/Rules";

export default {
  name: "LoginForm",
  mixins: [rules],
  props: {
    disabledButton: {
      type: Boolean,
      default: false,
    }
  },
  data: () => {
    return {
      show: false,
      email: '',
      password: '',
    }
  },
  methods: {
    sendForm() {
      if (this.$refs.loginForm.validate()) {
        const email = this.email;
        const password = this.password;
        this.$emit('onSubmitLoginForm', {email, password});
      }
    }
  },
}
</script>

<style scoped>

</style>