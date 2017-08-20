import { Selector } from 'testcafe'

fixture`base`
  .page`http://localhost:3000/base/index.html`

test('base', async t => {
  await t
    .expect(Selector('.count').textContent).eql('1000')
    // plus
    .click('button:nth-of-type(1)')
    .expect(Selector('.count').textContent).eql('1001')
    // reduce
    .click('button:nth-of-type(2)')
    .expect(Selector('.count').textContent).eql('1000')
    // reset
    .click('button:nth-of-type(3)')
    .expect(Selector('.count').textContent).eql('0')
    // fetch
    .click('button:nth-of-type(4)')
    .expect(Selector('.count').textContent).eql('1000')
})
