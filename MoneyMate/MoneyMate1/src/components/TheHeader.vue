<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="MoneyMate Logo" width="40" height="40" />
        <h1>MoneyMate</h1>
      </div>
      
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
        <RouterLink to="/add" class="nav-link">Add Transaction</RouterLink>
        <!-- <RouterLink to="/graphs" class="nav-link">Graphs</RouterLink> -->
        <RouterLink to="/insights" class="nav-link">Insights</RouterLink>
      </nav>

      <div class="header-actions">
        <BaseButton mode="text" class="theme-toggle" @click="toggleTheme">
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Load saved theme preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  } else {
    // Default to system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  }
})

// Watch for system theme changes
watch(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (!localStorage.getItem('theme')) {
    isDarkMode.value = prefersDark
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  }
})
</script>

<style scoped>
.app-header {
  background: var(--header-bg);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo img {
  filter: var(--logo-filter);
}

h1 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--bg-secondary);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo {
    justify-content: center;
  }
  
  .header-actions {
    justify-content: center;
  }
}
</style>
