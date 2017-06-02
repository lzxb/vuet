import { Selector } from 'testcafe'

fixture`route`
.page`http://localhost:3000/route/index.html`

test('list type switch', async t => {
  await t
    .wait(2000)
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('2 title')
    .expect(Selector('ul li:nth-child(3) a').textContent).eql('3 title')
    .expect(Selector('ul li:nth-child(4) a').textContent).eql('4 title')
})
