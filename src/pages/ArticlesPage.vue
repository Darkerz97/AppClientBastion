<script setup>
import { computed, onMounted, ref } from 'vue'
import { getApiErrorMessage } from '../api/axios'
import { getArticles } from '../api/products'
import PageHeader from '../components/PageHeader.vue'
import StateBlock from '../components/StateBlock.vue'

const loading = ref(true)
const error = ref('')
const articles = ref([])

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
})

const totalCount = computed(() => articles.value.length)

function articleName(article) {
  return article.name || article.title || article.card_name || 'Articulo sin nombre'
}

function articleDescription(article) {
  return (
    article.short_description ||
    article.description ||
    article.set_name ||
    'Disponible para consulta dentro de Card Bastion.'
  )
}

function articlePrice(article) {
  const value = Number(article.price ?? article.sale_price ?? article.unit_price ?? 0)
  return currencyFormatter.format(Number.isNaN(value) ? 0 : value)
}

function articleStock(article) {
  const value = article.stock ?? article.current_stock ?? article.inventory ?? null
  return value === null ? 'Sin dato' : `${value}`
}

function articleBadge(article) {
  if (article.category?.name) {
    return article.category.name
  }

  if (article.game) {
    return article.game
  }

  if (article.product_type) {
    return article.product_type
  }

  return 'Card Bastion'
}

function articleImage(article) {
  return (
    article.image_url ||
    article.cover_url ||
    article.featured_image_url ||
    article.images?.[0]?.url ||
    ''
  )
}

async function loadArticles() {
  loading.value = true
  error.value = ''

  try {
    articles.value = await getArticles()
  } catch (requestError) {
    error.value = getApiErrorMessage(
      requestError,
      'No se pudieron cargar los articulos en este momento.',
    )
  } finally {
    loading.value = false
  }
}

onMounted(loadArticles)
</script>

<template>
  <section class="page-section">
    <PageHeader title="Articulos" :subtitle="`${totalCount} disponibles en la app`">
      <button class="icon-button" type="button" @click="loadArticles" :disabled="loading">
        {{ loading ? '...' : 'Rec' }}
      </button>
    </PageHeader>

    <StateBlock
      v-if="loading"
      loading
      title="Cargando articulos"
      message="Estamos consultando el catalogo disponible."
    />

    <StateBlock
      v-else-if="error"
      title="No fue posible mostrar los articulos"
      :message="error"
    >
      <div class="inline-actions" style="margin-top: 16px;">
        <button class="ghost-button" type="button" @click="loadArticles">Intentar de nuevo</button>
      </div>
    </StateBlock>

    <StateBlock
      v-else-if="!articles.length"
      title="Aun no hay articulos disponibles"
      message="Cuando el backend publique articulos para esta app, apareceran aqui."
    />

    <section v-else class="list">
      <article
        v-for="(article, index) in articles"
        :key="article.id || article.uuid || `${articleName(article)}-${index}`"
        class="surface-card article-card"
      >
        <div v-if="articleImage(article)" class="article-image-wrap">
          <img class="article-image" :src="articleImage(article)" :alt="articleName(article)" />
        </div>

        <div class="article-body">
          <span class="eyebrow article-eyebrow">{{ articleBadge(article) }}</span>
          <h2 class="preorder-name">{{ articleName(article) }}</h2>
          <p class="muted">{{ articleDescription(article) }}</p>

          <div class="data-grid article-grid">
            <div class="data-point">
              <span>Precio</span>
              <strong>{{ articlePrice(article) }}</strong>
            </div>

            <div class="data-point">
              <span>Stock</span>
              <strong>{{ articleStock(article) }}</strong>
            </div>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
