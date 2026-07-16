import { expect, test } from '@playwright/test'

test('records weather, updates the plant, and appears in timeline', async ({ page }) => {
  await page.goto('/garden')
  await page.getByRole('button', { name: '记录此刻' }).click()
  await page.getByRole('button', { name: '晴朗' }).click()
  await page.getByTestId('quick-save').click()

  await expect(page.getByText('这份感受已经被花园接住。')).toBeVisible()
  await expect(page.getByText('一束微光停在新叶上，这份轻盈已被花园记住。')).toBeVisible()

  await page.getByRole('link', { name: '年轮' }).click()
  const today = new Date()
  const key = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  await page.getByRole('button', { name: `${key}，1条记录` }).click()
  await expect(page.getByText('晴朗')).toBeVisible()
})
