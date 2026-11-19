/* ============================================================
   应用控制层：路由、交互、跑步模拟、存储与核身流程
   ============================================================ */
(function () {
  'use strict';

  const D = window.AppData;
  const V = window.Views;
  const A = window.Assets;

  const phone = document.getElementById('phone');
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modalRoot');
  const toastRoot = document.getElementById('toastRoot');

  let state = D.load();

  const runtime = {
    view: 'home',
    history: [],
    run: null,
    runTimer: null,
    pendingResult: null,
    scoreBefore: 0,
    scoreAfter: 0,
    modalStack: [],
    quiz: null,
    goalDraft: 0,
    faceContext: 'pre-run',
    scanTimers: [],
    hold: null,
    holdRaf: null,
    lastLockTip: false,
    appealReason: '',
    theme: ''
  };

  const THEME = {
    home: 'theme-home',
    record: 'theme-record',
    profile: 'theme-profile',
    gorun: 'theme-gorun',
    userInfo: 'theme-userinfo',
    planInfo: 'theme-planinfo',
    checklist: 'theme-checklist',
    face: 'theme-face',
    run: 'theme-run',
    result: 'theme-result',
    success: 'theme-success'
  };

  /* ------------------------------------------------------------------
     基础工具
  ------------------------------------------------------------------ */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function toast(text, ms = 2000) {
    toastRoot.innerHTML = `<div class="toast">${text}</div>`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toastRoot.innerHTML = '';
    }, ms);
  }

  function currentGeo(view) {
    const dims = {
      run: { w: 390, h: 430 },
      result: { w: 390, h: 300 },
      modal: { w: 390, h: 280 },
      gorun: { w: 390, h: 700 }
    };
    const d = dims[view] || dims.run;
    const rx = Math.min(d.w * 0.32, 126);
    const ry = Math.min(d.w * 0.16, 66);
    return {
      cx: d.w / 2,
      cy: d.h * 0.52,
      rx,
      ry,
      L: rx - ry,
      R: ry + 10
    };
  }

  function stadiumPoint(geo, meters, laneOffset = 0) {
    const R = geo.R - laneOffset;
    const L = geo.L;
    const P = 4 * L + 2 * Math.PI * R;
    let s = (((meters % 400) + 400) % 400) / 400 * P;
    let x;
    let y;
    if (s < 2 * L) {
      x = -L + s;
      y = R;
    } else if (s < 2 * L + Math.PI * R) {
      const a = (s - 2 * L) / R;
      x = L + Math.sin(a) * R;
      y = Math.cos(a) * R;
    } else if (s < 4 * L + Math.PI * R) {
      x = L - (s - (2 * L + Math.PI * R));
      y = -R;
    } else {
      const a = (s - (4 * L + Math.PI * R)) / R;
      x = -L - Math.sin(a) * R;
      y = -Math.cos(a) * R;
    }
    return { x: geo.cx + x, y: geo.cy + y };
  }

  function laneOffsetForMeters(meters) {
    const lap = Math.floor(meters / 400);
    return Math.min(2, lap) * 2.2;
  }

  function buildRoutePoints(distanceKm, geo) {
    const points = [];
    const totalMeters = Math.max(0, distanceKm * 1000);
    const step = 2;
    for (let m = 0; m <= totalMeters; m += step) {
      points.push(stadiumPoint(geo, m, laneOffsetForMeters(m)));
    }
    return points;
  }

  function pathFromPoints(points) {
    if (!points.length) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }

  function drawRoute(scope, points, startPoint, nowPoint) {
    const wrap = $(scope);
    if (!wrap) return;
    const path = $('#routePath', wrap);
    const shadow = $('#routeShadow', wrap);
    if (!path) return;
    const d = pathFromPoints(points);
    path.setAttribute('d', d);
    if (shadow) shadow.setAttribute('d', d);
    const start = $('#routeStart', wrap);
    const now = $('#routeNow', wrap);
    if (start && startPoint) {
      start.setAttribute('transform', `translate(${startPoint.x.toFixed(1)} ${startPoint.y.toFixed(1)})`);
      start.setAttribute('opacity', '1');
    }
    if (now && nowPoint) {
      now.setAttribute('transform', `translate(${nowPoint.x.toFixed(1)} ${nowPoint.y.toFixed(1)})`);
      now.setAttribute('opacity', '1');
    }
    const gps = $('#mapGps', wrap);
    if (gps) gps.setAttribute('opacity', '0');
  }

  function drawStaticRoute(scope, distanceKm, viewKey) {
    const geo = currentGeo(viewKey || 'result');
    const points = buildRoutePoints(distanceKm, geo);
    const start = points[0];
    const now = points[points.length - 1];
    drawRoute(scope, points, start, now);
  }

  /* ------------------------------------------------------------------
     路由与渲染
  ------------------------------------------------------------------ */

  function setChrome(view) {
    runtime.view = view;
    phone.className = 'phone ' + (view === 'face' ? 'status-light' : '');
    app.className = 'app ' + (THEME[view] || '');
    if (view === 'face') {
      phone.classList.add('status-light');
    }
  }

  function templateFor(view) {
    switch (view) {
      case 'home':
        return V.home();
      case 'record':
        return V.record();
      case 'profile':
        return V.profile();
      case 'gorun':
        return V.gorun();
      case 'userInfo':
        return V.userInfo();
      case 'planInfo':
        return V.planInfo();
      case 'checklist':
        return V.checklist();
      case 'face':
        return V.face();
      case 'run':
        return V.run(runtime.run);
      case 'result':
        return V.result(runtime.pendingResult);
      case 'success':
        return V.success(runtime.pendingResult, runtime.scoreBefore, runtime.scoreAfter);
      default:
        return V.home();
    }
  }

  function render() {
    if (runtime.view === 'run' && !runtime.run) {
      runtime.view = 'home';
    }
    if ((runtime.view === 'result' || runtime.view === 'success') && !runtime.pendingResult) {
      runtime.view = 'home';
    }
    app.innerHTML = templateFor(runtime.view);
    setChrome(runtime.view);
    if (runtime.view === 'result') {
      drawStaticRoute('.result-view .result-map', runtime.pendingResult.distanceKm, 'result');
    }
    if (runtime.view === 'run' && runtime.run) {
      drawRunRoute(true);
    }
  }

  function go(view, opts = {}) {
    if (view === runtime.view && !opts.force) {
      render();
      return;
    }
    if (!opts.replace && !opts.back) {
      runtime.history.push(runtime.view);
    }
    runtime.view = view;
    if (!opts.keepModals) closeAllModals();
    render();
  }

  function goBack() {
    closeAllModals();
    if (currentIsRunning()) {
      toast('请先长按结束运动');
      return;
    }
    if (!runtime.history.length && runtime.view === 'home') {
      toast('已经在阳光云校园首页啦');
      return;
    }
    if (runtime.view === 'result' && runtime.pendingResult && !runtime.pendingResult.syncedAt) {
      openModal('noSyncConfirm');
      return;
    }
    const prev = runtime.history.pop();
    if (prev === 'run' || prev === 'result' || prev === 'success') {
      runtime.view = 'home';
      render();
      return;
    }
    runtime.view = prev || 'home';
    render();
  }

  function currentIsRunning() {
    return runtime.view === 'run' && runtime.run && !runtime.run.finished;
  }

  /* ------------------------------------------------------------------
     弹层
  ------------------------------------------------------------------ */

  function openModal(name, data) {
    runtime.modalStack.push({ name, data: data || null });
    renderModal();
  }

  function closeModal() {
    runtime.modalStack.pop();
    renderModal();
  }

  function closeAllModals() {
    runtime.modalStack = [];
    renderModal();
  }

  function topModal() {
    return runtime.modalStack[runtime.modalStack.length - 1] || null;
  }

  function renderModal() {
    const top = topModal();
    if (!top) {
      modalRoot.innerHTML = '';
      return;
    }
    modalRoot.innerHTML = modalHTML(top);
    if (top.name === 'recordDetail' && top.data) {
      drawStaticRoute('.modal-root .result-map', top.data.distanceKm, 'modal');
    }
  }

  function modalHTML(entry) {
    switch (entry.name) {
      case 'goal':
        return V.Modals.goal(state);
      case 'planDetail':
        return V.Modals.planDetail();
      case 'planList':
        return V.Modals.planList();
      case 'shareSheet':
        return V.Modals.share();
      case 'unbindConfirm':
        return `<div class="dialog-mask" data-act="close-modal">
          <div class="dialog" data-stop="1">
            <div class="dialog-title">解绑用户？</div>
            <div class="dialog-text">解绑后将无法查看当前学校数据，如需更换绑定用户，请先联系学校老师解除原绑定。</div>
            <div class="dialog-actions">
              <button class="dialog-btn primary" data-act="unbind-confirm">确认解绑</button>
              <button class="dialog-btn light" data-act="close-modal">取消</button>
            </div>
          </div>
        </div>`;
      case 'recordDetail':
        return V.Modals.recordDetail(entry.data);
      case 'guide':
        return V.Modals.guide(state);
      case 'video':
        return V.Modals.video(state);
      case 'quiz':
        return V.Modals.quiz(state, runtime.quiz || { idx: 0, selected: null });
      case 'insurance':
        return V.Modals.insurance(state);
      case 'menu':
        return V.Modals.menu();
      case 'bind':
        return V.Modals.bind(state);
      case 'faqAll':
        return V.Modals.faqAll();
      case 'rulesDoc':
        return V.Modals.rulesDoc();
      case 'gpsTips':
        return V.Modals.gpsTips();
      case 'faceRemind':
        return V.Modals.faceRemind();
      case 'finishConfirm':
        return V.Modals.finishConfirm();
      case 'noSyncConfirm':
        return V.Modals.noSyncConfirm();
      case 'about':
        return V.Modals.about();
      case 'resetConfirm':
        return V.Modals.resetConfirm();
      case 'appeal':
        return V.Modals.appeal(entry.data);
      case 'faceScan':
        return V.faceScan(
          entry.data && entry.data.title,
          entry.data && entry.data.sub,
          !(entry.data && entry.data.context === 'run-check')
        );
      case 'faceResult':
        return `<div class="face-scan">
          <div class="face-result">
            <div class="success-ring">${A.icon('check', 40)}</div>
            <div class="face-result-title">${entry.data.title || '认证通过'}</div>
            <div class="face-result-sub">${entry.data.sub || '已授权支付宝运动查询本次人脸认证结果'}</div>
          </div>
        </div>`;
      case 'runPaused':
        return `<div class="run-paused-veil">
          <div class="p-ico">${A.icon('pause', 26)}</div>
          <div class="p-title">运动已暂停</div>
          <div class="p-sub">当前运动数据已保存，继续后自动续跑</div>
          <button class="dialog-btn primary" data-act="resume-run" style="width:160px;margin-top:16px">继续运动</button>
          <button class="dialog-btn light" data-act="end-early" style="width:160px;margin-top:8px;background:rgba(255,255,255,.14);color:rgba(255,255,255,.8)">结束运动</button>
        </div>`;
      case 'runLocked':
        return `<div class="run-paused-veil">
          <div class="p-ico">${A.icon('lock', 26)}</div>
          <div class="p-title">屏幕已锁定</div>
          <div class="p-sub">保持此页面打开，可避免运动数据丢失</div>
          <button class="dialog-btn primary" data-act="unlock-run" style="width:160px;margin-top:16px">解锁</button>
        </div>`;
      case 'loading':
        return `<div class="loading-veil"><div class="spinner"></div><div class="loading-text">${entry.data.text || '处理中…'}</div></div>`;
      case 'runFaceCheck':
        return V.faceScan('运动中随机核身', '已暂停计时，完成核身后继续本次跑步');
      default:
        return '';
    }
  }

  /* ------------------------------------------------------------------
     跑步模拟
  ------------------------------------------------------------------ */

  function beginRun() {
    const r = D.rule();
    const startAt = D.now();
    runtime.run = {
      startedAt: startAt,
      startedAtText: D.fmtDateTime(startAt),
      distanceKm: 0,
      elapsedSec: 0,
      cadence: r.minCadence + 35,
      calories: 0,
      paceSec: 0,
      paused: false,
      locked: false,
      voiceOn: state.voiceOn,
      holdPct: 0,
      faceCheckDone: false,
      faceTriggered: false,
      finished: false,
      routePoints: [],
      lastTs: performance.now(),
      showLockTip: false
    };
    runtime.lastLockTip = false;
    runtime.history = ['home', 'gorun'];
    go('run', { replace: true, keepModals: true });
    clearInterval(runtime.runTimer);
    runtime.runTimer = setInterval(runTick, 240);
    setTimeout(() => {
      if (runtime.run && !runtime.run.locked) {
        runtime.run.showLockTip = true;
        const tip = $('.run-map-wrap .run-lock-tip');
        if (tip) tip.style.display = '';
      }
    }, 2500);
  }

  function hasBlockingModal() {
    const top = topModal();
    if (!top) return false;
    return ['runPaused', 'faceScan', 'faceResult', 'runFaceCheck', 'finishConfirm', 'loading', 'noSyncConfirm'].includes(
      top.name
    );
  }

  function runTick() {
    const run = runtime.run;
    if (!run || run.finished) return;
    if (run.paused || hasBlockingModal()) {
      run.lastTs = performance.now();
      return;
    }
    const nowTs = performance.now();
    const realDt = Math.min(0.8, (nowTs - run.lastTs) / 1000);
    run.lastTs = nowTs;
    const SIM_SPEED = 18;
    const dt = realDt * SIM_SPEED;
    const speed = 2.95 + Math.sin(run.elapsedSec / 47) * 0.1;
    run.distanceKm += (speed * dt) / 1000;
    run.elapsedSec += dt;
    run.cadence = Math.round(167 + Math.sin(run.elapsedSec / 5.5) * 4 + Math.sin(run.elapsedSec / 1.7) * 1.2);
    run.calories = run.distanceKm * 56;
    run.paceSec = run.distanceKm > 0.02 ? run.elapsedSec / run.distanceKm : 0;

    appendRoutePoints();
    drawRunRoute(false);

    if (!run.faceTriggered && run.distanceKm >= 0.92) {
      run.faceTriggered = true;
      run.paused = true;
      runtime.faceContext = 'run-check';
      startFaceScan({ context: 'run-check', title: '运动中随机核身', sub: '已暂停计时，完成核身后继续本次跑步' });
      return;
    }

    updateRunUI();

    if (run.distanceKm >= 2.3) {
      finishRun(true);
    }
  }

  function appendRoutePoints() {
    const run = runtime.run;
    if (!run) return;
    const geo = currentGeo('run');
    const total = Math.max(0, run.distanceKm * 1000);
    const want = Math.floor(total / 2);
    while (run.routePoints.length <= want) {
      const m = run.routePoints.length * 2;
      run.routePoints.push(stadiumPoint(geo, m, laneOffsetForMeters(m)));
    }
  }

  function drawRunRoute(initial) {
    const run = runtime.run;
    if (!run) return;
    const geo = currentGeo('run');
    if (!run.routePoints.length) {
      run.routePoints.push(stadiumPoint(geo, 0, 0));
    }
    const nowPoint = stadiumPoint(geo, run.distanceKm * 1000, laneOffsetForMeters(run.distanceKm * 1000));
    drawRoute('.run-view .run-map-wrap', run.routePoints, run.routePoints[0], nowPoint);
    if (initial) updateRunUI();
  }

  function updateRunUI() {
    const run = runtime.run;
    if (!run || runtime.view !== 'run') return;
    const rule = D.rule();
    const set = (sel, text) => {
      const el = $(sel, app);
      if (el) el.textContent = text;
    };
    set('#runKm', run.distanceKm.toFixed(2));
    set('#runPace', D.fmtPace(run.paceSec));
    set('#runTime', D.fmtDuration(run.elapsedSec));
    const cal = $('#runCal', app);
    if (cal) cal.innerHTML = `${Math.round(run.calories)}<small>千卡</small>`;
    set('#runCadence', Math.round(run.cadence));
    const goalKm = state.goals.distanceKm || rule.minKm;
    set('#runGoalText', `${run.distanceKm.toFixed(2)} / ${goalKm.toFixed(2)}`);
    const bar = $('#runGoalBar', app);
    if (bar) bar.style.width = Math.min(100, (run.distanceKm / goalKm) * 100) + '%';
    const chipKm = $('#chipKm', app);
    if (chipKm) {
      const ok = run.distanceKm >= rule.minKm;
      chipKm.className = 'valid-chip' + (ok ? ' ok' : '');
      chipKm.innerHTML = `${A.icon('check', 10)} 里程 ${ok ? '达标' : '未达标'}`;
    }
    const chipPace = $('#chipPace', app);
    if (chipPace) {
      const ok = run.paceSec > 0 && run.paceSec <= rule.maxPaceSec;
      chipPace.className = 'valid-chip' + (ok ? ' ok' : '');
      chipPace.innerHTML = `${A.icon('check', 10)} 配速${ok ? '达标' : '待达标'}`;
    }
    const chipCadence = $('#chipCadence', app);
    if (chipCadence) {
      const ok = run.cadence >= rule.minCadence;
      chipCadence.className = 'valid-chip' + (ok ? ' ok' : '');
      chipCadence.innerHTML = `${A.icon('check', 10)} 步频${ok ? '达标' : '待达标'}`;
    }
    const pauseBtn = $('.pause-orb', app);
    if (pauseBtn) {
      pauseBtn.classList.toggle('resume', run.paused);
      pauseBtn.innerHTML = A.icon(run.paused ? 'play' : 'pause', 32);
    }
    const lockBtn = $('[data-act="lock"]', app);
    if (lockBtn) {
      lockBtn.classList.toggle('active', run.locked);
      const circ = $('.ctrl-circle', lockBtn);
      if (circ) circ.innerHTML = A.icon(run.locked ? 'lock' : 'lockMini', 20);
    }
    const voiceBtn = $('.ctrl-side[data-act="voice"]', app);
    if (voiceBtn) voiceBtn.classList.toggle('active', !!run.voiceOn);
    const hold = $('#endHold', app);
    if (hold) hold.style.setProperty('--hold', (run.holdPct || 0) + '%');
    const tip = $('.run-lock-tip', app);
    if (tip) tip.style.display = run.showLockTip && !run.locked ? '' : 'none';
  }

  function togglePause() {
    const run = runtime.run;
    if (!run || run.finished) return;
    run.paused = !run.paused;
    run.lastTs = performance.now();
    if (run.paused) {
      openModal('runPaused');
    } else {
      if (topModal() && (topModal().name === 'runPaused' || topModal().name === 'runLocked')) closeModal();
    }
    updateRunUI();
  }

  function resumeRun() {
    const run = runtime.run;
    if (!run) return;
    run.paused = false;
    run.lastTs = performance.now();
    closeAllModals();
    if (topModal() && topModal().name === 'runFaceCheck') closeModal();
    updateRunUI();
  }

  function finishRun(auto) {
    const run = runtime.run;
    if (!run || run.finished) return;
    run.finished = true;
    clearInterval(runtime.runTimer);
    runtime.runTimer = null;
    const rule = D.rule();
    const distance = Math.min(9.99, Math.round(run.distanceKm * 100) / 100);
    const durationSec = Math.max(1, Math.round(run.elapsedSec));
    const pace = durationSec / Math.max(distance, 0.01);
    const cadence = Math.round(run.cadence);
    const calories = Math.round(run.calories);
    const startedAt = run.startedAt;
    const endedAt = new Date(startedAt.getTime() + durationSec * 1000);
    const startedKey = D.dayKey(startedAt);
    const dup = state.records.some((r) => r.valid && D.dayKey(r.startedAt) === startedKey);

    const checks = [
      {
        label: '有效里程',
        value: `${distance.toFixed(2)} / ${rule.minKm.toFixed(1)} 公里`,
        ok: distance >= rule.minKm
      },
      {
        label: '平均配速',
        value: `${D.fmtPace(pace)} / 公里（上限 ${rule.paceText}）`,
        ok: pace <= rule.maxPaceSec
      },
      {
        label: '平均步频',
        value: `${cadence} 步/分（下限 ${rule.cadenceText}）`,
        ok: cadence >= rule.minCadence
      },
      {
        label: '运动中随机核身',
        value: run.faceCheckDone ? '已通过' : '未完成',
        ok: !!run.faceCheckDone
      },
      {
        label: '跑步区域',
        value: '山东财经大学圣井校区田径场',
        ok: true
      },
      {
        label: '当日首次打卡',
        value: dup ? '当日已有有效记录' : '是',
        ok: !dup
      }
    ];

    let reason = '';
    if (dup) reason = '重复打卡';
    else if (distance < rule.minKm) reason = '未达最低里程';
    else if (pace > rule.maxPaceSec) reason = '配速未达标';
    else if (cadence < rule.minCadence) reason = '步频未达标';
    else if (!run.faceCheckDone) reason = '缺少运动中核身';

    const valid = !reason;

    runtime.pendingResult = {
      id: D.makeId(),
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      syncedAt: null,
      distanceKm: distance,
      durationSec,
      cadence,
      calories,
      valid,
      reason,
      faceVerified: run.faceCheckDone,
      inTrack: true,
      checks
    };
    runtime.run = null;
    closeAllModals();
    runtime.history = ['home'];
    go('result', { replace: true });
    if (auto) toast('演示里程已完成，已生成运动记录');
    drawStaticRoute('.result-view .result-map', runtime.pendingResult.distanceKm, 'result');
  }

  function syncResult() {
    const rec = runtime.pendingResult;
    if (!rec) return;
    const before = D.scoreForCount(D.validCount()).points;
    openModal('loading', { text: '正在同步数据到学校…' });
    setTimeout(() => {
      rec.syncedAt = new Date(new Date(rec.endedAt).getTime() + 30000).toISOString();
      D.saveRecord(rec);
      state = D.getState();
      const after = D.scoreForCount(D.validCount()).points;
      runtime.scoreBefore = before;
      runtime.scoreAfter = after;
      closeAllModals();
      runtime.view = 'success';
      runtime.history = ['home'];
      render();
    }, 1400);
  }

  /* ------------------------------------------------------------------
     人脸核身
  ------------------------------------------------------------------ */

  function startFaceScan(opts) {
    const context = opts.context || 'pre-run';
    runtime.faceContext = context;
    openModal('faceScan', {
      title: opts.title || '人脸核身',
      sub: opts.sub || '应学校要求，认证通过后才可操作',
      context
    });
    clearScanTimers();
    runtime.scanTimers.push(
      setTimeout(() => {
        runtime.scanTimers.push(
          setTimeout(() => {
            runtime.modalStack.push({
              name: 'faceResult',
              data: {
                title: '认证通过',
                sub: '已授权支付宝运动查询本次人脸认证结果'
              }
            });
            renderModal();
            runtime.scanTimers.push(
              setTimeout(() => {
                finishFaceScan(context);
              }, 1000)
            );
          }, 2600)
        );
      }, 100)
    );
  }

  function finishFaceScan(context) {
    clearScanTimers();
    closeAllModals();
    state = D.getState();
    if (context === 'pre-run' || context === 'profile' || context === 'run-check') {
      D.setVerified();
      state = D.getState();
    }
    if (context === 'run-check') {
      const run = runtime.run;
      if (run) {
        run.faceCheckDone = true;
        run.paused = false;
        run.lastTs = performance.now();
      }
      if (runtime.view === 'run') {
        render();
        toast('随机核身通过，继续本次跑步');
      }
      return;
    }
    if (context === 'pre-run') {
      goBack();
      toast('人脸核身已通过，点击「开始」即可跑步');
      return;
    }
    if (context === 'profile') {
      goBack();
      toast('人脸核身已通过');
      return;
    }
    render();
    toast('人脸核身已通过');
  }

  function clearScanTimers() {
    runtime.scanTimers.forEach((t) => clearTimeout(t));
    runtime.scanTimers = [];
  }

  /* ------------------------------------------------------------------
     动作处理
  ------------------------------------------------------------------ */

  function currentGuideModalOpen() {
    return runtime.modalStack.some((m) => m.name === 'guide');
  }

  function handleAction(act, el) {
    const run = runtime.run;
    switch (act) {
      case 'back':
        goBack();
        return;
      case 'home':
        if (currentIsRunning()) {
          toast('请先长按结束运动');
          return;
        }
        go('home');
        return;
      case 'favorite':
        toast(D.toggleFavorite() ? '已收藏「阳光云校园」' : '已取消收藏');
        return;
      case 'menu':
        if (currentIsRunning() && !run.paused) {
          toast('跑步中请先暂停或结束运动');
          return;
        }
        openModal('menu');
        return;
      case 'cap-close':
        toast('演示模式下小程序保持运行');
        return;
      case 'go-profile':
        go('userInfo');
        return;
      case 'copy-link':
        closeAllModals();
        toast('分享链接已复制（演示）');
        return;
      case 'share':
        openModal('shareSheet');
        return;
      case 'go-checklist':
        go('checklist');
        return;
      case 'toggle-broadcast':
        state.voiceBroadcast = state.voiceBroadcast === false ? true : false;
        D.save();
        render();
        toast(state.voiceBroadcast !== false ? '语音播报已开启' : '语音播报已关闭');
        return;
      case 'plan-list':
        openModal('planList');
        return;
      case 'plan-info':
      case 'plan-info-inline':
        closeAllModals();
        go('planInfo');
        return;
      case 'plan-switch':
        closeAllModals();
        toast('已切换跑步计划（演示）');
        return;
      case 'unbind':
        openModal('unbindConfirm');
        return;
      case 'unbind-confirm':
        closeAllModals();
        toast('已提交解绑申请，请联系学校老师处理（演示）');
        return;
      case 'menu-profile':
        closeAllModals();
        go('profile');
        return;
      case 'go-checkin':
        go('record');
        return;
      case 'go-run':
        go('gorun');
        return;
      case 'broadcast':
        toast('校园广播即将上线，敬请期待');
        return;
      case 'faq': {
        const item = el.closest('.tip-item');
        if (!item) return;
        item.classList.toggle('open');
        return;
      }
      case 'faq-all':
        openModal('faqAll');
        return;
      case 'rules-doc':
      case 'menu-rules':
        closeAllModals();
        openModal('rulesDoc');
        return;
      case 'plan-detail':
        closeAllModals();
        go('planInfo');
        return;
      case 'menu-plan':
        closeAllModals();
        openModal('planList');
        return;
      case 'record-detail': {
        const rec = state.records.find((r) => r.id === el.dataset.id);
        if (rec) {
          if (!rec.checks) rec.checks = checksForSavedRecord(rec);
          openModal('recordDetail', rec);
        }
        return;
      }
      case 'checkin': {
        if (!D.guideReady()) {
          openModal('guide');
          return;
        }
        go('gorun');
        toast('在「去运动」页点击开始即可打卡');
        return;
      }
      case 'gender': {
        const g = el.dataset.g;
        D.setProfile({ gender: g });
        state = D.getState();
        render();
        toast(g === 'male' ? '已切换为男生标准' : '已切换为女生标准');
        return;
      }
      case 'bind':
        openModal('bind');
        return;
      case 'bind-save': {
        const name = ($('#bindName') || {}).value || '';
        const sid = ($('#bindId') || {}).value || '';
        if (!name.trim() || !sid.trim()) {
          toast('姓名和学号不能为空');
          return;
        }
        D.setProfile({ name: name.trim(), studentId: sid.trim() });
        state = D.getState();
        closeModal();
        render();
        toast('学生信息已更新');
        return;
      }
      case 'reverify':
      case 'menu-reverify':
        closeAllModals();
        runtime.faceContext = 'profile';
        go('face');
        return;
      case 'appeal': {
        if (el.closest('.drc-appeal') && el.closest('.drc-appeal').classList.contains('is-pending')) return;
        const rec = state.records.find((r) => r.id === el.dataset.id || (el.closest('[data-id]') && el.closest('[data-id]').dataset.id === r.id));
        const target = rec || state.records.find((r) => r.id === el.dataset.id);
        if (target) {
          runtime.appealReason = '';
          openModal('appeal', target);
        }
        return;
      }
      case 'appeal-pick':
        runtime.appealReason = el.dataset.r;
        window.__appealReason = runtime.appealReason;
        renderModal();
        return;
      case 'appeal-submit': {
        const top = topModal();
        const rec = top && top.data;
        if (!rec) return;
        if (!runtime.appealReason) {
          toast('请选择申诉原因');
          return;
        }
        rec.appealed = true;
        rec.appealReason = runtime.appealReason;
        D.save();
        closeModal();
        render();
        toast('申诉已提交，等待学校审核（演示）');
        return;
      }
      case 'reset-demo':
        openModal('resetConfirm');
        return;
      case 'reset-confirm':
        D.reset();
        state = D.getState();
        runtime.pendingResult = null;
        runtime.run = null;
        clearInterval(runtime.runTimer);
        closeAllModals();
        runtime.history = [];
        go('home', { replace: true });
        toast('演示数据已重置');
        return;
      case 'tab-walk':
      case 'tab-cycle':
        toast('阳光跑仅支持「跑步」模式打卡');
        return;
      case 'tab-run':
        return;
      case 'goal-tab':
        toast('演示版支持设定距离目标');
        return;
      case 'month-summary': {
        const monthRecords = state.records.filter(
          (r) => new Date(r.startedAt).getMonth() === D.now().getMonth()
        );
        const km = monthRecords.reduce((s, r) => s + r.distanceKm, 0);
        toast(`本月累计跑步 ${km.toFixed(2)} 公里 · 共 ${monthRecords.length} 次记录`);
        return;
      }
      case 'better-gps':
        openModal('gpsTips');
        return;
      case 'goal':
        runtime.goalDraft = state.goals.distanceKm || 0;
        openModal('goal');
        return;
      case 'goal-pick': {
        runtime.goalDraft = parseFloat(el.dataset.v);
        updateGoalModal();
        return;
      }
      case 'goal-custom': {
        const row = $('.goal-custom-row');
        if (row) row.hidden = !row.hidden;
        return;
      }
      case 'goal-custom-ok': {
        const input = $('#goalCustomInput');
        const v = input ? parseFloat(input.value) : NaN;
        if (!v || v <= 0 || v > 100) {
          toast('请输入 0.1 - 100 之间的目标公里数');
          return;
        }
        runtime.goalDraft = Math.round(v * 100) / 100;
        updateGoalModal();
        const row = $('.goal-custom-row');
        if (row) row.hidden = true;
        return;
      }
      case 'goal-confirm':
        D.setGoal({ distanceKm: runtime.goalDraft || null });
        state = D.getState();
        closeModal();
        render();
        toast(runtime.goalDraft ? `目标已设定为 ${runtime.goalDraft} 公里` : '已开始运动，暂无目标');
        return;
      case 'goal-skip':
        D.setGoal({ distanceKm: null });
        state = D.getState();
        closeModal();
        render();
        toast('已跳过目标设定');
        return;
      case 'start-run':
        if (!D.isVerified()) {
          openModal('faceRemind');
          return;
        }
        beginRun();
        return;
      case 'face-remind-go':
        closeAllModals();
        runtime.faceContext = 'pre-run';
        go('face');
        return;
      case 'face-agree':
        startFaceScan({ context: runtime.faceContext });
        return;
      case 'face-cancel':
        goBack();
        return;
      case 'scan-cancel':
        if (runtime.faceContext === 'run-check') {
          toast('需完成核身才能继续本次跑步');
          return;
        }
        clearScanTimers();
        closeAllModals();
        return;
      case 'pause':
        if (!run) return;
        togglePause();
        return;
      case 'resume-run':
        resumeRun();
        return;
      case 'end-early':
        if (!run) return;
        closeAllModals();
        finishRun(false);
        return;
      case 'lock':
        if (!run) return;
        run.locked = !run.locked;
        run.showLockTip = false;
        if (run.locked) {
          openModal('runLocked');
        } else {
          if (topModal() && topModal().name === 'runLocked') closeModal();
        }
        updateRunUI();
        return;
      case 'unlock-run':
        if (!run) return;
        run.locked = false;
        closeAllModals();
        updateRunUI();
        toast('已解锁，运动将继续记录');
        return;
      case 'voice':
        state.voiceOn = !state.voiceOn;
        D.setVoice(state.voiceOn);
        if (run) run.voiceOn = state.voiceOn;
        updateRunUI();
        render();
        toast(state.voiceOn ? '陪伴语音已开启' : '陪伴语音已关闭');
        return;
      case 'claim-coin':
        toast('已领取 40 运动币（演示）');
        return;
      case 'sync':
        syncResult();
        return;
      case 'no-sync':
        openModal('noSyncConfirm');
        return;
      case 'discard-run':
        closeAllModals();
        runtime.pendingResult = null;
        runtime.history = [];
        go('home', { replace: true });
        toast('本次记录未同步，已返回首页');
        return;
      case 'success-home':
        runtime.pendingResult = null;
        go('home', { replace: true });
        toast('运动数据已同步至学校');
        return;
      case 'success-records':
        runtime.pendingResult = null;
        go('record', { replace: true });
        return;
      case 'guide-task': {
        const key = el.dataset.key;
        const g = state.guide;
        if (key === 'video') {
          openModal('video');
        } else if (key === 'quiz') {
          runtime.quiz = { idx: 0, selected: null };
          openModal('quiz');
        } else if (key === 'insurance') {
          if (g.insurance || g.insuranceSkipped) {
            toast('保险任务已完成');
          } else {
            openModal('insurance');
          }
        }
        return;
      }
      case 'guide-checkin':
        closeAllModals();
        go('gorun');
        toast('攻略已完成，可以开始打卡了');
        return;
      case 'guide-blocked':
        toast('请先完成上方任务');
        return;
      case 'video-play': {
        el.classList.add('is-playing');
        el.innerHTML = A.icon('pause', 22);
        toast('热身视频播放中（演示）');
        return;
      }
      case 'video-finish':
        D.setGuide('video', true);
        closeModal();
        toast('「查看运动视频」任务已完成');
        return;
      case 'quiz-pick':
        if (!runtime.quiz) runtime.quiz = { idx: 0, selected: null };
        runtime.quiz.selected = parseInt(el.dataset.i, 10);
        renderModal();
        return;
      case 'quiz-next': {
        if (!runtime.quiz) runtime.quiz = { idx: 0, selected: null };
        const q = D.QUIZ[runtime.quiz.idx];
        if (runtime.quiz.selected == null) return;
        if (runtime.quiz.selected !== q.answer) {
          toast('回答不正确，请再想一想');
          return;
        }
        if (runtime.quiz.idx >= D.QUIZ.length - 1) {
          D.setGuide('quiz', true);
          closeModal();
          toast('答题通过，「参加答题测试」任务已完成');
        } else {
          runtime.quiz.idx += 1;
          runtime.quiz.selected = null;
          renderModal();
        }
        return;
      }
      case 'insurance-claim':
        D.setGuide('insurance', true);
        state = D.getState();
        closeModal();
        toast('已领取 30 天运动意外险（演示）');
        return;
      case 'insurance-skip':
        D.setGuide('insurance', false);
        state = D.getState();
        state.guide.insuranceSkipped = true;
        D.save();
        closeModal();
        toast('已跳过保险领取');
        return;
      case 'menu-about':
        closeAllModals();
        openModal('about');
        return;
      case 'close-modal':
        if (el.classList && el.classList.contains('sheet-mask')) {
          closeModal();
        } else {
          closeModal();
        }
        return;
      default:
        return;
    }
  }

  function updateGoalModal() {
    const b = $('#goalValue');
    if (b) b.textContent = runtime.goalDraft ? runtime.goalDraft.toFixed(2) : '0.00';
    $all('.goal-cell[data-v]').forEach((cell) => {
      cell.classList.toggle('selected', Math.abs(parseFloat(cell.dataset.v) - runtime.goalDraft) < 0.001);
    });
  }

  function checksForSavedRecord(rec) {
    const rule = rec.gender === 'female' ? D.RULES.female : D.rule();
    const pace = rec.durationSec / Math.max(rec.distanceKm, 0.01);
    const dup = rec.reason === '重复打卡';
    return [
      {
        label: '有效里程',
        value: `${rec.distanceKm.toFixed(2)} / ${rule.minKm.toFixed(1)} 公里`,
        ok: rec.distanceKm >= rule.minKm
      },
      { label: '平均配速', value: `${D.fmtPace(pace)} / 公里（上限 ${rule.paceText}）`, ok: pace <= rule.maxPaceSec },
      {
        label: '平均步频',
        value: `${Math.round(rec.cadence)} 步/分（下限 ${rule.cadenceText}）`,
        ok: rec.cadence >= rule.minCadence
      },
      { label: '运动中随机核身', value: rec.faceVerified ? '已通过' : '未完成', ok: !!rec.faceVerified },
      { label: '跑步区域', value: '山东财经大学圣井校区田径场', ok: true },
      { label: '当日首次打卡', value: dup ? '当日已有有效记录' : '是', ok: !dup }
    ];
  }

  /* ------------------------------------------------------------------
     长按结束
  ------------------------------------------------------------------ */

  function startHold(e) {
    const holdEl = e.target.closest('#endHold');
    if (!holdEl) return;
    if (!runtime.run || runtime.run.finished) return;
    e.preventDefault();
    const start = performance.now();
    runtime.hold = { started: start, done: false };
    const step = () => {
      if (!runtime.hold) return;
      const pct = Math.min(100, ((performance.now() - start) / 1200) * 100);
      runtime.run.holdPct = pct;
      const el = $('#endHold');
      if (el) el.style.setProperty('--hold', pct + '%');
      if (pct >= 100 && !runtime.hold.done) {
        runtime.hold.done = true;
        runtime.hold = null;
        if (el) el.style.setProperty('--hold', '0%');
        openModal('finishConfirm');
        return;
      }
      runtime.holdRaf = requestAnimationFrame(step);
    };
    runtime.holdRaf = requestAnimationFrame(step);
  }

  function cancelHold() {
    if (runtime.hold) {
      runtime.hold = null;
      cancelAnimationFrame(runtime.holdRaf);
      if (runtime.run) runtime.run.holdPct = 0;
      const el = $('#endHold');
      if (el) el.style.setProperty('--hold', '0%');
    }
  }

  /* ------------------------------------------------------------------
     全局事件
  ------------------------------------------------------------------ */

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) {
      const mask = e.target.closest('.sheet-mask');
      if (mask) closeModal();
      return;
    }
    /* 对话框内部点击不关闭，但对话框内的按钮照常处理 */
    if (el.dataset.act === 'close-modal' && el.classList.contains('dialog-mask')) {
      if (e.target.closest('.dialog')) return;
      closeModal();
      return;
    }
    if (el.dataset.act === 'close-modal' && el.classList.contains('sheet-mask')) {
      closeModal();
      return;
    }
    handleAction(el.dataset.act, el, e);
  });

  document.addEventListener('pointerdown', startHold);
  document.addEventListener('pointerup', cancelHold);
  document.addEventListener('pointercancel', cancelHold);
  document.addEventListener('pointerleave', cancelHold);

  window.addEventListener('popstate', () => {
    if (runtime.modalStack.length) {
      closeModal();
      return;
    }
    goBack();
  });

  /* 首屏 */
  render();

  /* 调试/演示 API：便于在浏览器控制台或自动化截图时预览状态 */
  window.SunRun = {
    get state() {
      return D.getState();
    },
    get view() {
      return runtime.view;
    },
    get run() {
      return runtime.run;
    },
    get modalStack() {
      return runtime.modalStack.map((m) => m.name);
    },
    go,
    render,
    openModal(name, data) {
      openModal(name, data);
    },
    closeModal,
    closeAll: closeAllModals,
    setVerified() {
      D.setVerified();
      state = D.getState();
      render();
    },
    completeGuide() {
      state.guide.video = true;
      state.guide.quiz = true;
      state.guide.insuranceSkipped = true;
      D.save();
      state = D.getState();
      render();
    },
    beginRun,
    finishRunNow() {
      if (!runtime.run) {
        D.setVerified();
        state = D.getState();
        beginRun();
      }
      const r = runtime.run;
      r.distanceKm = 2.24;
      r.elapsedSec = 752;
      r.cadence = 171;
      r.calories = 126;
      r.faceCheckDone = true;
      r.paceSec = r.elapsedSec / r.distanceKm;
      appendRoutePoints();
      finishRun(false);
    },
    syncResult,
    setGoal(km) {
      D.setGoal({ distanceKm: km });
      state = D.getState();
      render();
    }
  };
})();
