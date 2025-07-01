<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
    <div class="form-group">
      <label for="type">Type</label>
      <div class="type-toggle">
        <button 
          type="button" 
          class="toggle-btn" 
          :class="{ 'active': formData.type === 'income' }"
          @click="formData.type = 'income'"
        >
          Inkomsten
        </button>
        <button 
          type="button" 
          class="toggle-btn" 
          :class="{ 'active': formData.type === 'expense' }"
          @click="formData.type = 'expense'"
        >
          Uitgaven
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="amount">Bedrag (€)</label>
      <input 
        type="number" 
        id="amount" 
        v-model.number="formData.amount" 
        step="0.01"
        min="0.01"
        required
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="category">Categorie</label>
      <select 
        id="category" 
        v-model="formData.category" 
        required
        class="form-control"
      >
        <option value="" disabled>Selecteer een categorie</option>
        <option 
          v-for="category in filteredCategories" 
          :key="category.id" 
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="description">Omschrijving (optioneel)</label>
      <input 
        type="text" 
        id="description" 
        v-model="formData.description"
        class="form-control"
        placeholder="Bijv. Boodschappen bij Albert Heijn"
      >
    </div>

    <div class="form-group">
      <label for="date">Datum</label>
      <input 
        type="date" 
        id="date" 
        v-model="formData.date" 
        required
        class="form-control"
      >
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        class="btn btn-secondary"
        @click="$emit('cancel')"
        v-if="showCancel"
      >
        Annuleren
      </button>
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Bezig...' : 'Toevoegen' }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TransactionForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const store = useStore();
    const isSubmitting = ref(false);
    
    const formData = ref({ ...props.initialData });
    
    const categories = computed(() => store.getters['transactions/categories']);
    
    const filteredCategories = computed(() => {
      return categories.value.filter(cat => cat.type === formData.value.type);
    });
    
    const handleSubmit = async () => {
      if (isSubmitting.value) return;
      
      isSubmitting.value = true;
      
      try {
        const transactionData = {
          ...formData.value,
          amount: parseFloat(formData.value.amount),
          date: new Date(formData.value.date).toISOString()
        };
        
        await store.dispatch('transactions/addTransaction', transactionData);
        emit('submit', transactionData);
        
        // Reset form but keep the type
        formData.value = {
          type: formData.value.type,
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        };
      } catch (error) {
        console.error('Error adding transaction:', error);
        // In a real app, you'd show an error message to the user
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(() => {
      // Set the category to the first available one if not set
      if (!formData.value.category && filteredCategories.value.length > 0) {
        formData.value.category = filteredCategories.value[0].id;
      }
    });
    
    return {
      formData,
      isSubmitting,
      filteredCategories,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.transaction-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: #4a6fa5;
  box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  outline: none;
}

.type-toggle {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #eee;
}

.toggle-btn.active {
  background: #4a6fa5;
  color: white;
}

.toggle-btn:first-child {
  border-right: 1px solid #ddd;
}

.toggle-btn.active:first-child {
  border-right-color: #3a5a80;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4a6fa5;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5a80;
}

.btn-primary:disabled {
  background-color: #a0b3cf;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #444;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>
