const app = Vue.createApp({
    data() {
        return {
            input: '',
            confirmedInput: '',
        };
    },
    methods: {
        showAlert() {
            alert('Hello World!');
        },
        userInput(event) {
            this.input = event.target.value;
        },
        confirmInput() {
            this.confirmedInput = this.input;
        },
    },
});

app.mount('#assignment');