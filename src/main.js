import Vue from 'vue';
import App from './App.vue';
import store from './store.js';

import './styles/main.css';

new Vue({
   el: '#app',
   store: store,
   render: (h) => h(App)
});
