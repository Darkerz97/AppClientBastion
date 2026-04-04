<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="app-nav" aria-label="Navegacion principal">
    <RouterLink class="nav-link" to="/">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />
        </svg>
      </span>
      <span>Home</span>
    </RouterLink>

    <RouterLink class="nav-link" to="/orders">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m1 3v2h8V8zm0 4v2h5v-2z" />
        </svg>
      </span>
      <span>Compras</span>
    </RouterLink>

    <RouterLink class="nav-link" to="/tournaments">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4h10v4a4 4 0 0 1-3 3.87V14h2a1 1 0 0 1 1 1v2H7v-2a1 1 0 0 1 1-1h2v-2.13A4 4 0 0 1 7 8zm2 2v2a2 2 0 1 0 4 0V6z" />
        </svg>
      </span>
      <span>Torneos</span>
    </RouterLink>

    <RouterLink class="nav-link" to="/preorders">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1m2.5 4a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2z" />
        </svg>
      </span>
      <span>Preventas</span>
    </RouterLink>

    <RouterLink class="nav-link" to="/profile">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4m0 2c-4.418 0-8 2.015-8 4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5C20 16.015 16.418 14 12 14" />
        </svg>
      </span>
      <span>Perfil</span>
    </RouterLink>
  </nav>
</template>
