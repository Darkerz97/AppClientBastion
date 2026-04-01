<script setup>
import Avatar from './Avatar.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  avatarName: {
    type: String,
    default: 'Card Bastion',
  },
  avatarSrc: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__copy">
      <p class="screen-header__eyebrow">Card Bastion</p>
      <h1 class="screen-header__title">{{ title }}</h1>
      <p class="screen-header__subtitle">{{ subtitle }}</p>
    </div>

    <div class="screen-header__side">
      <slot name="action" />
      <Avatar :name="avatarName" :src="avatarSrc" size="md" />
    </div>
  </header>
</template>
