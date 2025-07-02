<template>
  <header>
    <nav>
      <div class="brand">
        <router-link to="/" class="brand-link">
          <h1>MoneyMate</h1>
        </router-link>
      </div>
      <ul class="nav-links">
        <li><router-link to="/" class="nav-link">Dashboard</router-link></li>
        <li><router-link to="/transactions" class="nav-link">Transactions</router-link></li>
        <li><router-link to="/goals" class="nav-link">Goals</router-link></li>
      </ul>
      <!-- Mobile menu button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'active': mobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Dashboard</router-link>
      <router-link to="/transactions" class="mobile-nav-link" @click="closeMobileMenu">Transactions</router-link>
      <router-link to="/goals" class="mobile-nav-link" @click="closeMobileMenu">Goals</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      mobileMenuOpen: false
    };
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }
  },
  mounted() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.mobileMenuOpen = false;
      }
    });
  }
};
</script>

<style scoped>
header {
  background: #28a745;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  transition: color 0.3s ease;
}

.brand-link:hover h1 {
  color: #f8fafc;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-link {
  text-decoration: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #3498db;
  background-color: #f8fafc;
}

.nav-link.router-link-active {
  color: #3498db;
  background-color: #eff6ff;
  font-weight: 600;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.mobile-menu-btn span {
  width: 2rem;
  height: 0.25rem;
  background: #64748b;
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.mobile-menu-btn.active span:first-child {
  transform: rotate(45deg);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile menu */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-link {
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #3498db;
  background-color: #f8fafc;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Responsive design */
@media (max-width: 768px) {
  nav {
    padding: 0 1rem;
  }

  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .brand h1 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 0 0.75rem;
    height: 3.5rem;
  }

  .brand h1 {
    font-size: 1.125rem;
  }

  .mobile-menu-btn {
    width: 1.75rem;
    height: 1.75rem;
  }

  .mobile-menu-btn span {
    width: 1.75rem;
    height: 0.2rem;
  }
}
</style>
