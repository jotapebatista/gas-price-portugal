<template>
  <div v-if="showGuide" class="fixed inset-0 z-[1002] bg-black/50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
      <div class="text-center">
        <div class="text-2xl mb-4">📱</div>
        <h3 class="text-lg font-bold mb-2">{{ $t('installOnIOS') }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('iosInstallInstructions') }}
        </p>
        
        <div class="space-y-3 text-left">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span class="text-sm">{{ $t('iosStep1') }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span class="text-sm">{{ $t('iosStep2') }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span class="text-sm">{{ $t('iosStep3') }}</span>
          </div>
        </div>
        
        <button 
          @click="closeGuide"
          class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          {{ $t('gotIt') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()

interface Props {
  showGuide: boolean;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const closeGuide = () => {
  emit('close')
}
</script> 