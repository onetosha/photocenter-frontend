<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="activeTab" background-color="primary" dark centered>
              <v-tab to="/clients">Клиенты</v-tab>
              <v-tab to="/orders">Заказы</v-tab>
              <v-tab to="/services">Услуги</v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app>
      <span class="white--text">&copy; {{ currentYear }} Все права защищены</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      activeTab: null,
    };
  },
}
</script>