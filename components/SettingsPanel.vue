<template>
  <div class="h-full bg-white dark:bg-gray-900 overflow-y-auto">
    <div class="p-4">
      <!-- Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t("settings") }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("settingsDescription") }}
        </p>
      </div>

      <div class="space-y-6">
        <!-- Appearance Section -->
        <div class="space-y-4">
          <h4 class="text-base font-medium text-gray-900 dark:text-white">
            {{ $t("appearance") }}
          </h4>
          
          <!-- Theme Toggle -->
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <Icon name="heroicons:sun" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t("theme") }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ $t("themeDescription") }}
                </p>
              </div>
            </div>
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              :aria-label="$t('toggleTheme')"
            >
              <Icon 
                v-if="colorMode.value === 'dark'" 
                name="heroicons:sun" 
                class="w-5 h-5 text-yellow-500" 
              />
              <Icon 
                v-else 
                name="heroicons:moon" 
                class="w-5 h-5 text-gray-700" 
              />
            </button>
          </div>
        </div>

        <!-- Language Section -->
        <div class="space-y-4">
          <h4 class="text-base font-medium text-gray-900 dark:text-white">
            {{ $t("language") }}
          </h4>
          
          <div class="space-y-2">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              @click="setLocale(locale.code)"
              class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="locale.code === currentLocale ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''"
            >
              <div class="flex items-center space-x-3">
                <Icon name="heroicons:language" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ locale.name }}
                </span>
              </div>
              <Icon 
                v-if="locale.code === currentLocale" 
                name="heroicons:check" 
                class="w-5 h-5 text-blue-600 dark:text-blue-400" 
              />
            </button>
          </div>
        </div>

        <!-- App Information Section -->
        <div class="space-y-4">
          <h4 class="text-base font-medium text-gray-900 dark:text-white">
            {{ $t("appInfo") }}
          </h4>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center space-x-3">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ $t("version") }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ appVersion }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center space-x-3">
                <Icon name="heroicons:document-text" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ $t("dataSource") }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ $t("dataSourceDescription") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="space-y-4">
          <h4 class="text-base font-medium text-gray-900 dark:text-white">
            {{ $t("about") }}
          </h4>
          
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t("aboutDescription") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { locale, locales } = useI18n()

const { t: $t } = useI18n()

// App version - you can update this as needed
const appVersion = ref('1.0.0')

// Available locales
const availableLocales = computed(() => {
  return locales.value
})

const currentLocale = computed(() => locale.value)

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const setLocale = async (newLocale: string) => {
  // Switch locale using the i18n composable
  locale.value = newLocale as 'en' | 'pt'
}
</script> 