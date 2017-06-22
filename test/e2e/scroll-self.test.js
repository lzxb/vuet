import { Selector, ClientFunction } from 'testcafe'

fixture`scroll-self`
.page`http://localhost:3000/scroll-self/index.html`

const scrollTo = ClientFunction((el, scrolls) => {
  scrollTo(document.querySelector(el), scrolls)
  function scrollTo (el, scrolls) {
    if ('scrollTop' in el && el !== window) {
      el.scrollLeft = scrolls.x
      el.scrollTop = scrolls.y
    } else {
      el.scrollTo(scrolls.x, scrolls.y)
    }
  }
  return {}
})

test('base', async t => {
  await Selector('.view .inner', { visibilityCheck: true, timeout: 60000 })()
  await t
    .expect(Selector('.x').textContent).eql('50')
    .expect(Selector('.y').textContent).eql('60')
    .expect(Selector('.view').scrollLeft).eql(50)
    .expect(Selector('.view').scrollTop).eql(60)
    .expect(scrollTo('.view', { x: 70, y: 80 })).eql({})

    .click('button.view-2')
    .expect(Selector('.x').textContent).eql('280')
    .expect(Selector('.y').textContent).eql('300')
    .expect(Selector('.view').scrollLeft).eql(280)
    .expect(Selector('.view').scrollTop).eql(300)
    .expect(scrollTo('.view', { x: 290, y: 310 })).eql({})

    .click('button.view-3')
    .expect(Selector('.x').textContent).eql('0')
    .expect(Selector('.y').textContent).eql('0')
    .expect(Selector('.view').scrollLeft).eql(0)
    .expect(Selector('.view').scrollTop).eql(0)
    .expect(scrollTo('.view', { x: 10, y: 20 })).eql({})

    .click('button.view-1')
    .expect(Selector('.x').textContent).eql('70')
    .expect(Selector('.y').textContent).eql('80')
    .expect(Selector('.view').scrollLeft).eql(70)
    .expect(Selector('.view').scrollTop).eql(80)

    .click('button.view-2')
    .expect(Selector('.x').textContent).eql('290')
    .expect(Selector('.y').textContent).eql('310')
    .expect(Selector('.view').scrollLeft).eql(290)
    .expect(Selector('.view').scrollTop).eql(310)

    .click('button.view-3')
    .expect(Selector('.x').textContent).eql('10')
    .expect(Selector('.y').textContent).eql('20')
    .expect(Selector('.view').scrollLeft).eql(10)
    .expect(Selector('.view').scrollTop).eql(20)
})
