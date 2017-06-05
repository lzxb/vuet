import { Selector } from 'testcafe'

fixture`need`
.page`http://localhost:3000/need/index.html`

test('base', async t => {
  await t
    .expect(Selector('.count').textContent).eql('0')
    .expect(Selector('.fetch-count').textContent).eql('0')

    .click('button')
    .wait(100)
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .wait(100)
    .expect(Selector('.count').textContent).eql('1')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .wait(100)
    .expect(Selector('.count').textContent).eql('2')
    .expect(Selector('.fetch-count').textContent).eql('2')

    .click('button')
    .wait(100)
    .expect(Selector('.count').textContent).eql('2')
    .expect(Selector('.fetch-count').textContent).eql('2')
})
