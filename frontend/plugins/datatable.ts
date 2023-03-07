import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

export default defineNuxtPlugin(({ vueApp }) => {  
  vueApp.component('EasyDataTable', Vue3EasyDataTable)
})