
<template>
  <div class="buttons">
    <button @click="prevdate" class="btn-date prev">
      <chevron-back></chevron-back>
    </button>
    <button @click="nextdate" class="btn-date next">
      <chevron-back></chevron-back>
    </button>
    <button @click="today" class="btn-date today">Today</button>
  </div>
</template>

<script>
import ChevronBack from "./icons/IconChevronBack.vue"

export default {
  data() {
    return {
    }
  },
  components: {
    ChevronBack,
  },
  computed: {
    date() { return this.$store.state.date.toISOString().slice(0, 10) },
  },
  methods: {
    prevdate() {
      this.$store.commit('setPrevDate')
    },
    nextdate() {
      this.$store.commit('setNextDate')
    },
    today() {
      this.$store.commit('setToday')
    },
  }
}

</script>


<style scoped></style>
