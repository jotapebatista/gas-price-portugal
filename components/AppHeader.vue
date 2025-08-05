<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3 sm:py-4">
        <div class="flex-1 min-w-0">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {{ $t('appTitle') }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
            {{ $t('appSubtitle') }}
          </p>
        </div>
        <div class="flex gap-1 sm:gap-2 ml-4">
          <button 
            v-for="locale in locales" 
            :key="locale.code"
            @click="setLocale(locale.code)"
            :class="[
              'px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md transition-all duration-200 font-medium',
              locale.code === currentLocale 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ locale.code.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locales, locale: currentLocale, setLocale } = useI18n()
</script> 