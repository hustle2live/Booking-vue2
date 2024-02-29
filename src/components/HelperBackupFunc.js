const func = {
   hotelRoomsListById: function () {
      const roomArray = this.allTasks.reduce((arr, { roomDetails }, index) => {
         const doesRoomExist = arr.some((room) => room.id === roomDetails.id);
         if (doesRoomExist) {
            return arr;
         } else {
            const newObject = {
               id: roomDetails.id,
               name: roomDetails.name
            };
            arr.push(newObject);
         }
         return arr;
      }, []);
      return roomArray;
   },

   hasReserved: function () {
      return 'reserver_to' || 'reserver_from' || 'reserver_full' || false;
   },

   addClassName: function (roomName, cellDate) {
      const roomReservationsArray = this.setAllDatesRoomName(roomName)[roomName];
      const classes = {
         start: 'reserved from ',
         end: 'reserved to ',
         res: 'reserved ',
         full: 'reserved from to ',
         none: 'free '
      };

      let out = `<td class={cell}> ${cellDate} </td>`;
      let cellClasses = classes.none;

      const cellAttributes = {
         resfrom: '',
         resto: '',
         res: null,
         resfree: true
      };

      roomReservationsArray.some((el) => {
         if (el.start.includes(cellDate) && el.end.includes(cellDate)) cellClasses = classes.full;
         else if (el.end.includes(cellDate) && el.start.includes(cellDate)) cellClasses = classes.full;
         else if (el.start.includes(cellDate)) cellClasses = classes.start;
         else if (el.end.includes(cellDate)) cellClasses = classes.end;
         else if (el.allDates.includes(cellDate)) cellClasses = classes.res;
      });

      // console.log(cellClasses)
      let spanElem = `<span data="resData" class="reserved"> </span>`;
      let spanElem1 = `<span data="resData" class="from"> </span>`;
      let spanElem2 = `<span data="resData" class="to"> </span>`;

      out = `<td class=${cellClasses}> date </td>`;

      return cellClasses;
   },

   currentMonthName() {
      return this.months[this.date.getMonth()];
   },
   currentYearCount() {
      return this.date.getFullYear();
   }
};
