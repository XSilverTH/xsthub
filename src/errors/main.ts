import { createApp, h } from 'vue'
import ErrorPage from '../components/ErrorPage.vue'
import { HTTP_ERRORS } from './http-errors'
import '../styles/app.css'

const code = Number(document.documentElement.dataset.errorCode)
const error = HTTP_ERRORS.find((entry) => entry.code === code) ?? HTTP_ERRORS.find((entry) => entry.code === 404)!

createApp({
  render: () =>
    h(ErrorPage, {
      code: error.code,
      phrase: error.phrase,
      title: error.title,
      message: error.message,
    }),
}).mount('#app')
