import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { msg } from 'src/scripts/msg'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  let locale = 'en' // storage.language();
  const i18n = createI18n({
    locale: locale,
    legacy: false,
    messages,
  })
  msg.i18n(i18n)
  app.use(i18n)
})
