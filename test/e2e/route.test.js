import { Selector } from 'testcafe'

fixture`route`
.page`http://localhost:3000/route/index.html`

test('base', async t => {
  await t
    .wait(1500)

    .expect(Selector('.fetch-count').textContent).eql('1')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('2 title')
    .expect(Selector('ul li:nth-child(3) a').textContent).eql('3 title')
    .expect(Selector('ul li:nth-child(4) a').textContent).eql('4 title')

    .click('header span:nth-child(2) a')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('2 title')
    .expect(Selector('ul li:nth-child(3) a').textContent).eql('3 title')
    .expect(Selector('ul li:nth-child(4) a').textContent).eql('4 title')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('2')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('4 title')

    .click('header span:nth-child(3) a')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('4 title')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('3')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('2 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('3 title')

    .click('header span:nth-child(2) a')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('2 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('3 title')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('4')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('4 title')

    .click('ul li:nth-child(1) a')
    .expect(Selector('.fetch-count').textContent).eql('0')
    .expect(Selector('h2').textContent).eql('')
    .expect(Selector('article').textContent).eql('')
    .wait(1000)
    .expect(Selector('h2').textContent).eql('1 title')
    .expect(Selector('article').textContent).eql('1x1 content')
    .expect(Selector('.fetch-count').textContent).eql('1')

    .click('button')
    .expect(Selector('.fetch-count').textContent).eql('5')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('4 title')

    .click('ul li:nth-child(1) a')
    .expect(Selector('.fetch-count').textContent).eql('1')
    .expect(Selector('h2').textContent).eql('1 title')
    .expect(Selector('article').textContent).eql('1x1 content')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('2')
    .expect(Selector('h2').textContent).eql('1 title')
    .expect(Selector('article').textContent).eql('1x1 content')

    .click('button')
    .expect(Selector('.fetch-count').textContent).eql('6')
    .expect(Selector('ul li:nth-child(1) a').textContent).eql('1 title')
    .expect(Selector('ul li:nth-child(2) a').textContent).eql('4 title')

    .click('ul li:nth-child(2) a')
    .expect(Selector('.fetch-count').textContent).eql('0')
    .expect(Selector('h2').textContent).eql('')
    .expect(Selector('article').textContent).eql('')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('1')
    .expect(Selector('h2').textContent).eql('4 title')
    .expect(Selector('article').textContent).eql('4x1 content')

    .click('.to-one')
    .expect(Selector('.fetch-count').textContent).eql('1')
    .expect(Selector('h2').textContent).eql('4 title')
    .expect(Selector('article').textContent).eql('4x1 content')
    .wait(1500)
    .expect(Selector('.fetch-count').textContent).eql('2')
    .expect(Selector('h2').textContent).eql('1 title')
    .expect(Selector('article').textContent).eql('1x1 content')
})
