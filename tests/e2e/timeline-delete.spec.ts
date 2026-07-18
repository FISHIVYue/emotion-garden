import { expect, test } from '@playwright/test'

const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ date }) => {
    if (sessionStorage.getItem('timeline-delete-seeded')) return
    localStorage.setItem('emotion-garden:emotions:v1', JSON.stringify({ version: 1, entries: [
      { id:'delete-me', createdAt:`${date}T11:00:00.000Z`, weather:'sunny', emotions:['joy'], intensity:3, note:'准备移除的记录', triggers:[], bodySignals:[], needs:[], plantState:'bright' },
      { id:'keep-me', createdAt:`${date}T08:00:00.000Z`, weather:'rain', emotions:['sad'], intensity:3, note:'仍然保留的记录', triggers:[], bodySignals:[], needs:[], plantState:'rainy' },
    ] }))
    sessionStorage.setItem('timeline-delete-seeded', 'true')
  }, { date })
})

test('cancels deletion without changing data', async ({ page }) => {
  for (const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932},{width:1440,height:900}]) {
    await page.setViewportSize(viewport)
    await page.goto(`/timeline/${date}`)
    await page.getByRole('button', { name: '删除这条情绪记录' }).first().click()
    await expect(page.getByRole('dialog', { name: '移除这段记录？' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true)
    await page.getByRole('button', { name: '保留记录' }).click()
    await expect(page.getByText('准备移除的记录')).toBeVisible()
    await expect(page.getByRole('button', { name: `${date}，2条记录` })).toBeVisible()
  }
})

test('deletes one entry, updates the day and persists after refresh', async ({ page }) => {
  await page.goto(`/timeline/${date}`)
  await page.getByText('准备移除的记录').locator('..').getByRole('button', { name: '删除这条情绪记录' }).click()
  const dialog = page.getByRole('dialog', { name: '移除这段记录？' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '确认移除' }).click()
  await expect(page.getByText('这段记录已从年轮中轻轻移除。')).toBeVisible()
  await expect(page.getByText('准备移除的记录')).toHaveCount(0)
  await expect(page.getByText('仍然保留的记录')).toBeVisible()
  await expect(page.getByRole('button', { name: `${date}，1条记录` })).toBeVisible()
  await page.reload()
  await expect(page.getByText('准备移除的记录')).toHaveCount(0)
  await expect(page.getByText('仍然保留的记录')).toBeVisible()
})

test('deleting the last entry leaves the selected day empty and garden calm', async ({ page }) => {
  await page.goto(`/timeline/${date}`)
  for (let remaining = 2; remaining > 0; remaining--) {
    await page.getByRole('button', { name: '删除这条情绪记录' }).first().click()
    await page.getByRole('button', { name: '确认移除' }).click()
  }
  await expect(page.getByText('这一天没有留下记录。')).toBeVisible()
  await expect(page.getByRole('button', { name: `${date}，没有记录` })).toBeVisible()
  await page.goto('/garden')
  await expect(page.locator('.plant-art--state-calm')).toBeVisible()
})
