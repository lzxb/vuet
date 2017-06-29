<template>
  <div>
    <div class="test-1">
      <h2>Count1</h2>
      <div class="count">{{ count1 }}</div>
      <h3>Reset name</h3>
      <button class="plus" @click="Count1.plus">Count1.plus</button>
      <button class="reduce" @click="Count1.reduce">Count1.reduce</button>
      <button class="fetch" @click="Count1.fetch">Count1.fetch</button>
      <button class="reset" @click="Count1.reset">Count1.reset</button>
    </div>

    <hr>
    <div class="test-2">
      <h2>count2</h2>
      <div class="count">{{ count2 }}</div>
      <h3>Manuals get name</h3>
      <button class="plus" @click="count2s.plus">count2s.plus</button>
      <button class="reduce" @click="count2s.reduce">count2s.reduce</button>
      <button class="fetch" @click="count2s.fetch">count2s.fetch</button>
      <button class="reset" @click="count2s.reset">count2s.reset</button>
    </div>

    <hr>
    <div class="test-3">
      <h2>Test3</h2>
      <div class="count">{{ count3 }}</div>
      <h3>Default name</h3>
      <button class="plus" @click="$count3.plus">$count3.plus</button>
      <button class="reduce" @click="$count3.reduce">$count3.reduce</button>
      <button class="fetch" @click="$count3.fetch">$count3.fetch</button>
      <button class="reset" @click="$count3.reset">$count3.reset</button>
      <button class="fetch-count-all" @click="$count3.fetchCountAll">$count3.fetchCountAll</button>
    </div>
  </div>
</template>
<script>
  import { mapModules, mapRules } from 'vuet'

  export default {
    mixins: [
      mapModules({
        count1: 'count1',
        count2: 'count2',
        count3: 'count3'
      }),
      mapRules({
        manual: [
          { path: 'count1', name: 'Count1' },
          'count2',
          'count3'
        ]
      })
    ]
  }
</script>
