<template>
  <section>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <p>Here you can view your financial overview, recent transactions, and more.</p>
  </section>
  <section>
    <div class="controls">
      <button>Refresh</button>
      <router-link to="/goals">See all Goals</router-link>
    </div>
    <ul> Goal</ul>
  </section>
  <section>
    <div class="controls">
      <button>Refresh</button>
      <router-link to="/transactions">Add a Transaction</router-link>
    </div>
    <ul>Transactions Overview</ul>
  </section>
</template>
