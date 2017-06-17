import { Selector } from 'testcafe'

fixture`life`
.page`http://localhost:3000/life/index.html`

test('base', async t => {
  await t
    .expect(Selector('.count').textContent).eql('0')
    .expect(Selector('.fetch-count').textContent).eql('0')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .expect(Selector('.count').textContent).eql('0')
    .expect(Selector('.fetch-count').textContent).eql('0')

    .click('button')
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('2')

    .click('button')
    .expect(Selector('.count').textContent).eql('0')
    .expect(Selector('.fetch-count').textContent).eql('0')
})
