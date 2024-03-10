const PreferenceInputComponent = {
  props: ['value', 'name', 'type', 'default'],
  emits: ['update:value'],
  template: `
    <div v-if="type === 'bool'" class="form-check form-switch user-select-none">
      <input class="form-check-input" type="checkbox" :id="'switch-' + name" :checked="value" @input="updateBoolean">
      <label class="form-check-label" :for="'switch-' + name">{{ formattedName }}</label>
      </div>
    <div v-else-if="type === 'resolution'" class="mb-3">
      <label class="form-label">{{ formattedName }}</label>
      <div class="input-group">
        <input type="number" min="0" class="form-control" :placeholder="this.default.width" aria-label="Width" v-model="value.width" @input="updateResolution">
        <span class="input-group-text">x</span>
        <input type="number" min="0" class="form-control" :placeholder="this.default.height" aria-label="Heigh" v-model="value.height" @input="updateResolution">
      </div>
    </div>
    <div v-else class="form-group">
        <label :for="'input-' + name">{{ formattedName }}</label>
        <input type="text" class="form-control" :id="'input-' + name" :placeholder="this.default" v-model="value" @input="$emit('update:value', $event.target.value)">
    </div>`,
  methods: {
    updateResolution() {
      this.$emit('update:value', {
        width: this.value.width,
        height: this.value.height,
      });
    },
    updateBoolean() {
      this.$emit('update:value', !this.value);
    }
  },
  computed: {
    // convert the preference name to a human readable format
    // replace _ with a space
    // capitalize the first letter of each word
    formattedName() {
      return this.name.replace(/_/g, ' ').replace(/\w\S*/g, (word) => (word.replace(/^\w/, (c) => c.toUpperCase())));
    }
  }
};