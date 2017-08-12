import { Selector } from 'testcafe'

fixture`v-model`
  .page`http://localhost:3000/v-model/index.html`

test('base', async t => {
  await t
    .expect(Selector('.root-content').textContent).eql('')
    .expect(Selector('.input-content').textContent).eql('')
    .expect(Selector('.output-content').textContent).eql('')
    .typeText(Selector('.input'), 'ok')
    .expect(Selector('.root-content').textContent).eql('ok')
    .expect(Selector('.input-content').textContent).eql('ok')
    .expect(Selector('.output-content').textContent).eql('ok')
    .click('button')
    .expect(Selector('.root-content').textContent).eql('ok')
    .expect(Selector('.input-content').textContent).eql('ok')
    .click('button')
    .typeText(Selector('.input'), 'go')
    .expect(Selector('.root-content').textContent).eql('okgo')
    .expect(Selector('.input-content').textContent).eql('okgo')
    .expect(Selector('.output-content').textContent).eql('okgo')
})
