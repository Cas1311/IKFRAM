const app = Vue.createApp({
    data() {
        return {
            boxASelected: false,
            boxBSelected: false,
            boxCSelected: false,
        };
    },
    methods: {
        boxSelected(box) {
            if (box === 'A') {
                this.boxASelected = !this.boxASelected; // Toggle selection for box A
            } else if (box === 'B') {
                this.boxBSelected = !this.boxBSelected; // Toggle selection for box B
            } else if (box === 'C') {
                this.boxCSelected = !this.boxCSelected; // Toggle selection for box C
            }
        },
    }
});

app.mount('#styling');