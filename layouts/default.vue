<template>
	<div class="h-screen flex flex-col overflow-hidden">
	  <AppHeader class="shrink-0" />
  
	  <main class="flex-1 overflow-hidden">
		<slot />
	  </main>
  
	  <!-- <AppFooter class="shrink-0" /> -->
	</div>
  </template>
  