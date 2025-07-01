<template>
  <header class="header">
    <div class="header__logo">
      <h1>MoneyMate</h1>
    </div>
    <nav class="header__nav">
      <ul>
        <li><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
        <li><router-link to="/transactions" class="nav-link">Transacties</router-link></li>
        <li><router-link to="/goals" class="nav-link">Spaardoelen</router-link></li>
        <li><router-link to="/reports" class="nav-link">Rapportages</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
};
</script>

<style scoped>
.header {
  background-color: #4a6fa5;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header__logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header__nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  border-bottom-color: white;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .header__nav ul {
    margin-top: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
