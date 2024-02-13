import Vue from 'vue';

export default Vue.extend({
  data: () => {
    return {
      requiredRule: (v: unknown) => !!v || 'Este campo es requerido',
      emailRule: (v: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Ingresa un email válido',
      onlyThreeWords: (v: string) => /^(['A-Za-zÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿ']*\s?){0,3}$/.test(v) || 'Máximo 3 nombres',
      onlyOneWord: (v: string) => /^(['A-Za-zÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿ']*\s?)?$/.test(v) || 'Máximo un apellido',
      onlyNumbers: (v: string) => /^[1-9]\d*(\.\d{0,2})?$/.test(v) || 'Ingresa sólo números con máximo 2 decimales',
      validPhone: (v: string) => /^\d{10}?$/.test(v) || 'Ingresa un teléfono válido',
      validNSS: (v: string) => /^(\d{2})(\d{2})(\d{2})\d{5}$/.test(v) || 'Ingresa un NSS válido',
      validCURP: (v: string) => /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
          .test(v) || 'Ingresa una CURP válida',
      validRFC: (v: string) => /^([A-ZÑ&]{3,4}(\d{2})(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[0-1])[A-Z|\d]{3})$/.test(v) || 'Ingresa un RFC válido',
      validEmployeeId: (v: string) => /^\d{7}$/.test(v) || 'Ingresa un número de empleado válido',
      notZero: (v: string) => /^(?!0+$).*$/.test(v) || 'Ingrese un valor mayor a 0',
      fileSize: (v: File) => !v || v.size < 5242880 || 'El tamaño del archivo debe ser menor a 5 MB',
    }
  },
})