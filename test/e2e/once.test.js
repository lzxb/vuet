import { Selector } from 'testcafe'

fixture`once`
.page`http://localhost:3000/once/index.html`

test('base', async t => {
  await t
    .expect(Selector('.count').textContent).eql('0')
    .expect(Selector('.fetch-count').textContent).eql('0')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')
})
