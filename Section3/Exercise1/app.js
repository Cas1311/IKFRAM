const app = Vue.createApp({
    data() {
        return {
            enteredTask: '',
            tasks: [],
            isVisible: true,
            buttonCaption: 'Hide List',
        };
    },
    methods: {
        addTask() {
            this.tasks.push(this.enteredTask);
            this.enteredTask = ''; // Clear the input field after adding the task
        },
        toggleVisibility() {
            this.isVisible = !this.isVisible;
            this.buttonCaption = this.isVisible ? 'Hide List' : 'Show List';
        }
    },
});

app.mount('#assignment');