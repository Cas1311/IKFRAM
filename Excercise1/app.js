const app = Vue.createApp({
    data() {
        return {
            name: 'Cas',
            age: 22,
            number: 7,
            imageUrl: 'https://cdn.pixabay.com/photo/2021/05/22/11/38/yt-6273367_640.png',
        };
    },
    methods: {
        showAge() {
            return this.age;
        },
        favNumber() {
        const randomNumber = Math.random();
        return randomNumber;
        }
    }
})

app.mount('#assignment');