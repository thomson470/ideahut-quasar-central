<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-center">
    <q-inner-loading v-if="redirecting" showing :label="$t('label.redirecting') + '...'" />
    <div v-else class="login-form text-center">
      <q-icon name="mood_bad" color="deep-orange-11" size="200px" />
      <div class="text-h6">{{ $t('label.unavailable_content') }}</div>
    </div>
  </div>
  <div class="q-mt-lg text-center text-bold">{{ error }}</div>
</template>

<script>
import { ref } from 'vue'
import { util } from 'src/scripts/util'
import { uix } from 'src/scripts/uix'
import { api } from 'src/scripts/api'

export default {
  setup() {
    return {
      util,
      uix,
      redirecting: ref(true),
      error: ref(null),
    }
  },
  created() {
    let self = this
    let projectId = self.$route.query.projectId
    let moduleId = self.$route.query.moduleId
    api.call({
      path: '/redirect',
      method: 'post',
      params: {
        projectId: projectId,
        moduleId: moduleId,
      },
      onSuccess(data) {
        data = util.isObject(data) ? data : {}
        if (util.isString(data.action) && '' !== data.action) {
          let f = document.createElement('form')
          f.setAttribute('method', util.isString(data.method) ? data.method : 'get')
          f.setAttribute('action', data.action)
          if (util.isObject(data.parameters)) {
            Object.keys(data.parameters).forEach((name) => {
              let i = document.createElement('input')
              i.setAttribute('type', 'hidden')
              i.setAttribute('name', name)
              i.setAttribute('value', data.parameters[name])
              f.appendChild(i)
            })
          }
          document.getElementsByTagName('body')[0].appendChild(f)
          f.submit()
        } else {
          self.redirecting = false
        }
      },
      onError(error) {
        if (util.isArray(error) && error.length) {
          self.error = error[0].code + ': ' + error[0].text
        } else {
          self.error = error
        }
        self.redirecting = false
      },
    })
  },
}
</script>
