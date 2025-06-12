const app = Vue.createApp({
    data() {
        return {
            userInput: '',
            isVisible: true,
            colorInput: '',
        };
    },
    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        }
    },
});

app.mount('#assignment');