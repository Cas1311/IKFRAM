<template>
    <div>
        <active-user :username="user.name" :userage="user.age"></active-user>
        <user-data @set-data="setUserData"></user-data>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: 'Cas',
                age: 23
            }
        };
    },
    methods: {
        setUserData(userData) {
            this.user.name = userData.name;
            this.user.age = userData.age;
        }
    }
};
</script>

<style>
section {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
}
</style>