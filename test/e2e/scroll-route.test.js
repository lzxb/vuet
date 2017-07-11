import { Selector, ClientFunction } from 'testcafe'

fixture`scroll-route`
  .page`http://localhost:3000/scroll-route/index.html`

test('area scroll forward and back', async t => {
  await t
    // list page
    .expect(Selector('.list-view').scrollTop).eql(0)
    .expect(Selector('.list-view').scrollLeft).eql(0)
    .click(Selector('.list-set-area-scroll'))
    .expect(Selector('.list-view').scrollTop).eql(500)
    .expect(Selector('.list-view').scrollLeft).eql(500)
    .click(Selector('.list-to-detail-1'))

    // detail page
    .expect(Selector('.detail-view').scrollTop).eql(0)
    .expect(Selector('.detail-view').scrollLeft).eql(0)
    .click(Selector('.detail-set-area-scroll'))
    .expect(Selector('.detail-view').scrollTop).eql(500)
    .expect(Selector('.detail-view').scrollLeft).eql(500)
    .click(Selector('.detail-to-list-1'))

    // list page
    .expect(Selector('.list-view').scrollTop).eql(500)
    .expect(Selector('.list-view').scrollLeft).eql(500)
    .click(Selector('.list-to-detail-1'))

    // detail page
    .expect(Selector('.detail-view').scrollTop).eql(500)
    .expect(Selector('.detail-view').scrollLeft).eql(500)
    .click(Selector('.detail-to-list-2'))

    // list page
    .expect(Selector('.list-view').scrollTop).eql(0)
    .expect(Selector('.list-view').scrollLeft).eql(0)
    .click(Selector('.list-to-detail-2'))

    // detail page
    .expect(Selector('.detail-view').scrollTop).eql(0)
    .expect(Selector('.detail-view').scrollLeft).eql(0)
})

test('window scroll forward and back', async t => {
  const getWindowScrolls = ClientFunction(() => {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    }
  })
  await t
    // list page
    .expect(Selector('.list-view').scrollTop).eql(0)
    .expect(Selector('.list-view').scrollLeft).eql(0)
    .click(Selector('.list-set-window-scroll'))
    .expect(getWindowScrolls()).eql({ x: 30, y: 100 })
    .wait(1000)
    .click(Selector('.list-to-detail-1'))

    // detail page
    .expect(Selector('.detail-view').scrollTop).eql(0)
    .expect(Selector('.detail-view').scrollLeft).eql(0)
    .click(Selector('.detail-set-window-scroll'))
    .expect(getWindowScrolls()).eql({ x: 30, y: 100 })
    .click(Selector('.detail-back'))

    // list page
    .expect(getWindowScrolls()).eql({ x: 30, y: 100 })
    .click(Selector('.list-forward'))

    // detail page
    .expect(getWindowScrolls()).eql({ x: 30, y: 100 })
    .click(Selector('.detail-to-list-2'))

    // list page
    .expect(Selector('.list-view').scrollTop).eql(0)
    .expect(Selector('.list-view').scrollLeft).eql(0)
    .click(Selector('.list-to-detail-2'))

    // detail page
    .expect(Selector('.detail-view').scrollTop).eql(0)
    .expect(Selector('.detail-view').scrollLeft).eql(0)
})
