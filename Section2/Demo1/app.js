// const buttonElement = document.querySelector('button');
// const inputElement = document.querySelector('input');
// const listElement = document.querySelector('ul');

// function addGoal() {
//     const enteredValue = inputElement.value;
//     const listItemElement = document.createElement("li");
//     listItemElement.textContent = enteredValue;
//     listElement.appendChild(listItemElement);

//     inputElement.value = ""; // Clear the input field after adding the goal
// }

// buttonElement.addEventListener("click", addGoal);

Vue.createApp({
    data() {
        return {
            goals: [],
            enteredValue: ''
        };
    },
    methods: {
        addGoal() {
            this.goals.push(this.enteredValue);
            this.enteredValue = ''; // Clear the input field after adding the goal
        }
    }
}).mount('#app');