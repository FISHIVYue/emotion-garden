import { expect, test } from '@playwright/test'

const ownPost = '今天想在这里停一会儿，听听树叶的声音。'

test('publishes, persists responses, moderates posts, and deletes own post', async ({ page }) => {
  await page.goto('/forest')
  await expect(page.getByRole('heading', { name: '森林' })).toBeVisible()

  await page.getByRole('button', { name: '留下树洞' }).click()
  await page.getByPlaceholder('写下此刻想留在森林里的话……').fill(ownPost)
  await page.getByTestId('publish-forest-post').click()

  await page.getByRole('tab', { name: /我留下的/ }).click()
  await expect(page.getByText(ownPost)).toBeVisible()
  await page.getByRole('tab', { name: '森林里' }).click()

  const lightButton = page.getByRole('button', {
    name: '给这条内容送一束光：今天没有发生特别糟糕的事',
  })
  await lightButton.click()
  await expect(lightButton).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.getByText(ownPost)).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: '给这条内容送一束光：今天没有发生特别糟糕的事',
    }),
  ).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: '更多操作：我终于说出了那句一直不敢' }).click()
  await page.getByRole('button', { name: '隐藏内容：我终于说出了那句一直不敢' }).click()
  await expect(page.getByText(/我终于说出了那句一直不敢说的话/)).toHaveCount(0)

  await page.getByRole('button', { name: '更多操作：晚上回家的路上有风，我突' }).click()
  await page.getByRole('button', { name: '举报内容：晚上回家的路上有风，我突' }).click()
  await expect(page.getByText('已提交本地举报标记')).toBeVisible()

  await page.getByRole('tab', { name: /我留下的/ }).click()
  await page.getByRole('button', { name: '更多操作：今天想在这里停一会儿，听' }).click()
  await page.getByRole('button', { name: '删除内容：今天想在这里停一会儿，听' }).click()
  await page.getByRole('button', { name: '确认删除：今天想在这里停一会儿，听' }).click()
  await expect(page.getByText(ownPost)).toHaveCount(0)
})
