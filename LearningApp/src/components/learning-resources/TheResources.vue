<template>
    <base-card>
        <base-button @click="setSelectedTab('stored-resources')" :mode="storedResButtonMode">Stored
            Resources</base-button>
        <base-button @click="setSelectedTab('add-resource')" :mode="addResButtonMode">Add Resource</base-button>
    </base-card>
    <keep-alive>
        <component :is="selectedTab"></component>
    </keep-alive>
</template>

<script>
import storedResources from './StoredResources.vue';
import addResource from './AddResource.vue';

export default {
    components: {
        storedResources,
        addResource,
    },
    data() {
        return {
            selectedTab: 'stored-resources',
            storedResources: [
                {
                    id: 1,
                    title: 'Vue.js Documentation',
                    url: 'https://vuejs.org/guide/introduction.html',
                    description: 'Official Vue.js documentation for beginners.',
                },
                {
                    id: 2,
                    title: 'JavaScript Info',
                    url: 'https://javascript.info/',
                    description: 'Comprehensive guide to modern JavaScript.',
                },
                {
                    id: 3,
                    title: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                    description: 'Mozilla Developer Network documentation for JavaScript.',
                },
            ],
        };
    },
    provide() {
        return {
            resources: this.storedResources,
            addResource: this.addResource,
            removeResource: this.removeResource,
        };
    },
    computed: {
        storedResButtonMode() {
            return this.selectedTab === 'stored-resources' ? 'null' : 'flat';
        },
        addResButtonMode() {
            return this.selectedTab === 'add-resource' ? 'null' : 'flat';
        },
    },
    methods: {
        setSelectedTab(tab) {
            this.selectedTab = tab;
        },
        addResource(title, description, url) {
            const newResource = {
                id: this.storedResources.length + 1,
                title: title,
                description: description,
                url: url,
            };
            this.storedResources.unshift(newResource); // Add new resource to the beginning of the list
            this.selectedTab = 'stored-resources'; // Switch back to stored resources view
        },
        removeResource(id) {
            const resourceIndex = this.storedResources.findIndex(resource => resource.id === id);
            this.storedResources.splice(resourceIndex, 1); // Remove the resource by index
        },
    },
};
</script>