export default {
  routeWatch: 'query',
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
  async fetch ({ route }) {
    const { tab = '' } = route.query
    const { data } = await window.fetch(`https://cnodejs.org/api/v1/topics?mdrender=false&tab=${tab}`).then(response => response.json())
    data.forEach(item => {
      console.log(item.title)
    })
    return {
      data
    }
  }
}
