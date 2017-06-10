export default {
  data () {
    return {
      data: [],
      tabs: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '精华',
          value: 'good'
        },
        {
          label: '分享',
          value: 'share'
        },
        {
          label: '问答',
          value: 'ask'
        },
        {
          label: '招聘',
          value: 'job'
        }
      ]
    }
  },
  async fetch () {
    const { data } = await window.fetch('https://cnodejs.org/api/v1/topics?mdrender=false').then(response => response.json())
    return {
      data
    }
  }
}
