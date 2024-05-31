<template>
    <div 
        class="row q-pl-sm q-pr-sm"
    >
        <!--
            IMAGE
        -->
        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
            <q-card 
                bordered
            >
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
                            @click="icon.sync.show = true; icon.sync.password = null;"
                        >
                            <q-tooltip>{{ $t("label.house_keeping") }}</q-tooltip>
                        </q-btn>
                    </q-item-section>
                </q-item>
                <q-separator/>
                <q-card-section class="q-pa-xs">
                    <q-uploader
                        style="width: 100%;"
                        accept=".jpg, .png, image/*"
                        @added="on_icon_add"
                        @removed="on_icon_del"
                        color="transparent"
                        hide-upload-btn
                        flat
                        bordered
                    />
                </q-card-section>
                <q-separator/>
                <q-card-actions 
                    v-if="icon.file || icon.path" 
                    class="q-pa-xs q-pl-sm q-pr-sm row"
                >
                    <q-select
                        v-if="icon.file && !icon.path"
                        class="col-12"
                        v-model="icon.type"
                        :label="$t('label.type')"
                        :options="icon.types"
                        option-value="value"
                        option-label="label"
                        borderless
                        dense
                    >
                        <template v-slot:after>
                            <q-btn 
                                flat 
                                round 
                                dense 
                                icon="send"
                                @click="on_icon_upload"
                            />
                        </template>
                    </q-select>
                    <q-input 
                        v-if="icon.path"
                        class="col-12"
                        v-model="icon.path"
                        standout
                        readonly
                        dense
                    >
                        <template v-slot:append>
                            <q-btn 
                                v-if="icon.copying"
                                :label="$t('copied')"
                                flat 
                                color="green"
                                dense 
                                icon="done_all"
                                no-caps
                                disable
                            />
                            <q-btn 
                                v-else
                                flat 
                                round 
                                dense 
                                icon="content_copy"
                                @click="on_icon_copy"
                            />
                        </template>
                    </q-input>
                </q-card-actions>
                <q-inner-loading :showing="icon.loading"/>
            </q-card>
        </div>
        <!--
            BCRYPT
        -->
        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
            <q-card 
                bordered
            >
                <q-item>
                    <q-item-section>
                        <q-item-label class="text-h6">{{ $t('label.bcrypt') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator/>
                <q-card-section class="q-pa-none">
                    <q-tabs
                        v-model="bcrypt.tab"
                        dense
                        no-caps
                        align="justify"
                        inline-label
                    >
                        <q-tab name="generate" icon="pattern" :label="$t('label.generate')" />
                        <q-tab name="check" icon="rule" :label="$t('label.check')" />
                    </q-tabs> 
                    <q-separator/>
                    <q-tab-panels v-model="bcrypt.tab" animated>
                        <q-tab-panel 
                            name="generate" 
                            class="q-pa-sm"
                        >
                            <div 
                                class="q-field--outlined q-pa-none"
                            >           
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
                                                <div style="width: 5px;"></div>
                                            </template>
                                            <q-tooltip>{{ $t('label.round') }}</q-tooltip>
                                        </q-select>
                                    </template>
                                    <template v-slot:append>
                                        <q-btn 
                                            round 
                                            dense 
                                            flat 
                                            icon="send" 
                                            @click="on_bcrypt_generate"
                                        >
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
                                    <q-btn 
                                        v-else
                                        flat 
                                        round 
                                        dense 
                                        icon="content_copy"
                                        @click="on_bcrypt_copy"
                                    >
                                        <q-tooltip>{{ $t('label.copy_to_clipboard') }}</q-tooltip>
                                    </q-btn>
                                </template>
                            </q-input>
                        </q-tab-panel>
                        <q-tab-panel 
                            name="check"
                            class="q-pa-sm"
                        >
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
                <q-inner-loading :showing="bcrypt.loading"/>
            </q-card>
        </div>
        <!--
            PASSWORD
        -->
        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
            <q-card 
                bordered
            >
                <q-item>
                    <q-item-section>
                        <q-item-label class="text-h6">{{ $t('label.password') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator/>
                <q-card-section class="q-pa-sm">
                    <div 
                        class="row"
                    >    
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
                            <q-btn 
                                round 
                                dense 
                                flat 
                                color="negative"
                                icon="close" 
                                @click="password.hashed = null"
                            >
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
                            <q-btn 
                                v-else
                                flat 
                                round 
                                dense 
                                icon="content_copy"
                                @click="on_password_copy"
                            >
                                <q-tooltip>{{ $t('label.copy_to_clipboard') }}</q-tooltip>
                            </q-btn>
                        </template>
                    </q-input>
                </q-card-section>
                <q-inner-loading :showing="password.loading"/>
            </q-card>
        </div>
    </div>
    
    <q-dialog v-model="icon.sync.show" persistent>
        <q-card>
            <q-card-section class="q-pa-xs q-pl-lg q-pr-lg text-center">
                {{ $t("label.password") }}
            </q-card-section>
            <q-card-section class="q-pa-sm">
                <q-form @submit="on_icon_sync">
                    <q-input
                        v-model="icon.sync.password"
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
                    <q-btn
                        no-caps
                        ripple
                        glossy
                        :label="$t('label.cancel')"
                        color="negative"
                        v-close-popup
                    />
                </div>
                <div class="col-6 text-right">
                    <q-btn
                        no-caps
                        ripple
                        glossy
                        :label="$t('label.continue')"
                        color="positive"
                        :loading="icon.sync.loading"
                        @click="on_icon_sync"
                    />
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
  
<script>
import { ref } from "vue";
import { copyToClipboard } from 'quasar';
import { util } from "src/scripts/util";
import { uix } from "src/scripts/uix";
import { api } from "src/scripts/api";

export default {
    
    setup() {
        return {
            util,
            uix,
            copyToClipboard,
            icon: ref({
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
            bcrypt: ref({
                tab: "generate",
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
        };
    },

    created() {
        let self = this;
        api.call({
            path: "/tool/icon/types",
            onSuccess(data) {
                self.icon.types = [{label: "", value: null}]
                if (util.isArray(data)) {
                    Array.prototype.push.apply(self.icon.types, data);
                }
            },
            notify: false,
        });
        self.bcrypt.rounds = [null];
        for (let i = 4; i < 17; i++) {
            self.bcrypt.rounds.push(i);
        }
    },
    methods: {
       
        /*
         * ICON SYNC
         */
        on_icon_sync() {
            let self = this;
            let password = self.icon.sync.password;
            password = util.isString(password) ? password : "";
            if (!password?.length) {
                uix.error("error.required", "label.password");
                return;
            }
            self.icon.sync.loading = true;
            api.call({
                path: "/tool/icon/sync",
                method: 'post',
                params: {
                    password: password,
                },
                onFinish() {
                    self.icon.sync.loading = false;
                },
                onSuccess() {
                    self.icon.sync.show = false;
                }
            });
        },

        /*
         * ICON ADD
         */
        on_icon_add(files) {
            let icon = this.icon;
            icon.file = files[0];
            icon.type = null;
            icon.path = null;
        },

        /*
         * ICON DEL
         */
        on_icon_del(files) {
            let icon = this.icon;
            icon.file = null;
            icon.type = null;
            icon.path = null;
        },

        /*
         * ICON COPY
         */
        on_icon_copy() {
            let self = this;
            copyToClipboard(self.icon.path);
            self.icon.copying = true;
            setTimeout(function() { self.icon.copying = false; }, 3000);
        },

        /*
         * ICON UPLOAD FILE
         */
        on_icon_upload() {
            let self = this;
            let type = self.icon.type;
            if (!type?.value) {
                uix.error("error.required", "label.type");
                return;
            }
            let file = self.icon.file;
            if (!file) {
                uix.error("error.required", "label.file");
                return;
            }
            let form = new FormData();
            form.append("file", file);
            form.append("type", type.value);
            self.icon.loading = true;
            api.call({
                path: "/tool/icon/upload",
                method: 'post',
                data: form,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onFinish() {
                    self.icon.loading = false;
                },
                onSuccess(data) {
                    self.icon.path = data;
                },
            });

        },


        /*
         * BCRYPT COPY
         */
        on_bcrypt_copy() {
            let self = this;
            copyToClipboard(self.bcrypt.gen_hash);
            self.bcrypt.copying = true;
            setTimeout(function() { self.bcrypt.copying = false; }, 3000);
        },

        /*
         * BCRYPT GENERATE
         */
        on_bcrypt_generate() {
            let self = this;
            let password = self.bcrypt.gen_pass;
            password = util.isString(password) ? password : "";
            if (!password?.length) {
                uix.error("error.required", "label.password");
                return;
            }
            self.bcrypt.loading = true;
            api.call({
                path: "/tool/bcrypt/generate",
                method: 'post',
                params: {
                    round: self.bcrypt.round,
                    password: password,
                },
                onFinish() {
                    self.bcrypt.loading = false;
                },
                onSuccess(data) {
                    self.bcrypt.gen_hash = data;
                },
            });
        },
        
        /*
         * BCRYPT CHECK
         */
        on_bcrypt_check() {
            let self = this;
            self.bcrypt.chk_result = null;
            let password = self.bcrypt.chk_pass;
            password = util.isString(password) ? password : "";
            if (!password?.length) {
                uix.error("error.required", "label.password");
                return;
            }
            let hash = self.bcrypt.chk_hash;
            hash = util.isString(hash) ? hash : "";
            if (!hash?.length) {
                uix.error("error.required", "label.hash");
                return;
            }
            self.bcrypt.checking = true;
            api.call({
                path: "/tool/bcrypt/check",
                method: 'post',
                params: {
                    password: password,
                    hash: hash,
                },
                onFinish() {
                    self.bcrypt.checking = false;
                },
                onSuccess(data) {
                    self.bcrypt.chk_result = data;
                },
            });
        },

        /*
         * PASSWORD ENCRYPT
         */
        on_password_encrypt() {
            let self = this;
            let password = self.password.value;
            password = util.isString(password) ? password : "";
            if (!password?.length) {
                uix.error("error.required", "label.password");
                return;
            }
            self.password.loading = true;
            api.call({
                path: "/tool/password/encrypt",
                method: 'post',
                params: {
                    password: password,
                    factor: self.password.factor,
                },
                onFinish() {
                    self.password.loading = false;
                },
                onSuccess(data) {
                    self.password.hashed = data;
                },
            });
        },

        /*
         * PASSWORD COPY
         */
        on_password_copy() {
            let self = this;
            copyToClipboard(self.password.hashed);
            self.password.copying = true;
            setTimeout(function() { self.password.copying = false; }, 3000);
        },
    
    },

};
</script>
  