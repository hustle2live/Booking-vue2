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
import ListBookingComponent from './components/ListBookingComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import CounterComponent from './components/CounterComponent.vue'
import BookingListComponent from './components/BookingListComponent.vue'


export default {
  name: 'app',
  components: {
    ListBookingComponent,
    HeaderComponent,
    CounterComponent,
    BookingListComponent
  }
}
</script>

<style></style>