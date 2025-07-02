<template>
  <section>
    <base-card>
    <h2>Add a New Transaction</h2>
    <transaction-form></transaction-form>
    </base-card>
  </section>
</template>

<script>
import TransactionForm from '@/components/transactions/TransactionForm.vue';

export default{
  components: {
    TransactionForm
  },
}
</script>
