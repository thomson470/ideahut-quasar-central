<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-card>
    <q-card-section class="q-pa-xs">
      <q-card>
        <q-btn
          class="absolute"
          flat
          round
          glossy
          icon="close"
          color="red"
          style="top: 0px; right: 0px; z-index: 99"
          v-close-popup
        >
          <q-tooltip>{{ $t('label.close') }}</q-tooltip>
        </q-btn>
        <q-card-section horizontal>
          <div v-if="project.icon && project.icon.startsWith('icon:')" class="col-3">
            <q-icon :name="project.icon.substring(5)" size="200px" style="width: 100%"> </q-icon>
          </div>

          <q-img v-else class="col-3" :src="api.multimedia(project.icon)" height="200px" fit="fill">
            <template v-slot:error>
              <img
                src="~/assets/noimage.png"
                style="width: 100%; height: 200px; object-fit: contain"
                alt=""
              />
            </template>
          </q-img>
          <q-card-section>
            <div class="text-caption">
              <q-icon
                name="radio_button_checked"
                :color="'Y' === project.isActive ? 'positive' : 'negative'"
              />
              {{ 'Y' === project.isActive ? $t('label.active') : $t('label.inactive') }}
            </div>
            <div class="text-h5">
              {{ project.name }}
            </div>
            <div class="text-body2 text-grey">
              {{ project.description }}
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section class="q-pa-xs">
      <div class="row q-pa-sm justify-end">
        <q-select
          v-model="order"
          :label="$t('label.sort')"
          :options="sorts"
          :disable="loading"
          option-value="value"
          option-label="label"
          borderless
          dense
          emit-value
          map-options
          class="q-mr-sm"
          @update:model-value="on_sort_update"
        />
        <q-form @submit="get_modules" class="q-mr-sm">
          <q-input
            v-model="search"
            :label="$t('label.search')"
            :disable="loading"
            outlined
            dense
            clearable
          >
            <template v-slot:append>
              <q-btn round dense glossy icon="search" @click="get_modules">
                <q-tooltip>{{ $t('label.search') }}</q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </q-form>
        <q-pagination
          v-if="modules.length === page.size || page.value > 1"
          v-model="page.value"
          icon-prev="arrow_back_ios"
          icon-next="arrow_forward_ios"
          direction-links
          :min="page.min"
          :max="page.max"
          :disable="loading"
          @update:model-value="on_update_page"
        />
      </div>
      <div v-if="initialized && !modules?.length">
        <div class="flex flex-center">
          <div class="login-form text-center">
            <q-icon name="mood_bad" color="deep-orange-11" size="200px" />
            <div class="text-h6">{{ $t('label.unavailable_content') }}</div>
          </div>
        </div>
      </div>
      <div v-else class="row q-pa-sm" style="max-height: 58vh; overflow-y: scroll">
        <q-card
          v-for="(module, index) in modules"
          :key="index"
          class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-xs q-mb-md"
        >
          <q-icon
            v-if="module.icon && module.icon.startsWith('icon:')"
            :name="module.icon.substring(5)"
            size="160px"
            style="width: 100%"
          >
          </q-icon>
          <q-img v-else :src="api.multimedia(module.icon)" height="160px" fit="fill">
            <template v-slot:error>
              <img
                src="~/assets/noimage.png"
                style="width: 100%; height: 160px; object-fit: contain"
                alt=""
              />
            </template>
          </q-img>

          <q-card-section>
            <q-btn
              fab
              glossy
              color="teal"
              icon="send"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%)"
              :disable="'Y' !== project.isActive || 'Y' !== module.isActive"
              @click="on_open_page(module)"
            >
              <q-tooltip>{{ $t('label.open') }}</q-tooltip>
            </q-btn>
            <div class="row no-wrap items-center">
              <div class="col text-caption q-pt-md">
                <q-icon
                  name="radio_button_checked"
                  :color="'Y' === module.isActive ? 'positive' : 'negative'"
                />
                {{ 'Y' === module.isActive ? $t('label.active') : $t('label.inactive') }}
              </div>
              <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"></div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">
              {{ module.name }}
            </div>
            <div class="text-caption text-grey ellipsis-text lines4">
              {{ module.description }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import { util } from 'src/scripts/util'
import { api } from 'src/scripts/api'

export default {
  props: ['parameters'],
  setup() {
    return {
      util,
      api,
      initialized: ref(false),
      project: ref({}),
      page: ref({
        value: 1,
        size: 18,
        min: 1,
        max: 3,
      }),
      order: ref('name'),
      search: ref(null),
      modules: ref([]),
      loading: ref(false),
      sorts: ref([
        { label: 'Name (Asc)', value: 'name' },
        { label: 'Name (Desc)', value: '-name' },
        { label: 'Date (Asc)', value: 'createdOn' },
        { label: 'Date (Desc)', value: '-createdOn' },
      ]),
    }
  },

  created() {
    let self = this
    let params = util.isObject(self.parameters) ? self.parameters : {}
    self.project = util.isObject(params.project) ? params.project : {}
    self.get_modules()
  },
  methods: {
    /*
     * GET MODULES
     */
    get_modules() {
      let self = this
      self.loading = true
      api.call({
        path: '/modules',
        method: 'post',
        params: {
          projectId: self.project.projectId,
          index: self.page.value,
          size: self.page.size,
          order: self.order,
          search: self.search,
        },
        onFinish() {
          self.loading = false
          self.initialized = true
        },
        onSuccess(data) {
          let min = 1
          let max = 1
          let rows = []
          if (util.isObject(data)) {
            if (util.isNumber(data.index)) {
              min = data.index - 1
              if (min < 1) {
                min = 1
              }
            }
            max = min + 2
            rows = util.isArray(data.data) ? data.data : []
            if (rows.length < self.page.size) {
              max = self.page.value
            }
          }
          let page = self.page
          page.min = min
          page.max = max
          self.modules = rows
        },
      })
    },

    /*
     * UPDATE PAGE
     */
    on_update_page(value) {
      let self = this
      self.page.value = value
      self.get_modules()
    },

    /*
     * SORT UPDATE
     */
    on_sort_update(value) {
      let self = this
      self.order = value
      self.get_modules()
    },

    /*
     * OPEN PAGE
     */
    on_open_page(module) {
      let self = this
      let url = new URL(window.location.href)
      let href =
        url.protocol +
        '//' +
        url.hostname +
        (url.port !== 80 && url.port !== 443 ? ':' + url.port : '') +
        util.webPath() +
        '/redirect?projectId=' +
        self.project.projectId +
        '&moduleId=' +
        module.moduleId
      window.open(href, '_blank')
    },
  },
}
</script>
