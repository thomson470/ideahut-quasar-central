<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { util } from 'src/scripts/util'
import { api } from 'src/scripts/api'
import { storage } from 'src/scripts/storage'

export default defineComponent({
  name: 'App',
  created() {
    let self = this
    // buat cek token dan ambil konfigurasi
    api.call({
      path: '/info',
      onSuccess(data, info) {
        data = util.isObject(data) ? data : {}
        info = util.isObject(info) ? info : {}
        if (!util.isObject(data.account)) {
          storage.auth(null)
          storage.user(null)
        } else {
          let token = util.isString(data.authorization) ? data.authorization : ''
          let auth = storage.auth()
          auth.token = token
          storage.auth(auth)
          storage.user(data.account)
        }
        if (util.isObject(info.config)) {
          storage.config(info.config)
        }
      },
      onError(error) {
        let response = error?.response ? error.response : {}
        if (401 === response.status) {
          storage.auth(null)
          storage.user(null)
        }
      },
    })
    let menu = storage.menu()
    if (window.location.pathname === util.webPath() + '/index.html') {
      let qp = Object.fromEntries([...new URLSearchParams(window.location.href.split('?')[1])])
      let next = util.isString(qp._next_) ? qp._next_ : ''
      if ('' !== next) {
        next = atob(next)
      }
      if (!(menu.active?.link && next === menu.active.link)) {
        delete menu.active
        storage.menu(menu)
      }
      self.$router.push({
        path: next,
        query: Object.fromEntries([...new URLSearchParams(next.split('?')[1])]),
      })
    }
  },
})
</script>
