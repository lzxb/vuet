import { Selector } from 'testcafe'

fixture`user-login-exit`
.page`http://localhost:3000/user-login-exit/index.html`

test('base', async t => {
  await Selector('.inner', { visibilityCheck: true })
  await t
    .expect(Selector('.inner').childNodeCount).eql(1)
    .click('.inner a')

    .typeText(Selector('.name'), 'V')
    .typeText(Selector('.pass'), '20')
    .click('form button')
    .expect(Selector('.msg').textContent).eql('Logon failure')
    .typeText(Selector('.name'), 'uet')
    .typeText(Selector('.pass'), '17')
    .click('form button')
    .expect(Selector('.msg').textContent).eql('Login was successful')

    .expect(Selector('.name').textContent).eql('Vuet')
    .expect(Selector('.age .value').textContent).eql('18')
    .expect(Selector('.sex .value').textContent).eql('male')
    .expect(Selector('.count .value').textContent).eql('2')
    .click('.sigout')
    .expect(Selector('.inner').childNodeCount).eql(1)
    .click('.inner a')

    .typeText(Selector('.name'), 'Vuet')
    .typeText(Selector('.pass'), '2017')
    .click('form button')

    .expect(Selector('.name').textContent).eql('Vuet')
    .expect(Selector('.age .value').textContent).eql('18')
    .expect(Selector('.sex .value').textContent).eql('male')
    .expect(Selector('.count .value').textContent).eql('2')
})
