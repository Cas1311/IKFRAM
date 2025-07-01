<template>
    <section>
        <form @submit.prevent="submitData">
        <input type="text" placeholder="Enter user name" v-model="eneteredName" />
        <input type="number" placeholder="Enter user age" v-model="enteredAge" />
        <button>Set User Data</button>
        </form>
    </section>
</template>

<script>
export default {
  data() {
    return {
      eneteredName: '',
      enteredAge: '',
    };
  },
  methods: {
    submitData() {
      this.$emit('set-data', {
        name: this.eneteredName,
        age: this.enteredAge,
      });
      this.eneteredName = '';
      this.enteredAge = '';
    },
  },
};
</script>