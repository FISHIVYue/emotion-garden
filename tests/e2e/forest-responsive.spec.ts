import { expect, test } from '@playwright/test'

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1440, height: 900 },
]

test('forest stays within the app shell at supported viewport sizes', async ({ page }) => {
  test.setTimeout(90_000)
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/forest')

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>('.app-shell')!
      const stream = document.querySelector<HTMLElement>('.forest-stream')!
      const cards = [...document.querySelectorAll<HTMLElement>('.resonance-card')]
      const shellRect = shell.getBoundingClientRect()
      return {
        documentClientWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        shellClientWidth: shell.clientWidth,
        shellScrollWidth: shell.scrollWidth,
        shellLeft: shellRect.left,
        shellRight: shellRect.right,
        streamClientWidth: stream.clientWidth,
        streamScrollWidth: stream.scrollWidth,
        cardsInside: cards.every((card) => {
          const rect = card.getBoundingClientRect()
          return rect.left >= shellRect.left - 0.5 && rect.right <= shellRect.right + 0.5
        }),
        menusValid: cards.every((card) => {
          const menu = card.querySelector<HTMLElement>('.resonance-card__menu')!
          const identity = card.querySelector<HTMLElement>('.resonance-card__identity-copy')!
          const menuRect = menu.getBoundingClientRect()
          const identityRect = identity.getBoundingClientRect()
          return menuRect.width === 36
            && menuRect.height === 36
            && menu.querySelectorAll('circle').length === 3
            && identityRect.right <= menuRect.left
        }),
      }
    })

    expect(metrics.documentScrollWidth).toBe(metrics.documentClientWidth)
    expect(metrics.shellScrollWidth).toBe(metrics.shellClientWidth)
    expect(metrics.streamScrollWidth).toBe(metrics.streamClientWidth)
    expect(metrics.cardsInside).toBe(true)
    expect(metrics.menusValid).toBe(true)

    const lastCard = page.locator('.resonance-card').last()
    await page.getByTestId('main-scroll-area').evaluate((element) => { element.scrollTop = element.scrollHeight })
    const lastCardRect = await lastCard.boundingBox()
    const navRect = await page.getByRole('navigation', { name: '主要导航' }).boundingBox()
    expect(lastCardRect).not.toBeNull()
    expect(navRect).not.toBeNull()
    expect(lastCardRect!.y + lastCardRect!.height).toBeLessThanOrEqual(navRect!.y)
    expect(navRect!.y + navRect!.height).toBeLessThanOrEqual(viewport.height + 1)

    await page.getByRole('button', { name: '留下树洞' }).click()
    const dialog = page.getByRole('dialog', { name: '留下一段树洞' })
    const publishButton = page.getByTestId('publish-forest-post')
    await page.getByPlaceholder('写下此刻想留在森林里的话……').fill('响应式布局检查')
    await publishButton.scrollIntoViewIfNeeded()
    await expect(publishButton).toBeVisible()
    const dialogMetrics = await dialog.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      maxAllowedHeight: window.innerHeight * 0.82,
    }))
    expect(dialogMetrics.scrollWidth).toBe(dialogMetrics.clientWidth)
    expect(dialogMetrics.clientHeight).toBeLessThanOrEqual(dialogMetrics.maxAllowedHeight + 1)
    await page.getByRole('button', { name: '关闭发布弹层' }).click()
    await expect(dialog).toBeHidden()

    if (viewport.width >= 600) {
      expect(metrics.shellClientWidth).toBeLessThanOrEqual(480)
      expect(Math.abs(metrics.shellLeft - (viewport.width - metrics.shellRight))).toBeLessThanOrEqual(1)
    }
  }
})

test('forest composer remains operable at 360 by 800', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/forest')

  await page.getByRole('button', { name: '留下树洞' }).click()
  const dialog = page.getByRole('dialog', { name: '留下一段树洞' })
  const textarea = page.getByPlaceholder('写下此刻想留在森林里的话……')
  const publishButton = page.getByTestId('publish-forest-post')

  await expect(dialog).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await textarea.fill('响应式布局检查')
  await publishButton.scrollIntoViewIfNeeded()
  await expect(publishButton).toBeVisible()

  const dialogMetrics = await dialog.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    maxAllowedHeight: window.innerHeight * 0.82,
  }))
  expect(dialogMetrics.scrollWidth).toBe(dialogMetrics.clientWidth)
  expect(dialogMetrics.clientHeight).toBeLessThanOrEqual(dialogMetrics.maxAllowedHeight + 1)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect.poll(() => page.locator('body').evaluate((element) => element.style.overflow)).toBe('')
  await expect(page.getByRole('navigation', { name: '主要导航' })).toBeVisible()
})

test('last forest card can scroll above the fixed navigation', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/forest')

  const cards = page.locator('.resonance-card')
  await expect(cards).not.toHaveCount(0)
  const lastCard = cards.last()
  await page.getByTestId('main-scroll-area').evaluate((element) => { element.scrollTop = element.scrollHeight })

  const cardRect = await lastCard.boundingBox()
  const navRect = await page.getByRole('navigation', { name: '主要导航' }).boundingBox()
  expect(cardRect).not.toBeNull()
  expect(navRect).not.toBeNull()
  expect(cardRect!.y + cardRect!.height).toBeLessThanOrEqual(navRect!.y)
})
