

<template>
    <div class="container">
        {{ renderCalendarWeek }}

        <table>
            <!-- <caption>
                {{ currentMonthName + ', ' + currentYearCount }}
            </caption> -->
            <thead>
                <tr>
                    <th class="name" scope="col"></th>
                    <th v-for="days in week" class="head">
                        <span v-if="isToday(days)" class="today">{{ days }} </span>
                        <span v-else>{{ days }} </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- <td v-for="day in week" :date=day v-bind:class="addClassName(room, day)">{{ day }} <br /> -->
                <tr v-for="room in hotelRoomsList">
                    <th scope="row">{{ room }}</th>
                    <td v-for="day in week" :date=day class="cell">

                        <span class="reserved-start" v-if="hasClientReserveFrom(room, day)"
                            v-bind:data="strFrom(hasClientReserveFrom(room, day))"
                            v-bind:style="'width:' + Number(getColspanNumber(room, day) - 2) + '80%'"
                            @click="(e) => showPopup(getClientsData(strFrom(hasClientReserveFrom(room, day))), e)">

                            <span class="clientName">{{ getClientsName(strFrom(hasClientReserveFrom(room, day))) }}
                            </span>
                        </span>

                        <span v-else-if="hasClientReserveMid(room, day)"
                            v-bind:data="strFrom(hasClientReserveMid(room, day))" class="reserved"
                            @click="(e) => showPopup(getClientsData(strFrom(hasClientReserveMid(room, day))), e)">
                            <span class="clientName">{{ getClientsName(strFrom(hasClientReserveMid(room, day))) }}</span>
                        </span>

                        <span v-if="hasClientReserveTo(room, day)" v-bind:data="strFrom(hasClientReserveTo(room, day))"
                            class="reserved-end"
                            @click="(e) => showPopup(getClientsData(strFrom(hasClientReserveTo(room, day))), e)">
                        </span>

                    </td>
                </tr>
            </tbody>
        </table>
        <pop-up :isOpen="setOpenPopup" :bookData="setClientBookData" :coord="setClickTarget"
            :closeFunc="showPopup"></pop-up>
    </div>
</template>

<script>

import PopUp from './PopUp.vue';

export default {
    data() {
        return {
            newTask: "",
            months: ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"],
            week: Array(7),
            openPopup: false,
            clientBookData: false,
            clickTarget: { x: 0, y: 0 }
        }
    },
    computed: {
        setOpenPopup() { return this.openPopup },
        setClientBookData() { return this.clientBookData },
        setClickTarget() { return this.clickTarget },
        allTasks() {
            return this.$store.state.bookings.filter(item => item["type"] === "booked")
        },
        date() {
            return this.$store.state.date
        },
        allbookngs() {
            return this.$store.state.bookings
        },
        hotelRoomsList() {
            const roomNames = [...new Set(this.allTasks.map(({ roomDetails }) => roomDetails.name))]
            return roomNames
        },

        hotelRoomsListById() {
            const roomArray = this.allTasks.reduce((arr, { roomDetails }) => {
                const doesRoomExist = arr.some(room => room.id === roomDetails.id)
                if (doesRoomExist) { return arr }
                else {
                    const newObject = {
                        id: roomDetails.id,
                        name: roomDetails.name,
                    }
                    arr.push(newObject)
                }
                return arr
            }, [])
            return roomArray
        },

        maxBookingDuration() {
            return this.$store.state.maxDuration
        },

        renderCalendarWeek() {
            let startDate = this.date
            let currentDay = +startDate.toISOString().slice(8, 10)
            let currentMonth = startDate.getMonth()
            let currentYear = startDate.getFullYear()
            const daysInMonth = (year = currentYear, month = currentMonth) => new Date(year, month + 1, 0).getDate()

            const currentWeek = this.week;

            for (let i = 0; i < currentWeek.length; i++) {
                if (i === 0) {
                    currentWeek[0] = this.formatDate(startDate)
                } else {

                    let nextDay = currentDay + 1
                    if (nextDay > daysInMonth(currentYear, currentMonth)) {
                        nextDay = 1; // 1
                        currentMonth = currentMonth + 1;
                        if (currentMonth > 11) {
                            currentMonth = 0;
                            currentYear = currentYear + 1
                        };
                    }

                    const someDate = new Date(currentYear, currentMonth, nextDay, 14)
                    currentWeek[i] = this.formatDate(someDate)
                    currentDay = nextDay
                }
            }
            return
        },

    },

    methods: {
        isToday: function (date = '2024-02-28') {
            const cellDate = date.slice(0, 10)
            const currentDate = this.formatDate(new Date())
            return cellDate === currentDate
        },

        hasClientReserveFrom: function (roomName, cellDate) {
            const roomReservationsArray = this.setAllDatesRoomName(roomName)[roomName]
            let client = false
            roomReservationsArray.forEach(contract => {
                if (contract.start.includes(cellDate)) { client = contract }
            });
            return client.id
        },
        hasClientReserveTo: function (roomName, cellDate) {
            const roomReservationsArray = this.setAllDatesRoomName(roomName)[roomName]
            let client = false
            roomReservationsArray.forEach(contract => {
                if (contract.end.includes(cellDate)) { client = contract }
            });
            return client.id
        },
        hasClientReserveMid: function (roomName, cellDate) {
            const roomReservationsArray = this.setAllDatesRoomName(roomName)[roomName]
            let client = false
            roomReservationsArray.forEach(contract => {
                if (!contract.start.includes(cellDate) && !contract.end.includes(cellDate) && contract.allDates.includes(cellDate)) { client = contract }
            });
            return client.id
        },

        setAllDatesRoomName: function (room) {
            const reservations = this.getRoomReservations(room)

            for (const element of reservations[room]) {
                const getAllDates = this.addDates(element.start, element.end)
                element['allDates'] = [...getAllDates]
            };
            return reservations
        },

        strFrom(d) { return JSON.stringify(d) },

        formatDate(d) { return d.toISOString().slice(0, 10) },

        addDates(from, to, arr = []) {
            const maxDurationTime = this.maxBookingDuration
            const endDate = this.formatDate(this.nextDate(to))
            while (from != endDate && arr.length < maxDurationTime) {
                arr.push(from)
                from = this.formatDate(this.nextDate(from))
            }
            return arr
        },

        nextDate(payload = this.date) {
            const tomorrowDate = this.$store.getters.getNextDate(payload)
            return tomorrowDate
        },

        getRoomReservations: function (roomName = false) {
            const reservations = roomName ? {} : []
            if (roomName) {
                reservations[roomName] = this.allTasks.filter((res) => res.roomDetails.name === roomName)
            }
            else {
                for (const room of this.hotelRoomsList) {
                    const obj = {}
                    obj.name = room
                    obj.reservations = this.allTasks.filter((res) => res.roomDetails.name === room)
                    reservations.push(obj)
                }
            }
            return reservations
        },

        getClientsName: function (clientsId) {
            const name = this.$store.getters.getNameById(clientsId)
            return name
        },

        getClientsData: function (clientsId) {
            const data = this.$store.getters.getBookingDataById(clientsId)
            return data
        },

        getColspanNumber: function (room, day) {
            if (this.hasClientReserveFrom(room, day)) {
                const reserve = this.hasClientReserveFrom(room, day)
                const reserveString = this.strFrom(reserve)
                const reserveData = this.getClientsData(reserveString)
                const longTerm = reserveData.allDates.length || 0
                return longTerm
            }
            return 0
        },

        showPopup: function (info = null, e = null) {
            const coord = e && e.screenX ? {
                x: e.screenX,
                y: e.screenY,
            } : this.clickTarget

            if (!this.openPopup && info) {
                this.openPopup = true
                this.clientBookData = info
                this.clickTarget = coord
            } else if (this.openPopup) {
                this.openPopup = false
                this.clientBookData = null
            }
        }
    },
    components: {
        PopUp,
    },

}
</script>


<style>
.cell {
    background-color: #fff;
}

.today {
    border: 1px solid rgba(0, 0, 255, 0.247);
    padding: 10px;
    color: blue
}

th.head {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.359);
    height: min-content;
}

table {
    position: relative;
    overflow: hidden;
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 0.75rem;
    letter-spacing: 1px;
}

caption {
    caption-side: top;
    padding: 10px;
    font-weight: bold;
}

thead,
tfoot {
    background-color: rgb(228 240 245);
}

thead tr th.name {
    visibility: hidden;
    border: none !important;
}

tbody th,
tbody tr,
tbody td {
    /* height: 100px; */
    /* min-width: 120px; */
    height: 40px;
    min-width: 80px;
}

td {
    position: relative;
    padding: 0;
}

td span.reserved-start,
td span.reserved-end,
td span.reserved {
    position: absolute;
    display: block;
    content: '';
    font-size: 18px;
    width: 102%;
    height: 80%;
    left: -1%;
    bottom: 0;
    background: rgb(78, 166, 255);
}

td.cell span.reserved span {
    display: none;
}

td.cell:first-of-type span.reserved span {
    display: block;
}


td span.reserved-end {
    width: 40%;
}


td span.reserved-end {
    border-radius: 0 12px 12px 0;
}

td span.reserved-start {
    /* border-radius: 12px 0 0 12px; */
    border-radius: 12px;
    left: unset;
    /* right: 0; */
    left: 60%;
    overflow: visible;
    z-index: 1;
    text-align: center;
}

.clientName {
    position: absolute;
    /* right: 50%; */
    left: 0;
    bottom: 20%;
    text-align: center;
    width: 100%;
    z-index: 0;
    white-space: nowrap;
}

th,
td {
    border: 1px solid rgb(160 160 160) !important;
    padding: 8px 10px;
}

tbody th {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 20px;
    color: rgb(11, 186, 110);
    font-weight: 600;
    padding-left: 12px;
    width: 140px;
    text-align: left;
}

th,
td,
tr {
    text-align: center;
    width: 120px;
    padding: 10px 4px;
    border: transparent;
}

tfoot th {
    text-align: right;
}

tfoot td {
    font-weight: bold;
}
</style>