<template>
  <the-header></the-header>
  <router-view />
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue';

export default {
  name: 'App',
  components: {
    TheHeader
  },
  mounted() {
    // This is a workaround to ensure the router is ready before the app mounts
    this.$router.isReady().then(() => {
      console.log('Router is ready');
    });
  },
  methods: {
    goBack() {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        // Fallback to home page if no history
        this.$router.push('/');
      }
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

:root {
  /* Brand Colors */
  --brand-primary: #10b981;
  /* Main brand green */
  --brand-secondary: #3a0061;
  /* Secondary brand purple */
  --brand-accent: #06b6d4;
  /* Accent cyan */

  /* Color Palette */
  --green-500: #10b981;
  --blue-500: #3b82f6;
  --purple-500: #8b5cf6;
  --amber-500: #f59e0b;
  --red-500: #ef4444;
  --pink-500: #ec4899;
  --indigo-500: #6366f1;
  --lime-500: #84cc16;
  --cyan-500: #06b6d4;
  --orange-500: #f97316;
  --yellow-500: #eab308;
  --emerald-500: #22c55e;

  /* Semantic Colors */
  --color-success: var(--green-500);
  --color-warning: var(--amber-500);
  --color-error: var(--red-500);
  --color-info: var(--blue-500);
  --color-income: var(--green-500);
  --color-expense: var(--red-500);

  /* Chart Colors - Income Categories */
  --chart-income-1: var(--green-500);
  --chart-income-2: var(--cyan-500);
  --chart-income-3: var(--purple-500);
  --chart-income-4: var(--amber-500);
  --chart-income-5: var(--blue-500);
  --chart-income-6: var(--pink-500);
  --chart-income-7: var(--indigo-500);
  --chart-income-8: var(--lime-500);

  /* Chart Colors - Expense Categories */
  --chart-expense-1: var(--red-500);
  --chart-expense-2: var(--orange-500);
  --chart-expense-3: var(--yellow-500);
  --chart-expense-4: var(--lime-500);
  --chart-expense-5: var(--emerald-500);
  --chart-expense-6: var(--cyan-500);
  --chart-expense-7: var(--blue-500);
  --chart-expense-8: var(--purple-500);

  /* Text Colors */
  --text-primary: #1f2937;
  /* Dark gray for primary text */
  --text-secondary: #64748b;
  /* Medium gray for secondary text */
  --text-muted: #94a3b8;
  /* Light gray for muted text */
  --text-light: #f9fafb;
  /* Light text for dark backgrounds */
  --text-inverse: #ffffff;
  /* White text for dark backgrounds */

  /* Background Colors */
  --bg-primary: #ffffff;
  /* Main background */
  --bg-secondary: #f8fafc;
  /* Secondary background */
  --bg-tertiary: #f1f5f9;
  /* Tertiary background */
  --bg-hover: #f8fafc;
  /* Hover state background */
  --bg-active: #f1f5f9;
  /* Active state background */

  /* Border Colors */
  --border-primary: #e2e8f0;
  /* Primary border */
  --border-secondary: #cbd5e1;
  /* Secondary border */
  --border-light: #f1f5f9;
  /* Light border */
  --border-focus: var(--brand-primary);
  /* Focus state border */

  /* Interactive Colors */
  --interactive-primary: var(--brand-primary);
  --interactive-secondary: var(--brand-secondary);
  --interactive-hover: #059669;
  /* Darker green for hover */
  --interactive-active: #047857;
  /* Even darker green for active */

  /* Shadow Definitions */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Component Specific Colors */
  --card-bg: var(--bg-primary);
  --card-border: var(--border-primary);
  --card-shadow: var(--shadow-md);

  --button-primary-bg: var(--interactive-primary);
  --button-primary-text: var(--text-inverse);
  --button-primary-border: var(--interactive-primary);
  --button-primary-hover-bg: var(--interactive-hover);
  --button-primary-hover-border: var(--interactive-hover);

  --button-secondary-bg: transparent;
  --button-secondary-text: var(--interactive-primary);
  --button-secondary-border: var(--interactive-primary);
  --button-secondary-hover-bg: var(--bg-hover);

  --input-bg: var(--bg-primary);
  --input-border: var(--border-primary);
  --input-text: var(--text-primary);
  --input-placeholder: var(--text-muted);
  --input-focus-border: var(--border-focus);

  --header-bg: var(--brand-primary);
  --header-text: var(--text-inverse);
  --header-border: var(--border-primary);
}

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
