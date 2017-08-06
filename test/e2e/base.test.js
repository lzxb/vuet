import { Selector } from 'testcafe'

fixture`base`
  .page`http://localhost:3000/base/index.html`

test.only('base', async t => {
  await t
    .expect(Selector('.count').textContent).eql('0')
    .click('button:nth-of-type(1)')
    .expect(Selector('.count').textContent).eql('1')
    .click('button:nth-of-type(2)')
    .expect(Selector('.count').textContent).eql('0')
    .click('button:nth-of-type(3)')
    .expect(Selector('.count').textContent).eql('1000')
    .click('button:nth-of-type(4)')
    .expect(Selector('.count').textContent).eql('0')
})
