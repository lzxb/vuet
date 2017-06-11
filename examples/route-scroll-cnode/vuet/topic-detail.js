export default {
  routeWatch: 'params.id', // 定义页面的更新规则
  data () {
    return {
      data: {
        id: null,
        author_id: null,
        tab: null,
        content: null,
        title: null,
        last_reply_at: null,
        good: false,
        top: false,
        reply_count: 0,
        visit_count: 0,
        create_at: null,
        author: {
          loginname: null,
          avatar_url: null
        },
        replies: [],
        is_collect: false
      }
    }
  },
  async fetch ({ route }) {
    const { data } = await window.fetch(`https://cnodejs.org/api/v1/topic/${route.params.id}`).then(response => response.json())
    return {
      data
    }
  }
}
