<template>
    <li>
        <h2>{{ name }} {{ isFavorite === true ? '(Favorite)' : '' }}</h2>
        <button @click="toggleDetails">{{ detailsAreVisible ? 'Hide' : 'Show' }} Details</button>
        <button @click="toggleFavorite">{{ isFavorite ? 'Unfavorite' : 'Favorite' }}</button>
        <ul v-if="detailsAreVisible">
            <li><strong>Phone: </strong>{{ phoneNumber }}</li>
            <li><strong>Email: </strong>{{ emailAddress }}</li>
        </ul>
        <button @click="deleteFriend">Delete</button>
    </li>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        emailAddress: {
            type: String,
            required: true,
        },
        isFavorite: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            detailsAreVisible: false,
        };
    },
    methods: {
        toggleDetails() {
            this.detailsAreVisible = !this.detailsAreVisible;
        },
        toggleFavorite() {
            this.$emit('toggle-favorite', this.id);
        },
        deleteFriend() {
            this.$emit('delete-friend', this.id);
        },
    },
}; 
</script>