const app = Vue.createApp({
    data() {
        return {
            counter: 0,
            goal: 37,
            message: 'Not there yet!',
        };
    },
    methods: {
        add(num) {
            this.counter += num;
        },
        reduce(num) {
            this.counter -= num;
        },
        reset() {
            this.counter = 0;
        },
        changeText() {
            if (this.counter < this.goal) {
                this.message = 'Not there yet!';
            } else if (this.counter === this.goal) {
                this.message = 'Goal reached!';
            } else {
                this.message = 'Too much!';
            }
        },
    },
    watch: {
        counter(newValue, oldValue) {
            console.log(`Counter changed from ${oldValue} to ${newValue}`);
            this.changeText();
            that.counter = this.counter;
            if (that.counter) { }
        },
    },
});

app.mount('#assignment');