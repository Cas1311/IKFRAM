const app = Vue.createApp({
    data() {
        return {
            friends: [
                { id: 'manuel', name: 'Manuel Lorenz', phone: '123-456-7890', email: 'manuel@localhost.com' },
                { id: 'julie', name: 'Julie Jones', phone: '987-654-3210', email: 'julie@localhost.com' },
            ],
        };
    },

});

app.component('user-contact', {
    template: `
    <li>
        <h2> {{ friend.name}} </h2>
        <button @click="toggleDetails">Show Details</button>
        <ul v-if="showDetails">
          <li><strong>Phone:</strong> {{ friend.phone}} </li>
          <li><strong>Email:</strong> {{ friend.email}}</li>
        </ul>
      </li>`,
    data() {
        return {
            showDetails: false,
            friend:
                { id: 'manuel', name: 'Manuel Lorenz', phone: '123-456-7890', email: 'manuel@localhost.com' },
        };
    },
    methods: {
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
    },
});

app.mount('#app');