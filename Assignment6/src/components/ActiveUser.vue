<template>
    <section>
        <h2>{{ username }}</h2>
        <h3>{{ userage }}</h3>
    </section>
</template>

<script>
export default {
  props: ['username', 'userage'],
};
</script>

<style>

</style>