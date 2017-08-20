import { Selector, ClientFunction } from 'testcafe'

fixture`store`
  .page`http://localhost:3000/store/index.html`

test('store', async t => {
  const localStorage = ClientFunction(() => {
    return JSON.parse(localStorage.getItem('__vuet_store_test__'))
  })
  await t
    .expect(Selector('.count').textContent).eql('1000')
    .expect(localStorage()).eql({ count: 1000 })
    // plus
    .click('button:nth-of-type(1)')
    .expect(Selector('.count').textContent).eql('1001')
    .expect(localStorage()).eql({ count: 1001 })
    // reduce
    .click('button:nth-of-type(2)')
    .expect(Selector('.count').textContent).eql('1000')
    .expect(localStorage()).eql({ count: 1000 })
    // reset
    .click('button:nth-of-type(3)')
    .expect(Selector('.count').textContent).eql('0')
    .expect(localStorage()).eql({ count: 0 })
    // fetch
    .click('button:nth-of-type(4)')
    .expect(Selector('.count').textContent).eql('1000')
    .expect(localStorage()).eql({ count: 1000 })
})
