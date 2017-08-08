import { Selector } from 'testcafe'

fixture`temp`
  .page`http://localhost:3000/temp/index.html`

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
