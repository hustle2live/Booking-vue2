import Vue from 'vue';
import Vuex from 'vuex';
import Data from './start-data/bookings.json';

Vue.use(Vuex);

const store = new Vuex.Store({
   state: {
      count: 11,
      initialCount: 0,
      item: 'potato',
      date: new Date(),
      bookings: Data,
      getNextDate: function (action) {
         try {
            const currentDate = typeof action === 'string' ? new Date(action) : action;
            let currentDay = +currentDate.toISOString().slice(8, 10);
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();

            const daysInMonth = (year = currentYear, month = currentMonth) => new Date(year, month + 1, 0).getDate();

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
      },
      maxDuration: 20
   },
   mutations: {
      setToday: (state) => {
         state.date = new Date();
      },

      setNextDate: function (state) {
         let startDate = state.date;
         state.date = state.getNextDate(startDate);
      },

      setPrevDate: (state) => {
         let startDate = state.date;
         let currentDate = startDate;
         let currentDay = +currentDate.toISOString().slice(8, 10);
         let currentMonth = currentDate.getMonth();
         let currentYear = currentDate.getFullYear();
         const daysInMonth = (year = currentYear, month = currentMonth) => new Date(year, month + 1, 0).getDate();

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
      },
      increment: (state) => state.count++,
      decrement: (state) => state.count--,
      initial: (state) => {
         state.count = state.initialCount;
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
   },
   methods: {}
});

export default store;
