<template>
  <div id="app" class="app-container">
    <header class="header">
      <header-component></header-component>
    </header>
    <main class="main">
      <booking-list-component></booking-list-component>
    </main>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import BookingListComponent from './components/BookingListComponent.vue'


export default {
  name: 'app',
  components: {
    HeaderComponent,
    BookingListComponent
  }
}
</script>

<style></style>