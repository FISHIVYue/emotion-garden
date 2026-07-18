import { expect, test } from '@playwright/test'

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1440, height: 900 },
]

const routes = ['/garden', '/timeline', '/forest', '/profile']

type Rect = { x: number; y: number; width: number; height: number }

function expectSameRect(actual: Rect, expected: Rect) {
  expect(Math.abs(actual.x - expected.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(actual.y - expected.y)).toBeLessThanOrEqual(1)
  expect(Math.abs(actual.width - expected.width)).toBeLessThanOrEqual(1)
  expect(Math.abs(actual.height - expected.height)).toBeLessThanOrEqual(1)
}

test('main routes share one fixed app shell and navigation geometry', async ({ page }) => {
  test.setTimeout(90_000)
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    let referenceShell: Rect | null = null
    let referenceNav: Rect | null = null

    for (const route of routes) {
      await page.goto(route)
      const shell = await page.locator('.app-shell').boundingBox()
      const nav = await page.getByRole('navigation', { name: '主要导航' }).boundingBox()
      const metrics = await page.evaluate(() => {
        const root = document.documentElement
        const scrollArea = document.querySelector<HTMLElement>('.main-scroll-area')!
        const nestedScrollers = [...scrollArea.querySelectorAll<HTMLElement>('*')].filter((element) => {
          const style = getComputedStyle(element)
          return element.scrollHeight > element.clientHeight + 1 && ['auto', 'scroll'].includes(style.overflowY)
        })
        return {
          documentWidth: [root.clientWidth, root.scrollWidth],
          documentHeight: [root.clientHeight, root.scrollHeight],
          scrollAreaWidth: [scrollArea.clientWidth, scrollArea.scrollWidth],
          nestedScrollerCount: nestedScrollers.length,
        }
      })

      expect(shell).not.toBeNull()
      expect(nav).not.toBeNull()
      expect(metrics.documentWidth[1]).toBe(metrics.documentWidth[0])
      expect(metrics.documentHeight[1]).toBe(metrics.documentHeight[0])
      expect(metrics.scrollAreaWidth[1]).toBe(metrics.scrollAreaWidth[0])
      expect(metrics.nestedScrollerCount).toBe(0)

      if (referenceShell && referenceNav) {
        expectSameRect(shell!, referenceShell)
        expectSameRect(nav!, referenceNav)
      } else {
        referenceShell = shell
        referenceNav = nav
      }
    }

    expect(referenceShell!.height).toBe(viewport.height)
    expect(referenceShell!.width).toBeLessThanOrEqual(480)
    expect(referenceNav!.y + referenceNav!.height).toBeLessThanOrEqual(viewport.height + 1)
    if (viewport.width >= 600) {
      expect(Math.abs(referenceShell!.x - (viewport.width - referenceShell!.width) / 2)).toBeLessThanOrEqual(1)
    }
  }
})

test('forest grows inside the shared scroll area and reaches the final card', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/forest')

  const shellBefore = await page.locator('.app-shell').boundingBox()
  const scrollArea = page.getByTestId('main-scroll-area')
  const scrollMetrics = await scrollArea.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }))
  expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight)

  await scrollArea.evaluate((element) => { element.scrollTop = element.scrollHeight })
  const cards = page.locator('.resonance-card')
  const cardCount = await cards.count()
  expect(cardCount).toBeGreaterThan(0)
  const finalCard = cards.nth(cardCount - 1)
  const finalCardRect = await finalCard.boundingBox()
  const scrollAreaRect = await scrollArea.boundingBox()
  const shellAfter = await page.locator('.app-shell').boundingBox()

  expectSameRect(shellAfter!, shellBefore!)
  expect(finalCardRect!.y + finalCardRect!.height).toBeLessThanOrEqual(scrollAreaRect!.y + scrollAreaRect!.height)
})
