import { Selector, ClientFunction } from 'testcafe'

fixture`scroll-sync`
  .page`http://localhost:3000/scroll-sync/index.html`

test('window scroll', async t => {
  const getWindowScrolls = ClientFunction(() => ({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
  await Selector('.inner', { visibilityCheck: true })()
  await t
    .expect(Selector('header .window .x').textContent).eql('200')
    .expect(Selector('header .window .y').textContent).eql('300')
    .expect((await getWindowScrolls())).eql({ x: 200, y: 300 })
    .click(Selector('header .window button'))
  await t
    .expect(Selector('header .window .x').textContent).eql('100')
    .expect(Selector('header .window .y').textContent).eql('200')
    .expect((await getWindowScrolls())).eql({ x: 100, y: 200 })
})

test('area scroll', async t => {
  await Selector('ul', { visibilityCheck: true })()
  await t
    .expect(Selector('header .area .x').textContent).eql('100')
    .expect(Selector('header .area .y').textContent).eql('500')
    .click('.inner')
    .expect(Selector('ul:nth-child(1)').scrollLeft).eql(100)
    .expect(Selector('ul:nth-child(1)').scrollTop).eql(500)
    .expect(Selector('ul:nth-child(2)').scrollLeft).eql(100)
    .expect(Selector('ul:nth-child(2)').scrollTop).eql(500)
    .click('header .area button')
    .expect(Selector('ul:nth-child(1)').scrollLeft).eql(200)
    .expect(Selector('ul:nth-child(1)').scrollTop).eql(800)
    .expect(Selector('ul:nth-child(2)').scrollLeft).eql(200)
    .expect(Selector('ul:nth-child(2)').scrollTop).eql(800)
    .expect(Selector('header .area .x').textContent).eql('200')
    .expect(Selector('header .area .y').textContent).eql('800')
})
