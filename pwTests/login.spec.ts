import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('PlayWrightTest@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test_1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Choose how to provide resume:')).toBeVisible();
  await expect(page.getByText('Paste Text')).toBeVisible();
  await expect(page.getByText('Upload PDF')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Analyze Resume-to-Job Fit' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Paste your resume here' }).fill('Test Resume');
  await page.getByRole('textbox', { name: 'Paste the job description here' }).fill('Test job description');
  await page.getByRole('button', { name: 'Tech' }).click();
  await page.getByRole('button', { name: 'Analyze Resume-to-Job Fit' }).click();
  await expect(page).toHaveURL(/\/report/, { timeout: 50000 });
  await expect(page.getByRole('heading', { name: 'Resume-to-Job Fit Report' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Strengths' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gaps or Weaknesses' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Suggestions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
});