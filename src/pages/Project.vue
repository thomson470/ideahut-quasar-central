<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
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
      <q-form @submit="get_projects" class="q-mr-sm">
        <q-input
          v-model="search"
          :label="$t('label.search')"
          :disable="loading"
          outlined
          dense
          clearable
        >
          <template v-slot:append>
            <q-btn round dense glossy icon="search" @click="get_projects">
              <q-tooltip>{{ $t('label.search') }}</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </q-form>
      <q-pagination
        v-if="projects.length === page.size || page.value > 1"
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
    <div v-if="initialized && !projects?.length">
      <div class="flex flex-center">
        <div class="login-form text-center">
          <q-icon name="mood_bad" color="deep-orange-11" size="200px" />
          <div class="text-h6">{{ $t('label.unavailable_content') }}</div>
        </div>
      </div>
    </div>
    <div v-else class="row q-pa-sm">
      <q-card
        v-for="(project, index) in projects"
        :key="index"
        class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-xs q-mb-md"
      >
        <q-icon
          v-if="project.icon && project.icon.startsWith('icon:')"
          :name="project.icon.substring(5)"
          size="200px"
          style="width: 100%"
        >
        </q-icon>
        <q-img v-else :src="api.multimedia(project.icon)" height="200px" fit="fill">
          <template v-slot:error>
            <img
              src="~/assets/noimage.png"
              style="width: 100%; height: 200px; object-fit: contain"
              alt=""
            />
          </template>
        </q-img>

        <q-card-section>
          <q-btn
            fab
            glossy
            color="teal"
            icon="hub"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            @click="on_dialog_module(project)"
          />
          <div class="row no-wrap items-center">
            <div class="col text-caption q-pt-md">
              <q-icon
                name="radio_button_checked"
                :color="'Y' === project.isActive ? 'positive' : 'negative'"
              />
              {{ 'Y' === project.isActive ? $t('label.active') : $t('label.inactive') }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              {{ $t('label.module') }} ({{ project.modules }})
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ project.name }}
          </div>
          <div class="text-caption text-grey ellipsis-text lines4">
            {{ project.description }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <q-dialog
    v-model="dialog.module.show"
    transition-show="slide-down"
    transition-hide="none"
    full-width
    full-height
  >
    <Module :parameters="dialog.module.parameters" />
  </q-dialog>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'
import { util } from 'src/scripts/util'
import { api } from 'src/scripts/api'

export default {
  components: {
    Module: defineAsyncComponent(() => import('src/pages/Module.vue')),
  },
  setup() {
    return {
      util,
      api,
      initialized: ref(false),
      page: ref({
        value: 1,
        size: 18,
        min: 1,
        max: 3,
      }),
      order: ref('name'),
      search: ref(null),
      projects: ref([]),
      loading: ref(false),
      sorts: ref([
        { label: 'Name (Asc)', value: 'name' },
        { label: 'Name (Desc)', value: '-name' },
        { label: 'Date (Asc)', value: 'createdOn' },
        { label: 'Date (Desc)', value: '-createdOn' },
      ]),
      dialog: ref({
        module: {
          show: false,
          parameters: null,
        },
      }),
    }
  },

  created() {
    let self = this
    self.get_projects()
  },
  methods: {
    /*
     * GET PROJECTS
     */
    get_projects() {
      let self = this
      self.loading = true
      api.call({
        path: '/projects',
        method: 'post',
        params: {
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
          self.projects = rows
        },
      })
    },

    /*
     * UPDATE PAGE
     */
    on_update_page(value) {
      let self = this
      self.page.value = value
      self.get_projects()
    },

    /*
     * SORT UPDATE
     */
    on_sort_update(value) {
      let self = this
      self.order = value
      self.get_projects()
    },

    /*
     * DIALOG MODULE
     */
    on_dialog_module(project) {
      let self = this
      self.dialog.module = {
        show: true,
        parameters: {
          project: project,
        },
      }
    },
  },
}
</script>
