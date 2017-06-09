<template>
  <div>
    <div class="test-1">
      <h2>Test1</h2>
      <div class="count">{{ test1.count }}</div>
      <h3>Reset name</h3>
      <button class="plus" @click="Test1.plus">Test1.plus</button>
      <button class="reduce" @click="Test1.reduce">Test1.reduce</button>
    </div>

    <hr>
    <div class="test-2">
      <h2>test2</h2>
      <div class="count">{{ test2.count }}</div>
      <h3>Manuals get name</h3>
      <button class="plus" @click="test2s.plus">test2s.plus</button>
      <button class="reduce" @click="test2s.reduce">test2s.reduce</button>
    </div>

    <hr>
    <div class="test-3">
      <h2>Test3</h2>
      <div class="count">{{ test3.count }}</div>
      <h3>Default name</h3>
      <button class="plus" @click="$test3.plus">test3.plus</button>
      <button class="reduce" @click="$test3.reduce">test3.reduce</button>
    </div>
  </div>
</template>
<script>
  import { mapModules, mapRules } from 'vuet'

  export default {
    mixins: [
      mapModules({
        test1: 'test1',
        test2: 'test2',
        test3: 'test3'
      }),
      mapRules({
        manual: [
          { path: 'test1', name: 'Test1' },
          'test2',
          'test3'
        ]
      })
    ]
  }
</script>
