<template>
    <div class="popup-wrapper">
        <div v-if="openPopup" class="popup-container">
            {{ normalizedBookingData }}
            <p class="name">{{ clientData.name }}</p>
            <p class="phone">{{ clientData.phone }}</p>
            <p class="email">{{ clientData.email }}</p>
            <p class="type">{{ clientData.typeOfApartments }}</p>
            <div>
                <p class="guests">Number of Guests: </p>
                <p>Adults: <span>{{ clientData.adults }}</span></p>
                <p>Children: <span>{{ clientData.children }}</span></p>
            </div>
            <div class="divider"></div>
            <div class="div-button">
                <button @click="closeFunc" class="btn-close">Close</button>
            </div>
        </div>
        <div v-else></div>
    </div>
</template>

<script>


export default {
    props: ['bookData', 'isOpen', 'closeFunc', 'coord'],
    data: function () {
        return {
            booking: this.bookData,
            clientData: {
                name: '',
                phone: '',
                email: '',
                adults: '',
                children: '',
                typeOfApartments: '',
            },
            coordinates: {
                x: '50%',
                y: '20%'
            },
        }
    },

    computed: {
        coordXY: function () {
            this.coordinates.x = this.coord.x
            this.coordinates.y = this.coord.y
            return
        },

        openPopup: function () { return this.isOpen },
        normalizedBookingData: function () {
            if (this.bookData) {
                this.clientData = {
                    name: this.bookData.name || '',
                    phone: this.bookData.phone || '',
                    email: this.bookData.email || '',
                    adults: this.bookData.guestInfo.adults || '',
                    children: this.bookData.guestInfo.children || '',
                    typeOfApartments: this.bookData.typeOfApartments || '',
                }
            }
            this.clickCoordinates(this.coord.x, this.coord.y)
            return
        }
    },
    components: {
    },
    methods: {
        clickCoordinates: function (x, y) {
            const wrapperElement = document.querySelector('.popup-wrapper')
            if (wrapperElement) {
                wrapperElement.style.left = x + 'px'
                wrapperElement.style.top = y + 'px'
            }
            return
        }
    }



}
</script>

<style>
.popup-wrapper {
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.popup-container {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    height: auto;
    border-radius: 10px;
    box-shadow: 2px -2px 14px 4px rgba(68, 68, 68, 0.123);
    font-size: 14px;
    padding: 14px 20px;
    background: #ffffff;
}

p {
    line-height: 18px;
    margin: 2px 0;
}

.name {
    font-size: 22px;
    font-weight: 600;
    margin: 10px 0;
}

.email {
    margin-top: 2px;
    margin-bottom: 22px;
}

.type {
    margin: 4px 0;
}

.guests {
    font-weight: 600;
    margin-top: 4px;
}

.divider {
    display: block;
    width: 100%;
    height: 1px;
    content: '';
    background: rgba(110, 110, 110, 0.26);
    margin: 20px 0 10px;
}


.btn-close:hover {
    color: rgba(16, 16, 82, 0.596);
    background: #ffffff;
}

.btn-close:active {
    background: #f3f3f3;
}

.btn-close {
    display: block;
    box-sizing: border-box;
    margin: 20px 0;
    padding: 4px 12px;
    background: rgba(16, 16, 82, 0.596);
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    border-radius: 5px;
    border: 2px solid rgba(16, 16, 82, 0.50);
    transition: background 100ms;
    box-shadow: none;
}
</style>