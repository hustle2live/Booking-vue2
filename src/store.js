import Vue from 'vue';
import Vuex from 'vuex';
import Data from './start-data/bookings.json';

Vue.use(Vuex);

const store = new Vuex.Store({
   state: {
      date: new Date(),
      bookings: Data,
      maxDuration: 20
   },
   mutations: {
      setToday: (state) => {
         state.date = new Date();
      },

      setNextDate: function (state) {
         const nextDate = this.getters.getNextDate(state.date);
         state.date = nextDate;
      },

      setPrevDate: (state) => {
         let startDate = state.date;
         let currentDate = startDate;
         let currentDay = +currentDate.toISOString().slice(8, 10);
         let currentMonth = currentDate.getMonth();
         let currentYear = currentDate.getFullYear();
         const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

         let nextDay = currentDay - 1;
         if (nextDay < 0) {
            currentMonth = currentMonth - 1;
            if (currentMonth < 0) {
               currentMonth = 11;
               currentYear = currentYear - 1;
            }
            nextDay = daysInMonth(currentYear, currentMonth);
         }

         const nextDate = new Date(currentYear, currentMonth, nextDay, 14);
         state.date = nextDate;
      }
   },
   getters: {
      getNameById: (state) => (propId) => {
         const contract = state.bookings.find((item) => item.id.toString() === propId);
         return contract ? contract.name : null;
      },
      getBookingDataById: (state) => (propId) => {
         const contract = state.bookings.find((item) => item.id.toString() === propId);
         return contract ? contract : null;
      },
      getNextDate: () => (propDate) => {
         try {
            const currentDate = typeof propDate === 'string' ? new Date(propDate) : propDate;
            let currentDay = +currentDate.toISOString().slice(8, 10);
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();

            const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

            let nextDay = currentDay + 1;
            if (nextDay > daysInMonth(currentYear, currentMonth)) {
               nextDay = 1; // 1
               currentMonth = currentMonth + 1;
               if (currentMonth > 11) {
                  currentMonth = 0;
                  currentYear = currentYear + 1;
               }
            }

            const nextDate = new Date(currentYear, currentMonth, nextDay, 14);
            return nextDate;
         } catch (error) {
            console.log(error);
         }
      }
   },
   methods: {}
});

export default store;
