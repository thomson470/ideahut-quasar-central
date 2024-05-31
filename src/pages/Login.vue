<template>
    <div class="flex flex-center q-mt-xl">
        <div class="login-form text-center">
           <q-form class="q-mt-lg" @submit="on_login_click">
                <q-input
                    v-model="username"
                    class="q-mb-md"
                    type="text"
                    :placeholder="$t('label.username')"
                    rounded
                    outlined
                >
                <template v-slot:prepend>
                    <q-icon name="account_box" />
                </template>
                </q-input>
            </q-form>
            <q-form @submit="on_login_click">
                <q-input
                    v-model="password"
                    class="q-mb-md"
                    :type="is_show_password ? 'text' : 'password'"
                    :placeholder="$t('label.password')"
                    rounded
                    outlined
                >
                <template v-slot:prepend>
                    <q-icon name="lock" />
                </template>
                <template v-slot:append>
                    <q-icon
                        :name="is_show_password ? 'visibility' : 'visibility_off'"
                        @click="is_show_password = !is_show_password"
                    />
                </template>
                </q-input>
            </q-form>
            <q-btn
                no-caps
                ripple
                color="primary"
                @click="on_login_click"
                :loading="is_in_progress"
                :label="$t('label.login')"
            />
        </div>
    </div>
</template>
  
<script>
import { ref } from "vue";
import { util } from "src/scripts/util";
import { uix } from "src/scripts/uix";
import { api } from "src/scripts/api";
import { storage } from "src/scripts/storage";

export default {
    setup() {
        return {
            util,
            uix,
            username: ref(null),
            password: ref(null),
            is_show_login: ref(false),
            is_in_progress: ref(false),
            is_show_password: ref(false),
        };
    },
    methods: {
        
        on_login_click() {
            let self = this;
            let username = self.username;
            if (!(username && username.length > 0)) {
                uix.error("error.required", "label.username");
                return false;
            }
            let password = self.password;
            if (!(password && password.length > 0)) {
                uix.error("error.required", "label.password");
                return false;
            }
            self.is_in_progress = true;
            api.call({
                path: "/login",
                method: "post",
                params: {
                    username: username,
                    password: password,
                },
                onFinish() {
                    self.is_in_progress = false;
                },
                onSuccess(data, info) {
                    data = util.isObject(data) ? data : {};
                    info = util.isObject(info) ? info : {};
                    if (util.isString(data.authorization)) {
                        let auth = storage.auth();
                        auth.token = data.authorization;
                        storage.auth(auth);
                    }
                    if (util.isObject(data.account)) {
                        storage.user(data.account);
                    }
                    if (util.isObject(info.config)) {
                        storage.config(info.config);
                    }
                    self.$router.push({ path: "/"});
                },
            });
        },
    },
  };
  </script>
  