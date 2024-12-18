<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="row q-pl-sm q-pr-sm">
    <!--
      IMAGE
    -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs q-mb-sm">
      <q-card bordered>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">{{ $t('label.image') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              class="text-caption"
              flat
              round
              glossy
              dense
              icon="cloud_sync"
              @click="on_image_sync_click"
            >
              <q-tooltip>{{ $t('label.house_keeping') }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="q-pa-xs">
          <q-uploader
            style="width: 100%"
            accept=".jpg, .png, image/*"
            color="transparent"
            hide-upload-btn
            flat
            bordered
            @added="(files) => (image.file = files[0])"
            @removed="(files) => (image.file = null)"
          >
            <template v-slot:header="scope">
              <div class="row no-wrap items-center q-pr-sm q-gutter-xs">
                <div class="col"></div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  @click="scope.pickFiles"
                  round
                  dense
                  flat
                >
                  <q-uploader-add-trigger />
                </q-btn>
              </div>
            </template>
          </q-uploader>
        </q-card-section>
        <q-separator />
        <q-card-actions v-if="image.file || image.path" class="q-pa-xs q-pl-sm q-pr-sm row">
          <q-select
            v-if="image.file && !image.path"
            class="col-12"
            v-model="image.type"
            :label="$t('label.type')"
            :options="image.types"
            option-value="value"
            option-label="label"
            borderless
            dense
          >
            <template v-slot:after>
              <q-btn flat round dense icon="send" @click="on_image_upload" />
            </template>
          </q-select>
          <q-input
            v-if="image.file && image.path"
            class="col-12"
            v-model="image.path"
            standout
            readonly
            dense
          >
            <template v-slot:append>
              <q-btn
                v-if="image.copying"
                :label="$t('copied')"
                flat
                color="green"
                dense
                icon="done_all"
                no-caps
                disable
              />
              <q-btn v-else flat round dense icon="content_copy" @click="on_image_path_copy" />
            </template>
          </q-input>
        </q-card-actions>
        <q-inner-loading :showing="image.loading" />
      </q-card>
    </div>

    <!--
      ADMIN
    -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs q-mb-sm">
      <q-card bordered>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">{{ $t('label.admin') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="q-pa-xs">
          <q-uploader style="width: 100%" accept=".zip" color="transparent" flat bordered>
            <template v-slot:header="scope">
              <div class="row no-wrap items-center q-pr-sm q-gutter-xs">
                <div class="col"></div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  @click="scope.pickFiles"
                  round
                  dense
                  flat
                >
                  <q-uploader-add-trigger />
                </q-btn>
                <q-btn
                  v-if="scope.canUpload"
                  icon="cloud_upload"
                  @click="on_admin_upload(scope)"
                  round
                  dense
                  flat
                >
                  <q-tooltip>{{ $t('label.upload') }}</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-uploader>
        </q-card-section>
        <q-inner-loading :showing="admin.loading" />
      </q-card>
    </div>

    <!--
      BCRYPT
    -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs q-mb-sm">
      <q-card bordered>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">{{ $t('label.bcrypt') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-tabs v-model="bcrypt.tab" dense no-caps align="justify" inline-label>
            <q-tab name="generate" icon="pattern" :label="$t('label.generate')" />
            <q-tab name="check" icon="rule" :label="$t('label.check')" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="bcrypt.tab" animated>
            <q-tab-panel name="generate" class="q-pa-sm">
              <div class="q-field--outlined q-pa-none">
                <q-input
                  v-model="bcrypt.gen_pass"
                  :label="$t('label.password')"
                  class="q-ma-none"
                  borderless
                  dense
                >
                  <template v-slot:prepend>
                    <q-select
                      v-model="bcrypt.round"
                      :options="bcrypt.rounds"
                      dense
                      borderless
                      class="q-mr-sm"
                    >
                      <template v-slot:prepend>
                        <div style="width: 5px"></div>
                      </template>
                      <q-tooltip>{{ $t('label.round') }}</q-tooltip>
                    </q-select>
                  </template>
                  <template v-slot:append>
                    <q-btn round dense flat icon="send" @click="on_bcrypt_generate">
                      <q-tooltip>{{ $t('label.generate') }}</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </div>
              <q-input
                v-if="bcrypt.gen_hash?.length"
                v-model="bcrypt.gen_hash"
                standout
                readonly
                dense
                class="q-mt-xs"
              >
                <template v-slot:prepend>
                  <q-btn
                    round
                    dense
                    flat
                    color="negative"
                    icon="close"
                    @click="bcrypt.gen_hash = null"
                  >
                    <q-tooltip>{{ $t('label.close') }}</q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:append>
                  <q-btn
                    v-if="bcrypt.copying"
                    :label="$t('copied')"
                    flat
                    color="green"
                    dense
                    icon="done_all"
                    no-caps
                    disable
                  />
                  <q-btn v-else flat round dense icon="content_copy" @click="on_bcrypt_copy">
                    <q-tooltip>{{ $t('label.copy') }}</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </q-tab-panel>
            <q-tab-panel name="check" class="q-pa-sm">
              <q-input
                v-model="bcrypt.chk_pass"
                :label="$t('label.password')"
                outlined
                dense
                class="q-mb-xs"
              />
              <q-input
                v-model="bcrypt.chk_hash"
                :label="$t('label.hash')"
                outlined
                dense
                class="q-mb-xs"
              />
              <q-btn
                :label="$t('label.check')"
                :loading="bcrypt.checking"
                glossy
                no-caps
                @click="on_bcrypt_check"
              />
              <span class="q-ml-md text-bold">{{ bcrypt.chk_result }}</span>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-inner-loading :showing="bcrypt.loading" />
      </q-card>
    </div>
    <!--
      PASSWORD
    -->
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs q-mb-sm">
      <q-card bordered>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">{{ $t('label.password') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="q-pa-sm">
          <div class="row">
            <q-input
              v-model="password.factor"
              type="number"
              :label="$t('label.factor')"
              class="col-3"
              outlined
              dense
            >
            </q-input>
            <q-input
              v-model="password.value"
              :label="$t('label.password')"
              class="col-9"
              outlined
              dense
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  :loading="password.loading"
                  @click="on_password_encrypt"
                >
                  <q-tooltip>{{ $t('label.generate') }}</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
          <q-input
            v-if="password.hashed?.length"
            v-model="password.hashed"
            standout
            readonly
            dense
            class="q-mt-xs"
          >
            <template v-slot:prepend>
              <q-btn round dense flat color="negative" icon="close" @click="password.hashed = null">
                <q-tooltip>{{ $t('label.close') }}</q-tooltip>
              </q-btn>
            </template>
            <template v-slot:append>
              <q-btn
                v-if="password.copying"
                :label="$t('copied')"
                flat
                color="green"
                dense
                icon="done_all"
                no-caps
                disable
              />
              <q-btn v-else flat round dense icon="content_copy" @click="on_password_copy">
                <q-tooltip>{{ $t('label.copy') }}</q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-inner-loading :showing="password.loading" />
      </q-card>
    </div>
  </div>

  <q-dialog v-model="image.sync.show" persistent>
    <q-card>
      <q-card-section class="q-pa-xs q-pl-lg q-pr-lg text-center">
        {{ $t('label.password') }}
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form @submit="on_image_sync">
          <q-input
            v-model="image.sync.password"
            type="password"
            filled
            dense
            input-class="text-center"
          >
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions class="row">
        <div class="col-6 text-left">
          <q-btn no-caps ripple glossy :label="$t('label.cancel')" color="negative" v-close-popup />
        </div>
        <div class="col-6 text-right">
          <q-btn
            no-caps
            ripple
            glossy
            :label="$t('label.continue')"
            color="positive"
            :loading="image.sync.loading"
            @click="on_image_sync"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'
import { util } from 'src/scripts/util'
import { uix } from 'src/scripts/uix'
import { api } from 'src/scripts/api'

export default {
  setup() {
    return {
      util,
      uix,
      copyToClipboard,
      image: ref({
        types: [],
        type: null,
        file: null,
        loading: false,
        copying: false,
        path: null,
        sync: {
          show: false,
          loading: false,
          password: null,
        },
      }),
      admin: ref({
        loading: false,
      }),
      bcrypt: ref({
        tab: 'generate',
        rounds: [],
        round: null,
        copying: false,
        checking: false,
        gen_pass: null,
        gen_hash: null,
        chk_pass: null,
        chk_hash: null,
        chk_result: null,
      }),
      password: ref({
        factor: null,
        value: null,
        hashed: null,
        copying: false,
        loading: false,
      }),
    }
  },

  created() {
    let self = this
    api.call({
      path: '/tool/image/types',
      onSuccess(data) {
        self.image.types = [{ label: '', value: null }]
        if (util.isArray(data)) {
          Array.prototype.push.apply(self.image.types, data)
        }
      },
      notify: false,
    })
    self.bcrypt.rounds = [null]
    for (let i = 4; i < 17; i++) {
      self.bcrypt.rounds.push(i)
    }
  },
  methods: {
    /*
     * IMAGE SYNC
     */
    on_image_sync() {
      let self = this
      let password = self.image.sync.password
      password = util.isString(password) ? password : ''
      if (!password?.length) {
        uix.error('error.required', 'label.password')
        return
      }
      self.image.sync.loading = true
      api.call({
        path: '/tool/image/sync',
        method: 'post',
        params: {
          password: password,
        },
        onFinish() {
          self.image.sync.loading = false
        },
        onSuccess() {
          self.image.sync.show = false
        },
      })
    },

    /*
     * IMAGE PATH COPY
     */
    on_image_path_copy() {
      let self = this
      copyToClipboard(self.image.path)
      self.image.copying = true
      setTimeout(function () {
        self.image.copying = false
      }, 3000)
    },

    /*
     * IMAGE UPLOAD
     */
    on_image_upload() {
      let self = this
      let type = self.image.type
      if (!type?.value) {
        uix.error('error.required', 'label.type')
        return
      }
      let image = self.image
      if (!image.file) {
        uix.error('error.required', 'label.file')
        return
      }
      let form = new FormData()
      form.append('file', image.file)
      form.append('type', type.value)
      image.loading = true
      api.call({
        path: '/tool/image/upload',
        method: 'post',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onFinish() {
          image.loading = false
        },
        onSuccess(data) {
          image.path = data
        },
      })
    },

    /*
     * IMAGE SYNC
     */
    on_image_sync_click() {
      let self = this
      self.image.sync = {
        show: true,
        password: null,
      }
    },

    /*
     * ADMIN UPLOAD
     */
    on_admin_upload(scope) {
      util.log(scope)
      if (!(util.isArray(scope.files) && scope.files.length)) {
        uix.error('error.required', 'label.file')
        return
      }
      let self = this
      let form = new FormData()
      form.append('file', scope.files[0])
      self.admin.loading = true
      api.call({
        path: '/tool/admin/upload',
        method: 'post',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onFinish() {
          self.admin.loading = false
        },
        onSuccess() {
          scope.reset()
          uix.alert('label.successfully_uploaded')
        },
      })
    },

    /*
     * BCRYPT COPY
     */
    on_bcrypt_copy() {
      let self = this
      copyToClipboard(self.bcrypt.gen_hash)
      self.bcrypt.copying = true
      setTimeout(function () {
        self.bcrypt.copying = false
      }, 3000)
    },

    /*
     * BCRYPT GENERATE
     */
    on_bcrypt_generate() {
      let self = this
      let password = self.bcrypt.gen_pass
      password = util.isString(password) ? password : ''
      if (!password?.length) {
        uix.error('error.required', 'label.password')
        return
      }
      self.bcrypt.loading = true
      api.call({
        path: '/tool/bcrypt/generate',
        method: 'post',
        params: {
          round: self.bcrypt.round,
          password: password,
        },
        onFinish() {
          self.bcrypt.loading = false
        },
        onSuccess(data) {
          self.bcrypt.gen_hash = data
        },
      })
    },

    /*
     * BCRYPT CHECK
     */
    on_bcrypt_check() {
      let self = this
      self.bcrypt.chk_result = null
      let password = self.bcrypt.chk_pass
      password = util.isString(password) ? password : ''
      if (!password?.length) {
        uix.error('error.required', 'label.password')
        return
      }
      let hash = self.bcrypt.chk_hash
      hash = util.isString(hash) ? hash : ''
      if (!hash?.length) {
        uix.error('error.required', 'label.hash')
        return
      }
      self.bcrypt.checking = true
      api.call({
        path: '/tool/bcrypt/check',
        method: 'post',
        params: {
          password: password,
          hash: hash,
        },
        onFinish() {
          self.bcrypt.checking = false
        },
        onSuccess(data) {
          self.bcrypt.chk_result = data
        },
      })
    },

    /*
     * PASSWORD ENCRYPT
     */
    on_password_encrypt() {
      let self = this
      let password = self.password.value
      password = util.isString(password) ? password : ''
      if (!password?.length) {
        uix.error('error.required', 'label.password')
        return
      }
      self.password.loading = true
      api.call({
        path: '/tool/password/encrypt',
        method: 'post',
        params: {
          password: password,
          factor: self.password.factor,
        },
        onFinish() {
          self.password.loading = false
        },
        onSuccess(data) {
          self.password.hashed = data
        },
      })
    },

    /*
     * PASSWORD COPY
     */
    on_password_copy() {
      let self = this
      copyToClipboard(self.password.hashed)
      self.password.copying = true
      setTimeout(function () {
        self.password.copying = false
      }, 3000)
    },
  },
}
</script>
