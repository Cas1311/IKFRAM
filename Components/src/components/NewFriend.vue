<template>
    <form @submit.prevent="submitForm">
        <div>
            <label for="">Name</label>
            <input type="text" v-model="enteredName">
        </div>
        <div>
            <label for="">Phone</label>
            <input type="tel" v-model="enteredPhone">
        </div>
        <div>
            <label for="">Email</label>
            <input type="email" v-model="enteredEmail">
        </div>
        <div>
            <button> Add Friend</button>
        </div>
    </form>
</template>

<script>
export default {
    emits: ['add-friend'],
    data() {
        return {
            enteredName: '',
            enteredPhone: '',
            enteredEmail: '',
        };
    },
    methods: {
        submitForm() {
            this.$emit('add-friend',
                this.enteredName,
                this.enteredPhone,
                this.enteredEmail,
            );
        },
    },
};
</script>