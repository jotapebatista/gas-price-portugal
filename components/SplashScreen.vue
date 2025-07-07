<!-- 
    * This component is used to show a splash screen while the app is loading for first time.
    * It is used in the 'app.vue' file
    TODO: Add some transition effects, for example, fade in and out.
    TODO: Make animate logo while loading and adjust time.
 -->

<template>
  <div id="full-screen" v-if="loading" class="bg-gradient-to-br from-primary-600 to-primary-800">
    <div class="center-component text-center">
      <!-- Logo -->
      <div class="mb-8">
        <Icon name="ph:gas-pump" class="w-24 h-24 text-white mx-auto mb-4 animate-bounce-gentle" />
      </div>
      
      <!-- App Name -->
      <h1 class="text-3xl font-bold text-white mb-2 animate-fade-in">
        GasApp
      </h1>
      <p class="text-white/80 text-lg animate-fade-in" style="animation-delay: 0.2s">
        Find the best prices
      </p>
      
      <!-- Loading Indicator -->
      <div class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SplashScreen',
    props: {
        time: {
            type: Number,
            default: 2000
        }
    },
    data(){
        return {
            loading: true,
        }
    }, 
    mounted(){
        setTimeout(() => {
            this.loading = false
        }, this.time)
    }
}
</script>

<style>
/* 
 * Positioning
*/
#full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.center-component {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 
 * Animations
*/
@keyframes fadeInEffect {
  0% { 
    opacity: 0; 
    transform: translateY(20px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInEffect 0.6s ease-out forwards;
}

@keyframes bounceGentle {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.animate-bounce-gentle {
  animation: bounceGentle 2s ease-in-out infinite;
}
</style>