import { Selector } from 'testcafe'

fixture`manual`
.page`http://localhost:3000/manual/index.html`

test('Reset name', async t => {
  await t
    .expect(Selector('.test-1 .count').textContent).eql('0')

    .click('.test-1 .plus')
    .expect(Selector('.test-1 .count').textContent).eql('1')
    .click('.test-1 .reduce')
    .expect(Selector('.test-1 .count').textContent).eql('0')
    .click('.test-1 .fetch')
    .expect(Selector('.test-1 .count').textContent).eql('100')
    .click('.test-1 .reset')
    .expect(Selector('.test-1 .count').textContent).eql('0')
})

test('module set name', async t => {
  await t
    .expect(Selector('.test-2 .count').textContent).eql('0')

    .click('.test-2 .plus')
    .expect(Selector('.test-2 .count').textContent).eql('1')
    .click('.test-2 .reduce')
    .expect(Selector('.test-2 .count').textContent).eql('0')
    .click('.test-2 .fetch')
    .expect(Selector('.test-2 .count').textContent).eql('100')
    .click('.test-2 .reset')
    .expect(Selector('.test-2 .count').textContent).eql('0')
})

test('default name', async t => {
  await t
    .expect(Selector('.test-3 .count').textContent).eql('0')

    .click('.test-3 .plus')
    .expect(Selector('.test-3 .count').textContent).eql('1')
    .click('.test-3 .reduce')
    .expect(Selector('.test-3 .count').textContent).eql('0')
    .click('.test-3 .fetch')
    .expect(Selector('.test-3 .count').textContent).eql('100')
    .click('.test-3 .reset')
    .expect(Selector('.test-3 .count').textContent).eql('0')
})
