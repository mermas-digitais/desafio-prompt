// Playwright MCP; isolated test:ui:serve only, never production.
async (page) => {
  const base = 'http://127.0.0.1:5187';
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const goto = (tab, url) => tab.goto(url, { waitUntil: 'domcontentloaded' });
  const context = await page.context().browser().newContext();
  const staff = await context.newPage();
  const visitorContext = await page.context().browser().newContext();
  const visitor = await visitorContext.newPage();
  let room;
  let step = 'login';
  const login = async (tab) => {
    await tab.getByLabel('E-mail', { exact: true }).fill('ana@example.test');
    await tab.getByLabel('Senha', { exact: true }).fill('review-only-password');
    await tab.getByRole('button', { name: 'Entrar na minha conta', exact: true }).click();
  };
  try {
    await goto(staff, `${base}/admin`); await login(staff);
    await staff.getByRole('heading', { name: 'Ranking por sala', exact: true }).waitFor();
    const fixture = await staff.evaluate(async () => {
      const roomCode = `UX${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      const created = await fetch('/api/rooms/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomCode, name: 'Sala UX' }) });
      if (!created.ok) throw new Error('Fixture room failed');
      const session = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomCode, id: crypto.randomUUID(), name: 'TV de teste UX' }) });
      if (!session.ok) throw new Error('Fixture session failed');
      return { roomCode, state: (await session.json()).state };
    });
    room = fixture.roomCode;
    const url = `${base}/tv?room=${room}&session=${fixture.state.sessionId}`;
    step = 'signed-in watch';
    await goto(staff, url); // Legacy URL safely defaults to watch, even when signed in.
    await staff.getByRole('banner').getByRole('link', { name: 'Assistindo', exact: true }).waitFor();
    assert(await staff.getByRole('button', { name: `Abrir moderação da sala ${room}`, exact: true }).count() === 0, 'Signed-in watcher has moderation controls');
    await staff.getByRole('banner').getByRole('link', { name: 'Assistindo', exact: true }).click();
    await staff.waitForURL(/mode=control/);
    await staff.getByRole('button', { name: `Abrir moderação da sala ${room}`, exact: true }).click();
    await staff.getByRole('dialog', { name: `Moderação · TV de teste UX · ${room}`, exact: true }).waitFor();
    await staff.keyboard.press('Escape');
    await staff.getByRole('banner').getByRole('link', { name: 'Controlando', exact: true }).click();
    await staff.waitForURL(/mode=watch/);
    assert(await staff.getByRole('button', { name: `Abrir moderação da sala ${room}`, exact: true }).count() === 0, 'Watcher retained controls after switching');
    await goto(visitor, `${url}&mode=control`);
    await visitor.getByRole('link', { name: 'Entrar para controlar', exact: true }).click();
    await visitor.waitForURL(/\/admin\?.*returnTo=/);
    await login(visitor);
    await visitor.waitForURL(`${url}&mode=control`);
    await visitor.getByRole('banner').getByRole('link', { name: 'Controlando', exact: true }).waitFor();
    step = 'mobile watch';
    await visitor.getByRole('banner').getByRole('link', { name: 'Controlando', exact: true }).click();
    await visitor.setViewportSize({ width: 390, height: 844 });
    const qr = visitor.getByRole('heading', { name: 'Escaneie para Jogar', exact: true });
    await qr.scrollIntoViewIfNeeded();
    assert(await qr.isVisible(), 'QR card is unreachable on mobile');
    assert(!await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Mobile overflow');
    await visitor.screenshot({ path: 'C:/Users/Schneider/AppData/Local/Temp/opencode/session-modes-mobile.png' });
    step = 'directory';
    await goto(staff, `${base}/tv?room=${room}`);
    await staff.getByRole('heading', { name: 'Sessões desta sala · 1/2', exact: true }).waitFor();
    await staff.getByText('Aguardando participantes', { exact: true }).waitFor();
    await staff.getByRole('link', { name: 'Controlar TV de teste UX', exact: true }).waitFor();
    step = 'watch before deletion';
    await goto(staff, `${url}&mode=watch`);
    await staff.getByRole('heading', { name: 'Escaneie para Jogar', exact: true }).waitFor();
    // Delete only this disposable fixture room, then verify a stale session URL.
    const deleted = await staff.evaluate(async (code) => (await fetch(`/api/rooms/${code}?confirm=${code}`, { method: 'DELETE' })).status, room);
    assert(deleted === 200, 'Fixture cleanup failed'); room = undefined;
    await staff.waitForURL(`${base}/`);
    step = 'stale session link';
    await goto(staff, `${url}&mode=watch`);
    await staff.getByRole('heading', { name: 'Sessão indisponível', exact: true }).waitFor();
    return { checks: ['signed-in watch stays read-only', 'explicit mode switching', 'discreet session header', 'moderation names session', 'login returns to exact session', 'mobile QR reachable', 'directory labels', 'stale link recovery'] };
  } catch (error) {
    throw new Error(`${step}: ${error.message}`);
  } finally {
    if (room) await staff.evaluate(async (code) => { await fetch(`/api/rooms/${code}?confirm=${code}`, { method: 'DELETE' }); }, room);
    await context.close(); await visitorContext.close();
  }
}
