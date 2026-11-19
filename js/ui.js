/* ============================================================
   视图模板：页面与弹层
   ============================================================ */
window.Views = (function () {
  'use strict';
  const { icon, avatar, graduationCap, runnerArt, faceFigure, alipayShield, sportsApp, mapSVG } = window.Assets;
  const D = window.AppData;

  const capsule = (light = false, showShare = true) => `
    <div class="nav-right">
      <button class="nav-fav" data-act="favorite" aria-label="收藏">${icon('star', 19)}</button>
      ${showShare ? `<button class="nav-fav nav-share" data-act="share" aria-label="分享">${icon('share', 18)}</button>` : ''}
      <div class="nav-capsule">
        <button class="cap-btn" data-act="menu" aria-label="更多">${icon('dots', 18)}</button>
        <button class="cap-btn" data-act="cap-close" aria-label="关闭小程序"><span class="cap-dot"></span></button>
      </div>
    </div>`;

  const navBar = (title, opts = {}) => {
    const { back = true, light = false, home = false, align = 'center', showShare = true } = opts;
    return `<div class="mp-nav ${light ? 'light' : ''}">
      ${back ? `<button class="nav-back" data-act="back" aria-label="返回">${icon('back', 21)}</button>` : ''}
      ${home ? `<button class="nav-home" data-act="home" aria-label="首页">${icon('home', 19)}</button>` : ''}
      ${title ? `<span class="nav-title ${align === 'left' ? 'left' : ''}">${title}</span>` : ''}
      ${capsule(light, showShare)}
    </div>`;
  };

  const weekDot = (d) => {
    if (d.done) return `<span class="week-dot done ${d.isToday ? 'today' : ''}" title="${d.key}">${icon('check', 11)}</span>`;
    return `<span class="week-dot ${d.isToday ? 'today' : ''}" title="${d.key}"><span class="plus">+</span></span>`;
  };

  /* ============================ 首页 ============================ */

  function home() {
    const s = D.getState();
    const p = s.profile;
    const doneToday = !!D.todayValidRecord();
    const week = D.weekDays().map(weekDot).join('');
    const monthCount = s.records.filter(
      (r) => new Date(r.startedAt).getMonth() === D.now().getMonth() && new Date(r.startedAt).getFullYear() === D.now().getFullYear()
    ).length;
    const maskedName = p.name.length > 1 ? p.name.slice(0, 1) + '**' : p.name;

    return `<section class="view home-view">
      <div class="scroll home-scroll">
        <div class="home-hero home-hero-simple">
          <div class="mp-nav home-nav">
            <button class="nav-back" data-act="back" aria-label="返回">${icon('back', 22)}</button>
            <span class="home-nav-title">运动首页</span>
            ${capsule()}
          </div>
          <h1 class="hero-title home-school-title">${p.school}</h1>
          <div class="home-hero-art"><img class="cap-img" src="assets/cap-3d.png" alt="" /></div>
        </div>

        <div class="home-sheet">
          <div class="profile-row home-user" data-act="go-profile">
            <div class="home-avatar"><img class="avatar-asset" src="assets/avatar-3d.png" alt="" /></div>
            <div class="home-name">${maskedName}<span class="home-name-chev">${icon('chevronRight', 18)}</span></div>
          </div>

          <div class="feature-card run-card home-run-card">
            <div class="feature-ribbon">${doneToday ? '已打卡' : '未打卡'}</div>
            <div class="feature-title" data-act="go-checkin">运动打卡</div>
            <div class="feature-desc">计划累计完成 ${D.validCount()} 次${D.validCount() >= D.PLAN.targetRuns ? ' · 已完成' : ''}</div>
            <div class="run-card-body">
              <button class="run-btn" data-act="go-run">去运动</button>
              <div class="week-dots">${week}</div>
            </div>
          </div>

          <div class="section-caption">使用小贴士</div>

          <div class="home-faq-panel">
            <div class="home-faq-question">
              <span class="faq-q faq-q-blue">?</span>
              <span>使用运动打卡工具时，需要注意的事项有哪些？</span>
            </div>
            <div class="home-faq-answer">
              <span class="faq-q faq-q-orange">${icon('dots', 16)}</span>
              <div class="home-faq-list">
                <p>1. 保持运动工具的页面在前台运行。</p>
                <p>2. 尽量不要切换到其它应用。如果一定要切换，则可在使用其他应用后尽快切回到运动打卡页面。</p>
                <p>3. 尽量不锁屏。如要锁屏，建议使用运动工具页面左下角的锁屏功能，不要用手机自带的锁屏工具。</p>
                <p>4. 手机保证电量充足，不要打开省电模式。</p>
                <p>5. 尽量不要开太多应用，避免运动打卡的进程被系统终止。</p>
                <p>6. 运动结束之后，一定要记得按“结束”按钮。</p>
                <p class="home-faq-note">以上注意事项能最大程度的减小跑步进程被手机系统终止的概率，避免出现统计不准确的情况。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ============================ 运动打卡 ============================ */

  function detailRecordCard(rec) {
    const pace = rec.paceSecOverride || rec.durationSec / Math.max(rec.distanceKm, 0.01);
    const success = !!rec.valid;
    const faceFail = !success && (rec.status === 'face_fail' || rec.reason === '人脸核身未通过');
    const badgeText = success ? '打卡成功' : faceFail ? '人脸核身未通过' : rec.reason || '未计入';
    const appeal = faceFail
      ? rec.appealed
        ? '<span class="drc-appeal is-pending">申诉处理中</span>'
        : `<span class="drc-appeal" data-act="appeal" data-id="${rec.id}">我要申诉 <span class="chev">${icon(
            'chevronRight',
            13
          )}</span></span>`
      : '';
    return `<div class="detail-record-card ${success ? 'is-success' : 'is-fail'}" data-act="record-detail" data-id="${
      rec.id
    }">
      <div class="drc-head">
        <span class="drc-distance">${rec.distanceKm.toFixed(2)}公里 <span class="chev">${icon('chevronRight', 15)}</span></span>
        <span class="drc-badge ${success ? 'ok' : 'fail'}">${badgeText}</span>
      </div>
      <div class="drc-meta">${D.fmtDuration(rec.durationSec)} <i>|</i> ${D.fmtPaceDetail(pace)} <i>|</i> ${Math.round(
      rec.cadence
    )}步/分</div>
      <div class="drc-foot">
        <span class="drc-date">${D.fmtDateTime(rec.startedAt)}</span>
        ${appeal}
      </div>
    </div>`;
  }

  function record() {
    const s = D.getState();
    const p = s.profile;
    const plan = D.PLAN;
    const validRecords = s.records.filter((r) => r.valid);
    const totalCount = validRecords.length;
    const totalKm = validRecords.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalSec = validRecords.reduce((sum, r) => sum + r.durationSec, 0);
    const planDone = totalCount >= D.PLAN.targetRuns;
    const doneToday = !!D.todayValidRecord();

    return `<section class="view record-view detail-page">
      <div class="detail-hero">
        <div class="detail-clouds"></div>
        <div class="mp-nav detail-nav">
          <button class="nav-back" data-act="back" aria-label="返回">${icon('back', 22)}</button>
          <span class="detail-nav-title">跑步详情</span>
          ${capsule()}
        </div>
        <div class="detail-hero-art"><img class="runner-img" src="assets/runner-3d.png" alt="" /></div>
      </div>

      <div class="detail-sheet">
        <div class="detail-section-title"><span class="ico-badge">${icon('runner', 14)}</span>运动打卡</div>

        <div class="detail-user">
          <div class="detail-avatar"><img class="avatar-asset" src="assets/avatar-3d.png" alt="" /></div>
          <div class="detail-name">${p.name}</div>
          <div class="plan-link gray" data-act="plan-list">跑步计划 ${icon('chevronRight', 14)}</div>
        </div>

        <div class="detail-grade-row">
          <span class="detail-grade">${p.grade}</span>
          <span class="today-pill ${doneToday ? 'done' : ''}">${doneToday ? '今日已打卡' : '今日未打卡'}</span>
        </div>

        <div class="detail-plan-row">
          <div class="detail-plan-count">
            <b>${plan.targetRuns}</b><span>次</span>
            <em>单次不少于${plan.minKm}公里</em>
            ${planDone ? '<span class="plan-done-tag">已完成</span>' : ''}
          </div>
          <div class="plan-detail-link" data-act="plan-info">计划详情 ${icon('chevronRight', 14)}</div>
        </div>
        <div class="detail-plan-term">${D.SEMESTER.title}${plan.scope}</div>

        <div class="detail-stats-title">跑步统计</div>
        <div class="run-stats-card">
          <div class="rsc-item"><span>打卡总次数</span><b>${totalCount}次</b></div>
          <div class="rsc-item"><span>已跑总公里数</span><b>${totalKm.toFixed(2)}km</b></div>
          <div class="rsc-item"><span>已跑总时长</span><b>${D.fmtDuration(totalSec)}</b></div>
        </div>

        <div class="detail-record-list">
          ${s.records.map(detailRecordCard).join('')}
        </div>
        <div class="detail-footnote">下拉查看更多记录 · 数据为本地演示</div>
      </div>

      <div class="bottom-cta detail-cta">
        <button class="btn-primary detail-checkin-btn" data-act="checkin">打卡</button>
      </div>
    </section>`;
  }

  /* ============================ 我的 / 成绩 ============================ */

  function profile() {
    const s = D.getState();
    const p = s.profile;
    const valid = D.validCount();
    const score = D.scoreForCount(valid);
    const next = D.nextScoreRow(valid);
    const rule = D.rule();

    const steps = D.SCORE_TABLE
      .map(
        (row) => `<div class="score-step ${valid >= row.runs ? 'reached' : ''}">
          <div class="s-runs">${row.runs}次</div><div class="s-pts">${row.points}分</div>
        </div>`
      )
      .join('');

    return `<section class="view profile-page">
      ${navBar('我的', { back: true })}
      <div class="page-scroll">
        <div class="profile-hero-card">
          <div class="profile-hero-avatar"><img class="avatar-asset" src="assets/avatar-3d.png" alt="" /></div>
          <div class="profile-hero-info">
            <div class="profile-hero-name">${p.name}</div>
            <div class="profile-hero-school">${p.school} · ${p.college}</div>
            <div class="profile-hero-id">学/工号 ${p.studentId} · ${p.grade}</div>
          </div>
          <button class="mini-edit" data-act="bind">编辑</button>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">学期成绩</div>
              <div class="panel-title-sub">阳光跑占体育课总成绩 15%（15 分）</div>
            </div>
            <span class="record-badge valid">${D.SEMESTER.title}</span>
          </div>
          <div class="score-main">
            <span class="score-number">${score.points}</span>
            <span class="score-total">/ 15 分</span>
            <span class="score-note">${next ? `再完成 ${next.runs - valid} 次<br>可提升至 ${next.points} 分` : '已获得满分'}</span>
          </div>
          <div class="plan-progress">
            <div class="plan-progress-head"><span>有效打卡 ${valid} 次</span><b>${next ? next.runs - valid : 0} 次待完成</b></div>
            <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (valid / (next ? next.runs : D.PLAN.targetRuns)) * 100)}%"></div></div>
          </div>
          <div class="score-steps">${steps}</div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div class="panel-title">跑步规则</div>
            <div class="gender-switch">
              <button class="${p.gender === 'male' ? 'active' : ''}" data-act="gender" data-g="male">男生</button>
              <button class="${p.gender === 'female' ? 'active' : ''}" data-act="gender" data-g="female">女生</button>
            </div>
          </div>
          <div class="rule-row"><span class="rule-label">有效单次里程</span><span class="rule-value">≥ ${rule.minKm.toFixed(1)} 公里</span></div>
          <div class="rule-row"><span class="rule-label">平均配速</span><span class="rule-value">不快于 ${rule.paceText} / 公里</span></div>
          <div class="rule-row"><span class="rule-label">平均步频</span><span class="rule-value">≥ ${rule.cadenceText} 步 / 分钟</span></div>
          <div class="rule-row"><span class="rule-label">每日计入</span><span class="rule-value">仅 1 次（重复打卡不计分）</span></div>
          <div class="rule-row"><span class="rule-label">建议时段</span><span class="rule-value">${D.SEMESTER.dailyStart} - ${D.SEMESTER.dailyEnd}</span></div>
          <div class="rule-row"><span class="rule-label">安全区域</span><span class="rule-value">${D.SEMESTER.area}</span></div>
          <div class="rule-row"><span class="rule-label">计划目标</span><span class="rule-value">${D.PLAN.targetRuns} 次 · 单次不少于 ${D.PLAN.minKm} 公里</span></div>
          <div class="rule-row"><span class="rule-label">成绩截止</span><span class="rule-value">${D.SEMESTER.end.replace(/-/g, '-')} 22:00 前完成上传</span></div>
        </div>

        <div class="setting-list">
          <div class="setting-item" data-act="bind">
            <span class="setting-ico">${icon('user', 16)}</span>
            <span class="setting-text">学生信息</span>
            <span class="setting-extra">${p.name} · ${p.studentId}</span>
            <span class="chev">${icon('chevronRight', 14)}</span>
          </div>
          <div class="setting-item" data-act="reverify">
            <span class="setting-ico">${icon('shield', 16)}</span>
            <span class="setting-text">人脸核身</span>
            <span class="setting-extra">${D.isVerified() ? '已通过' : '未核身'}</span>
            <span class="chev">${icon('chevronRight', 14)}</span>
          </div>
          <div class="setting-item" data-act="faq-all">
            <span class="setting-ico">${icon('question', 16)}</span>
            <span class="setting-text">使用小贴士</span>
            <span class="setting-extra">${D.FAQ.length} 个常见问题</span>
            <span class="chev">${icon('chevronRight', 14)}</span>
          </div>
          <div class="setting-item" data-act="rules-doc">
            <span class="setting-ico">${icon('info', 16)}</span>
            <span class="setting-text">官方通知与规则</span>
            <span class="setting-extra">查看</span>
            <span class="chev">${icon('chevronRight', 14)}</span>
          </div>
          <div class="setting-item" data-act="reset-demo">
            <span class="setting-ico">${icon('refresh', 16)}</span>
            <span class="setting-text">重置演示数据</span>
            <span class="setting-extra">恢复初始记录</span>
            <span class="chev">${icon('chevronRight', 14)}</span>
          </div>
        </div>
        <div class="page-footnote">本页面为界面复刻演示，非学校官方应用<br />数据仅保存在本机浏览器中</div>
      </div>
    </section>`;
  }

  /* ============================ 去运动 ============================ */

  function gorun() {
    const s = D.getState();
    const verified = D.isVerified();
    const goal = s.goals.distanceKm;
    return `<section class="view go-page">
      ${navBar('去打卡', { back: true, align: 'left' })}
      <div class="go-head">
        <div class="go-title"><div>阳光跑</div><div>山东财经大学</div></div>
        <button class="go-checklist" data-act="go-checklist">
          <span class="go-checklist-ico">${icon('clipboard', 18)}<i class="go-red-dot"></i></span>
          跑前查看清单
        </button>
      </div>
      <div class="go-map-card">
        <div class="go-map-img"></div>
        ${verified ? `<div class="go-verified">${icon('check', 11)} 已通过人脸核身</div>` : ''}
        ${goal ? `<div class="go-goal-chip">${icon('target', 12)} 目标 ${goal} 公里</div>` : ''}
        <div class="go-controls">
          <button class="go-side-btn" data-act="goal">
            <span class="go-side-circle">${icon('target', 24)}</span>
            <span>设定目标</span>
          </button>
          <button class="go-start" data-act="start-run">
            <span class="go-start-ico">${icon('runnerSolid', 30)}</span>
            <span>开始</span>
          </button>
          <div class="go-side-spacer"></div>
        </div>
      </div>
    </section>`;
  }

  /* ============================ 用户详情 ============================ */

  function userInfo() {
    const s = D.getState();
    const p = s.profile;
    return `<section class="view user-info-page">
      <div class="user-info-hero">
        ${navBar('用户详情', { back: true, align: 'left' })}
        <div class="user-info-cap"><img class="cap-img" src="assets/cap-3d.png" alt="" /></div>
      </div>
      <div class="user-info-sheet">
        <div class="user-info-title">用户信息</div>
        <div class="user-info-row"><span class="uir-k">姓名</span><span class="uir-v">${D.maskedName(p.name)}</span></div>
        <div class="user-info-row"><span class="uir-k">手机号</span><span class="uir-v">${p.phoneMasked || '187******33'}</span></div>
        <div class="user-info-row"><span class="uir-k">学/工号</span><span class="uir-v">${p.studentId}</span></div>
        <div class="user-info-row"><span class="uir-k">组织信息</span><span class="uir-v">${p.grade}</span></div>
        <button class="user-info-unbind" data-act="unbind">解绑用户</button>
        <div class="user-info-note">如果信息有误，请联系学校老师进行信息修改</div>
      </div>
    </section>`;
  }

  /* ============================ 计划详情 ============================ */

  function planInfo() {
    const plan = D.PLAN;
    const rows = [
      ['计划名称', D.SEMESTER.planName],
      ['计划时间', `${plan.start.replace(/-/g, '-')} – ${plan.end.replace(/-/g, '-')}`],
      ['计划目标', `${plan.targetRuns}次`],
      ['单次最低里程', `${plan.minKm}公里`],
      ['单日最高次数', `${plan.maxDaily}次`],
      ['单次最慢配速', `${plan.slowestPace}分/公里`],
      ['单次最低步频', `${plan.minCadence}步/分`],
      ['跑中认证', `在${plan.midCheck}之间需要再次完成认证`],
      ['是否允许中途暂停', plan.allowPause],
      ['跑步时段', plan.runWindow.replace('-', '–')]
    ];
    return `<section class="view plan-info-page">
      ${navBar('计划详情', { back: true, align: 'left' })}
      <div class="plan-info-list">
        ${rows
          .map(
            ([k, v]) => `<div class="plan-info-row"><span class="pir-k">${k}</span><span class="pir-v">${v}</span></div>`
          )
          .join('')}
      </div>
    </section>`;
  }

  /* ============================ 跑前检查清单 ============================ */

  function checklist() {
    const s = D.getState();
    const on = s.voiceBroadcast !== false;
    return `<section class="view checklist-page">
      ${navBar('跑前检查清单', { back: true, align: 'left', showShare: false })}
      <div class="checklist-banner">为确保你的运动轨迹记录准确，有如下设置方法</div>
      <div class="checklist-item" data-act="toggle-broadcast">
        <div class="ci-head">
          <span class="ci-title">开启语音播报</span>
          <span class="ci-status ${on ? 'on' : ''}">${on ? '已开启' : '未开启'}</span>
        </div>
        <p class="ci-desc">开启后可有效防止运动数据丢失情况，同时语音播放可提示你运动的公里数和时长</p>
      </div>
    </section>`;
  }

  /* ============================ 身份验证 ============================ */

  function face() {
    return `<section class="view face-view">
      <div class="face-head">
        <div class="mp-nav light">
          <button class="nav-back" data-act="back" aria-label="返回">${icon('back', 21)}</button>
          <span class="nav-title">身份验证</span>
          ${capsule(true)}
        </div>
        <div class="face-logos">
          <div class="face-logo-shield">${alipayShield()}</div>
          <div class="face-logo-app">${sportsApp()}</div>
        </div>
      </div>
      <div class="face-body">
        <div class="face-app-name">支付宝运动</div>
        <p class="face-desc">为了便于你满足支付宝运动的实名制的要求，需要使用支付宝认证服务，并在认证完成后，授权其查询如下信息</p>
        <div class="face-info-line"></div>
        <div class="face-bullet">你的本次人脸认证结果</div>
        <div class="face-consent">使用服务须同意 <a href="javascript:void(0)">《认证服务协议》</a></div>
        <div class="face-actions">
          <button class="btn-primary" data-act="face-agree">同意协议并认证</button>
          <button class="btn-ghost" data-act="face-cancel">暂不认证</button>
        </div>
      </div>
    </section>`;
  }

  /* 人脸扫描浮层（页面内） */
  function faceScan(title, sub, showCancel) {
    return `<div class="face-scan">
      <div class="face-scan-head">
        <div class="face-scan-title">${title || '人脸核身'}</div>
        <div class="face-scan-sub">${sub || '应学校要求，认证通过后才可操作'}</div>
      </div>
      <div class="scan-frame">
        <div class="scan-face">${faceFigure()}</div>
        <div class="scan-line"></div>
        <div class="scan-corners"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="scan-status" id="scanStatus">请正对屏幕，保持光线充足</div>
      <div class="scan-progress"><i></i></div>
      <div class="scan-hint">正在比对支付宝实名信息…</div>
      ${showCancel === false ? '' : '<button class="scan-cancel" data-act="scan-cancel">取消</button>'}
    </div>`;
  }

  /* ============================ 跑步中 ============================ */

  function run(runState) {
    const s = D.getState();
    const rule = D.rule();
    const goalKm = s.goals.distanceKm || rule.minKm;
    const goalPct = Math.min(100, ((runState.distanceKm || 0) / goalKm) * 100);

    return `<section class="view run-view">
      <div class="run-map-wrap">
        ${mapSVG({ width: 390, height: 430, variant: 'run', route: true })}
        <div class="run-nav-overlay">
          <button class="nav-home" data-act="home" aria-label="首页">${icon('home', 19)}</button>
          <span class="run-nav-title">去运动</span>
          <div class="nav-right">
            <div class="nav-capsule">
              <button class="cap-btn" data-act="menu">${icon('dots', 18)}</button>
              <button class="cap-btn" data-act="cap-close"><span class="cap-dot"></span></button>
            </div>
          </div>
        </div>
        <div class="run-map-pills">
          <span class="run-coin">${icon('coin', 13)} 本次运动获得 <b>40</b> 运动币 <span class="claim" data-act="claim-coin">领取</span></span>
          <span class="run-gps"><span class="gps-dot" style="width:6px;height:6px"></span>GPS</span>
        </div>
        ${
          runState.showLockTip
            ? `<div class="run-lock-tip">为了避免运动数据丢失<br>建议点此锁定当前界面</div>`
            : ''
        }
      </div>

      <div class="run-panel">
        <div class="run-distance"><span id="runKm">${(runState.distanceKm || 0).toFixed(2)}</span><span class="unit">公里</span></div>
        <div class="run-meta-line">支付宝运动 · 跑步 | ${runState.startedAtText}</div>

        <div class="run-stats">
          <div class="run-stat"><div class="v" id="runPace">${D.fmtPace(runState.paceSec || 0)}</div><div class="k">配速</div></div>
          <div class="run-stat"><div class="v" id="runTime">${D.fmtDuration(runState.elapsedSec || 0)}</div><div class="k">时间</div></div>
          <div class="run-stat"><div class="v" id="runCal">${Math.round(runState.calories || 0)}<small>千卡</small></div><div class="k">千卡</div></div>
        </div>

        <div class="run-goal">
          <div class="run-goal-head">
            <span>最低里程 ${rule.minKm.toFixed(1)} 公里 · 平均步频 <b id="runCadence">${Math.round(
      runState.cadence || 0
    )}</b> 步/分</span>
            <b id="runGoalText">${(runState.distanceKm || 0).toFixed(2)} / ${goalKm.toFixed(2)}</b>
          </div>
          <div class="progress-track"><div class="progress-fill" id="runGoalBar" style="width:${goalPct}%"></div></div>
        </div>

        <div class="run-valid-chips">
          <span class="valid-chip ${runState.distanceKm >= rule.minKm ? 'ok' : ''}" id="chipKm">${icon('check', 10)} 里程 ${
      runState.distanceKm >= rule.minKm ? '达标' : '未达标'
    }</span>
          <span class="valid-chip ${runState.paceSec && runState.paceSec <= rule.maxPaceSec ? 'ok' : ''}" id="chipPace">${icon(
      'check',
      10
    )} 配速</span>
          <span class="valid-chip ${runState.cadence >= rule.minCadence ? 'ok' : ''}" id="chipCadence">${icon(
      'check',
      10
    )} 步频</span>
        </div>

        <div class="run-controls">
          <button class="ctrl-side ${runState.locked ? 'active' : ''}" data-act="lock">
            <span class="ctrl-circle">${icon(runState.locked ? 'lock' : 'lockMini', 20)}</span>锁屏
          </button>
          <button class="pause-orb ${runState.paused ? 'resume' : ''}" data-act="pause">
            ${icon(runState.paused ? 'play' : 'pause', 32)}
          </button>
          <button class="ctrl-side ${runState.voiceOn ? 'active' : ''}" data-act="voice">
            <span class="ctrl-side-avatar"><img class="avatar-asset" src="assets/avatar-3d.png" alt="" /></span>陪伴语音
          </button>
        </div>
        <button class="end-hold" id="endHold" data-act="end-hold" style="--hold:${runState.holdPct || 0}%">
          <span>长按结束运动</span>
        </button>
      </div>
    </section>`;
  }

  /* ============================ 运动结果 ============================ */

  function result(rec) {
    const isDup = rec.reason === '重复打卡';
    return `<section class="view result-view">
      ${navBar('运动结果', { back: true })}
      <div class="result-scroll">
        <div class="result-map">
          ${mapSVG({ width: 390, height: 300, variant: 'result', route: true })}
          <div class="result-date-chip">${D.fmtDateTime(rec.startedAt)}</div>
        </div>
        <div class="result-card">
          <div class="result-head">
            <span class="result-kind">支付宝运动 · 跑步</span>
            <span class="record-badge ${rec.valid ? 'valid' : isDup ? 'dup' : 'invalid'}">${
      rec.valid ? '有效打卡' : rec.reason || '未计入'
    }</span>
          </div>
          <div class="result-dist"><b>${rec.distanceKm.toFixed(2)}</b><span>公里</span></div>
          <div class="result-stats">
            <div class="result-stat"><div class="v">${D.fmtDuration(rec.durationSec)}</div><div class="k">时长</div></div>
            <div class="result-stat"><div class="v">${D.fmtPace(rec.durationSec / rec.distanceKm)}</div><div class="k">平均配速</div></div>
            <div class="result-stat"><div class="v">${Math.round(rec.cadence)}</div><div class="k">步频</div></div>
            <div class="result-stat"><div class="v">${Math.round(rec.calories)}</div><div class="k">千卡</div></div>
          </div>
        </div>

        <div class="check-panel">
          <div class="check-panel-head">
            <div class="panel-title">打卡判定</div>
            <span class="check-verdict ${rec.valid ? 'ok' : 'warn'}">${rec.valid ? '本次打卡有效' : '本次不计入成绩'}</span>
          </div>
          ${rec.checks
            .map(
              (c) => `<div class="check-row">
                <span class="check-mark ${c.ok ? 'ok' : 'bad'}">${icon(c.ok ? 'check' : 'close', 11)}</span>
                <span>${c.label}</span>
                <span class="v">${c.value}</span>
              </div>`
            )
            .join('')}
        </div>
      </div>
      <div class="result-actions">
        <button class="btn-primary" data-act="sync">同步数据到学校</button>
        <button class="btn-ghost" data-act="no-sync">暂不同步</button>
      </div>
    </section>`;
  }

  function success(rec, scoreBefore, scoreAfter) {
    const s = D.getState();
    const valid = D.validCount();
    const next = D.nextScoreRow(valid);
    const gained = scoreAfter - scoreBefore;
    const dup = rec.reason === '重复打卡';
    return `<section class="view success-view" style="top:0;padding-top:calc(54px + 42px)">
      <div class="success-badge">${icon('check', 46)}</div>
      <div class="success-title">${dup ? '数据已同步' : '打卡成功'}</div>
      <div class="success-sub">${dup ? '当日已有有效打卡，本次记录标注为「重复打卡」' : `本次运动已同步至学校${next ? `，再完成 ${next.runs - valid} 次可获 ${next.points} 分` : '，本学期阳光跑已满分'}`}<br />${D.fmtDateTime(
      rec.startedAt
    )} · ${rec.distanceKm.toFixed(2)} 公里</div>

      <div class="success-score">
        <div class="success-score-ico">${icon('runner', 22)}</div>
        <div class="success-score-main">
          <div class="t">本学期有效打卡 ${valid} 次</div>
          <div class="s">${dup ? '本次不计入有效次数' : `阳光跑成绩 ${gained > 0 ? `+${gained} 分` : '暂无变化'}`} · 占体育课总成绩 15%</div>
        </div>
        <div class="success-score-num"><b>${scoreAfter}</b><span>/15 分</span></div>
      </div>

      <div class="success-actions">
        <button class="btn-primary" data-act="success-home">返回首页</button>
        <button class="btn-ghost" data-act="success-records">查看打卡记录</button>
      </div>
    </section>`;
  }

  /* ============================ 弹层 ============================ */

  const sheetWrap = (title, body, footer, cls = '') => `
    <div class="sheet-mask" data-act="close-modal"></div>
    <div class="sheet ${cls}">
      <div class="sheet-head">
        <div class="sheet-title">${title}</div>
        <button class="sheet-close" data-act="close-modal" aria-label="关闭">${icon('close', 18)}</button>
      </div>
      <div class="sheet-body">${body}</div>
      ${footer ? `<div class="sheet-footer">${footer}</div>` : ''}
    </div>`;

  const Modals = {
    goal(state) {
      const goal = state.goals.distanceKm || 0;
      const presets = [1, 5, 10, 21.0975, 42.195];
      const cells = presets
        .map(
          (v) => `<div class="goal-cell ${Math.abs(goal - v) < 0.001 ? 'selected' : ''}" data-act="goal-pick" data-v="${v}">
            ${v === 21.0975 ? '21.0975' : v === 42.195 ? '42.195' : v}<span>${
            v === 21.0975 ? '半马' : v === 42.195 ? '全马' : '公里'
          }</span>
          </div>`
        )
        .join('');
      return sheetWrap(
        '设定运动目标',
        `<div class="goal-tabs">
          <span class="goal-tab active" data-act="goal-tab" data-tab="distance">距离</span>
          <span class="goal-tab" data-act="goal-tab" data-tab="duration">时长</span>
        </div>
        <div class="goal-value"><b id="goalValue">${goal ? goal.toFixed(2) : '0.00'}</b><span>公里</span></div>
        <div class="goal-grid">
          ${cells}
          <div class="goal-cell" data-act="goal-custom">自定义<span>手动输入</span></div>
        </div>
        <div class="goal-custom-row" hidden>
          <input id="goalCustomInput" type="number" min="0.1" max="100" step="0.1" placeholder="输入目标公里数，如 2.5" />
          <button data-act="goal-custom-ok">确定</button>
        </div>
        <div class="goal-confirm"><button class="btn-primary" data-act="goal-confirm">确定目标</button></div>
        <div class="goal-skip" data-act="goal-skip">暂不设置</div>`,
        ''
      );
    },

    share() {
      return sheetWrap(
        '分享给好友',
        `<div class="share-box">
          <div class="share-logo">${window.Assets.appLogo(58)}</div>
          <div class="share-name">阳光云校园</div>
          <div class="share-desc">山东财经大学 · 校园阳光健康跑</div>
          <div class="share-link">https://render.alipay.com/p/yuyan/1800200100012... <span class="share-copy" data-act="copy-link">复制</span></div>
        </div>`,
        `<button class="btn-primary" data-act="copy-link" style="height:46px;border-radius:12px">复制链接</button>`
      );
    },

    planList() {
      const rows = D.PLAN_HISTORY.map(
        (p) => `<div class="plan-list-row">
          <div class="plan-list-main">
            <div class="plan-list-name-row">
              <span class="plan-list-name">${p.name}</span>
              <span class="plan-list-detail" data-act="plan-info-inline">计划详情 ${icon('chevronRight', 12)}</span>
            </div>
            <div class="plan-list-meta">${p.start} ~ ${p.end} <span class="plan-list-status ${p.current ? 'current' : ''}">${p.status}</span></div>
          </div>
          <button class="plan-switch" data-act="plan-switch">切换计划</button>
        </div>`
      ).join('');
      return sheetWrap('跑步计划', `<div class="plan-list">${rows}</div>`, '');
    },

    planDetail() {
      const rule = D.rule();
      return sheetWrap(
        '计划详情',
        `<div class="plan-detail-rows">
          <div class="detail-row"><span class="k">计划名称</span><span class="v">${D.SEMESTER.planName}</span></div>
          <div class="detail-row"><span class="k">计划学期</span><span class="v">${D.SEMESTER.title}</span></div>
          <div class="detail-row"><span class="k">计划时间</span><span class="v">${D.SEMESTER.start.replace(
          /-/g,
          '/'
        )} – ${D.SEMESTER.end.replace(/-/g, '/')}</span></div>
          <div class="detail-row"><span class="k">计划目标</span><span class="v">${D.PLAN.targetRuns} 次有效打卡（15 分）</span></div>
          <div class="detail-row"><span class="k">单次最低里程</span><span class="v">单次不少于 ${D.PLAN.minKm} 公里</span></div>
          <div class="detail-row"><span class="k">每日打卡上限</span><span class="v">1 次</span></div>
          <div class="detail-row"><span class="k">当前配速上限</span><span class="v">${rule.paceText} / 公里 · 步频 ≥ ${rule.cadenceText}</span></div>
        </div>`,
        `<button class="btn-primary" data-act="close-modal" style="height:46px;border-radius:10px">知道了</button>`
      );
    },

    recordDetail(rec) {
      const pace = rec.durationSec / rec.distanceKm;
      return sheetWrap(
        '运动详情',
        `<div class="result-map" style="height:190px;border-radius:14px;overflow:hidden;margin-bottom:14px">
          ${mapSVG({ width: 390, height: 280, variant: 'result', route: true })}
          <div class="result-date-chip">${D.fmtDateTime(rec.startedAt)}</div>
        </div>
        <div style="display:flex;align-items:baseline;gap:7px;margin-bottom:4px">
          <span style="font-family:var(--num-font);font-size:36px;font-weight:650">${rec.distanceKm.toFixed(2)}</span>
          <span style="font-size:12px;color:var(--text-3)">公里</span>
          <span class="record-badge ${rec.valid ? 'valid' : rec.reason === '重复打卡' ? 'dup' : 'invalid'}" style="margin-left:auto">${
          rec.valid ? '有效打卡' : rec.reason || '未计入'
        }</span>
        </div>
        <div class="result-stats" style="border-top:1px solid #f2f4f7;margin-top:12px">
          <div class="result-stat"><div class="v">${D.fmtDuration(rec.durationSec)}</div><div class="k">时长</div></div>
          <div class="result-stat"><div class="v">${D.fmtPace(pace)}</div><div class="k">平均配速</div></div>
          <div class="result-stat"><div class="v">${Math.round(rec.cadence)}</div><div class="k">步频</div></div>
          <div class="result-stat"><div class="v">${Math.round(rec.calories)}</div><div class="k">千卡</div></div>
        </div>
        <div class="check-panel" style="margin:14px 0 0;box-shadow:none;padding:4px 0 0">
          ${(rec.checks || [])
            .map(
              (c) => `<div class="check-row">
                <span class="check-mark ${c.ok ? 'ok' : 'bad'}">${icon(c.ok ? 'check' : 'close', 11)}</span>
                <span>${c.label}</span><span class="v">${c.value}</span></div>`
            )
            .join('')}
          <div class="check-row"><span class="check-mark ok">${icon('check', 11)}</span><span>数据同步时间</span><span class="v">${
          rec.syncedAt ? D.fmtDateTime(rec.syncedAt) : '未同步'
        }</span></div>
        </div>`,
        ''
      );
    },

    guide(state) {
      const g = state.guide;
      const done = (k) => (k === 'insurance' ? g.insurance || g.insuranceSkipped : g[k]);
      const ready = D.guideReady();
      const tasks = D.GUIDE_TASKS.map((t, i) => {
        const isDone = done(t.key);
        return `<div class="guide-task" data-act="guide-task" data-key="${t.key}">
          <span class="guide-num">${i + 1}</span>
          <span class="guide-task-text">${t.title}</span>
          ${
            isDone
              ? `<span class="guide-task-status done">已完成</span>`
              : t.key === 'insurance'
              ? `<span class="guide-go">Go</span>`
              : `<span class="guide-task-status">去完成</span>`
          }
        </div>`;
      }).join('');

      return sheetWrap(
        '',
        `<div class="guide-head">
          <div class="guide-title">运动打卡攻略</div>
          <div class="guide-sub">初次开跑前请完成以下任务再开始运动打卡</div>
        </div>
        ${tasks}
        <div class="guide-start ${ready ? 'ready' : ''}" data-act="${ready ? 'guide-checkin' : 'guide-blocked'}">${
          ready ? '去打卡' : '完成以上任务后即可打卡'
        }</div>`,
        ''
      );
    },

    video(state) {
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet">
        <div class="sheet-head"><div class="sheet-title">运动前热身视频</div><button class="sheet-close" data-act="close-modal">${icon(
        'close',
        18
      )}</button></div>
        <div class="sheet-body">
          <div class="video-box">
            <button class="video-play" id="videoPlay" data-act="video-play">${icon('play', 22)}</button>
            <div class="video-bar"><i></i></div>
          </div>
          <div class="video-caption">开跑前请完成 3-5 分钟动态热身：踝关节环绕、高抬腿、后踢腿与弓步压腿，降低运动损伤风险。</div>
        </div>
        <div class="sheet-footer"><button class="btn-primary" data-act="video-finish" style="height:46px;border-radius:12px">我已看完热身视频</button></div>
      </div>`;
    },

    quiz(state, data) {
      const idx = data && data.idx != null ? data.idx : 0;
      const selected = data && data.selected != null ? data.selected : null;
      const q = D.QUIZ[idx];
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet">
        <div class="sheet-head"><div class="sheet-title">答题测试</div><button class="sheet-close" data-act="close-modal">${icon(
        'close',
        18
      )}</button></div>
        <div class="sheet-body quiz-wrap">
          <div class="quiz-progress">第 ${idx + 1} / ${D.QUIZ.length} 题</div>
          <div class="q">${q.q}</div>
          ${q.options
            .map(
              (o, i) => `<div class="quiz-option ${selected === i ? 'selected' : ''}" data-act="quiz-pick" data-i="${i}">
                <span class="opt-mark"></span>${o}</div>`
            )
            .join('')}
        </div>
        <div class="sheet-footer"><button class="btn-primary" data-act="quiz-next" ${selected == null ? 'disabled' : ''} style="height:46px;border-radius:12px">${
        idx === D.QUIZ.length - 1 ? '提交答卷' : '下一题'
      }</button></div>
      </div>`;
    },

    insurance(state) {
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet">
        <div class="sheet-head"><div class="sheet-title">运动意外险</div><button class="sheet-close" data-act="close-modal">${icon(
        'close',
        18
      )}</button></div>
        <div class="sheet-body">
          <div class="insurance-box">
            <div class="insurance-badge">${icon('shield', 12)} 支付宝 · 免费赠送</div>
            <div class="insurance-title">运动意外险 · 30 天</div>
            <div class="insurance-desc">为避免跑步期间发生损伤及意外，系统赠送为期 30 天的免费意外门诊险一份，可自愿领取、随时取消。</div>
            <div class="insurance-items"><span>意外医疗</span><span>门诊保障</span><span>0 元领取</span></div>
          </div>
          <div class="video-caption">领取后 15 天内可在「支付宝 - 我的 - 蚂蚁保」中手动取消，不影响阳光跑打卡。</div>
        </div>
        <div class="sheet-footer">
          <button class="btn-primary" data-act="insurance-claim" style="height:46px;border-radius:12px">立即领取</button>
          <button class="btn-ghost" data-act="insurance-skip" style="height:42px;font-size:13px">暂不需要，跳过</button>
        </div>
      </div>`;
    },

    menu() {
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet menu-sheet">
        <div class="sheet-head"><div class="sheet-title">更多</div><button class="sheet-close" data-act="close-modal">${icon(
        'close',
        18
      )}</button></div>
        <div class="sheet-body">
          <div class="menu-item" data-act="menu-plan">${`<span class="menu-ico">${icon(
        'calendarMini',
        16
      )}</span>`}跑步计划</div>
          <div class="menu-item" data-act="menu-rules">${`<span class="menu-ico">${icon(
        'info',
        16
      )}</span>`}阳光跑规则</div>
          <div class="menu-item" data-act="menu-profile">${`<span class="menu-ico">${icon(
        'user',
        16
      )}</span>`}成绩与规则</div>
          <div class="menu-item" data-act="menu-reverify">${`<span class="menu-ico">${icon(
        'shield',
        16
      )}</span>`}重新人脸核身</div>
          <div class="menu-item" data-act="menu-about">${`<span class="menu-ico">${icon(
        'question',
        16
      )}</span>`}关于阳光云校园</div>
        </div>
      </div>`;
    },

    bind(state) {
      const p = state.profile;
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet">
        <div class="sheet-head"><div class="sheet-title">学生信息</div><button class="sheet-close" data-act="close-modal">${icon(
        'close',
        18
      )}</button></div>
        <div class="sheet-body">
          <div class="form-field"><span class="form-label"><em>*</em>姓名</span><input class="form-input" id="bindName" value="${
        p.name
      }" maxlength="12" /></div>
          <div class="form-field"><span class="form-label"><em>*</em>学校名称</span><span class="form-static">${p.school} ${icon(
        'chevronRight',
        13
      )}</span></div>
          <div class="form-field"><span class="form-label"><em>*</em>学院</span><span class="form-static">${p.college} ${
        p.grade
      } ${icon('chevronRight', 13)}</span></div>
          <div class="form-field"><span class="form-label"><em>*</em>学号</span><input class="form-input" id="bindId" value="${
        p.studentId
      }" maxlength="18" /></div>
          <div class="tip-card" style="margin-top:12px;background:#f7f9fc;box-shadow:none">
            <div class="tip-item" style="cursor:default">
              <span class="tip-q">?</span><span class="tip-text" style="font-size:11px;color:#8a919c">学校、学院信息由教务系统同步，暂不支持自行修改</span>
            </div>
          </div>
        </div>
        <div class="sheet-footer"><button class="btn-primary" data-act="bind-save" style="height:46px;border-radius:12px">提交</button></div>
      </div>`;
    },

    faqAll() {
      return sheetWrap(
        '使用小贴士',
        D.FAQ.map(
          (f) => `<div class="tip-item" data-act="faq" data-i="x" style="cursor:default">
            <span class="tip-q">?</span><span class="tip-text">${f.q}</span>
          </div><div class="tip-answer" style="display:block">${f.a}</div>`
        ).join(''),
        ''
      );
    },

    rulesDoc() {
      return sheetWrap(
        '阳光跑规则',
        `<div class="plan-detail-rows">
          <div class="detail-row"><span class="k">成绩占比</span><span class="v">体育课总成绩 15%（15 分）</span></div>
          <div class="detail-row"><span class="k">计分方式</span><span class="v">4 次 1 分、8 次 2 分、12 次 3 分……完成 ${D.PLAN.targetRuns} 次 15 分</span></div>
          <div class="detail-row"><span class="k">有效里程</span><span class="v">单次不少于 ${D.PLAN.minKm} 公里</span></div>
          <div class="detail-row"><span class="k">配速要求</span><span class="v">男生 ≤ 7'00"、女生 ≤ 8'00" / 公里</span></div>
          <div class="detail-row"><span class="k">步频要求</span><span class="v">男生 ≥ 130、女生 ≥ 120 步 / 分</span></div>
          <div class="detail-row"><span class="k">有效时段</span><span class="v">每日 06:00 - 22:00，每日仅 1 次</span></div>
          <div class="detail-row"><span class="k">安全区域</span><span class="v">各校区田径场</span></div>
          <div class="detail-row"><span class="k">截止时间</span><span class="v">${D.SEMESTER.end.replace(/-/g, '.')} 22:00 前上传</span></div>
          <div class="detail-row"><span class="k">诚信要求</span><span class="v">禁止骑车、代跑、模拟器等作弊方式，学校将抽查运动数据</span></div>
        </div>
        <div class="page-footnote" style="margin-top:6px">依据：山东财经大学校园阳光健康跑相关通知与学生使用手册（本页为演示数据）</div>`,
        `<button class="btn-primary" data-act="close-modal" style="height:46px;border-radius:10px">我知道了</button>`
      );
    },

    gpsTips() {
      return sheetWrap(
        '如何让数据更准确？',
        `<div class="plan-detail-rows">
          <div class="detail-row"><span class="k">1</span><span class="v">确保手机电量充足，并将支付宝更新至最新版本。</span></div>
          <div class="detail-row"><span class="k">2</span><span class="v">在系统设置中将支付宝的电池策略设为「无限制」，避免 GPS 被后台停掉。</span></div>
          <div class="detail-row"><span class="k">3</span><span class="v">开跑后点击左下角「锁屏」，保持运动页面打开，不要按 Home 键或锁屏。</span></div>
          <div class="detail-row"><span class="k">4</span><span class="v">开启定位服务中的「精确位置」，并在田径场空旷处起跑。</span></div>
          <div class="detail-row"><span class="k">5</span><span class="v">跑步过程中无需频繁切换 App，避免定位漂移。</span></div>
        </div>`,
        `<button class="btn-primary" data-act="close-modal" style="height:46px;border-radius:10px">知道了</button>`
      );
    },

    faceRemind() {
      return `<div class="sheet-mask" data-act="close-modal"></div>
      <div class="sheet face-remind-sheet">
        <div class="face-remind-head">
          <div class="face-remind-title">人脸核身提醒</div>
          <div class="face-remind-sub">应学校要求，认证通过后才可操作</div>
        </div>
        <div class="face-remind-warn">
          <span class="fr-warn-ico">!</span>
          <span>因学校要求随机中途刷脸核身，请开启语音提醒，收到提醒后请及时完成刷脸认证，避免成绩作废</span>
        </div>
        <div class="face-remind-phone">
          <svg viewBox="0 0 300 330" style="width:100%;display:block">
            <rect x="36" y="14" width="228" height="360" rx="40" fill="#ffffff" stroke="#1b1f27" stroke-width="3.4"/>
            <rect x="116" y="24" width="68" height="12" rx="6" fill="#1b1f27"/>
            <rect x="52" y="150" width="196" height="70" rx="8" fill="#eaf4ff" opacity="0.7"/>
            <g transform="translate(48,54) scale(1.12)">
              <circle cx="88" cy="42" r="26" fill="#2b3a4e"/>
              <path d="M40 106c3-24 19-34 48-34s45 10 48 34z" fill="#66c4ea"/>
              <path d="M74 66h28v14c-4 5-24 5-28 0z" fill="#e8b79e"/>
              <ellipse cx="88" cy="46" rx="25" ry="27" fill="#f3c5aa"/>
              <path d="M61 44c-1-18 10-28 27-28s28 10 27 28c-3-9-8-14-12-15-8 6-23 6-31 1-5 2-8 6-11 14z" fill="#2b3a4e"/>
              <ellipse cx="78" cy="48" rx="2.8" ry="3.4" fill="#2b3a4e"/>
              <ellipse cx="98" cy="48" rx="2.8" ry="3.4" fill="#2b3a4e"/>
              <path d="M83 59c3 3 7 3 10 0" stroke="#c8745c" stroke-width="2" fill="none" stroke-linecap="round"/>
              <rect x="60" y="34" width="56" height="14" rx="7" fill="#7fb6f4" opacity="0.55"/>
              <path d="M58 30v-8M118 30v-8M58 54v8M118 54v8" stroke="#1677ff" stroke-width="4" stroke-linecap="round"/>
            </g>
            <path d="M52 162v-8M118 162v-8" stroke="#1677ff" stroke-width="4" stroke-linecap="round"/>
            <path d="M182 162v-8M248 162v-8" stroke="#1677ff" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="sheet-footer">
          <button class="btn-primary" data-act="face-remind-go" style="height:48px;border-radius:8px">去核身</button>
          <button class="btn-ghost" data-act="close-modal" style="height:40px;border:0;box-shadow:none;color:#8a919c;font-size:13px">暂不操作</button>
        </div>
      </div>`;
    },

    finishConfirm() {
      return `<div class="dialog-mask" data-act="close-modal">
        <div class="dialog" data-stop="1">
          <div class="dialog-title">结束本次运动？</div>
          <div class="dialog-text">结束后将生成运动记录，需完成人脸核身后同步数据到学校。</div>
          <div class="dialog-actions">
            <button class="dialog-btn primary" data-act="finish-now">结束并生成记录</button>
            <button class="dialog-btn light" data-act="close-modal">继续运动</button>
          </div>
        </div>
      </div>`;
    },

    noSyncConfirm() {
      return `<div class="dialog-mask" data-act="close-modal">
        <div class="dialog" data-stop="1">
          <div class="dialog-title">暂不同步？</div>
          <div class="dialog-text">未同步到学校的运动记录不计入阳光跑成绩，本次跑步数据将只保留在本机。</div>
          <div class="dialog-actions">
            <button class="dialog-btn primary" data-act="sync">继续同步</button>
            <button class="dialog-btn light" data-act="discard-run">仍然返回</button>
          </div>
        </div>
      </div>`;
    },

    about() {
      return sheetWrap(
        '关于阳光云校园',
        `<div style="text-align:center;padding:6px 0 14px">
          <div style="display:flex;justify-content:center;margin-bottom:10px">${window.Assets.appLogo(52)}</div>
          <div style="font-size:15px;font-weight:650">阳光云校园</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:4px">构建“健康-生活-教学”三维一体数字校园</div>
          <div style="font-size:10.5px;color:#b0b6c0;margin-top:2px">山东宝利坤体育科技有限公司</div>
        </div>
        <div class="plan-detail-rows">
          <div class="detail-row"><span class="k">当前学校</span><span class="v">山东财经大学</span></div>
          <div class="detail-row"><span class="k">学期计划</span><span class="v">${D.SEMESTER.title}</span></div>
          <div class="detail-row"><span class="k">使用方式</span><span class="v">支付宝搜索「阳光云校园」小程序，绑定学生信息后使用</span></div>
          <div class="detail-row"><span class="k">说明</span><span class="v">本页面为界面与交互复刻演示，非官方应用</span></div>
        </div>`,
        `<button class="btn-primary" data-act="close-modal" style="height:46px;border-radius:10px">知道了</button>`
      );
    },


    appeal(rec) {
      const reason = (window.__appealReason || '');
      const reasons = ['核身时环境光线不足', '系统未识别为本人', '网络或设备异常导致', '其他原因'];
      const pace = rec.durationSec / Math.max(rec.distanceKm, 0.01);
      return sheetWrap(
        '我要申诉',
        `<div class="appeal-record">
          <div>
            <div class="ar-main">${rec.distanceKm.toFixed(2)}公里</div>
            <div class="ar-meta">${D.fmtDateTime(rec.startedAt)} · ${D.fmtDuration(rec.durationSec)} · ${D.fmtPaceDetail(
          pace
        )}</div>
          </div>
          <span class="drc-badge fail">人脸核身未通过</span>
        </div>
        <div style="font-size:12.5px;color:#8a919c;line-height:1.7;padding:6px 0 2px">若本次记录因设备或环境原因未能通过人脸核身，可选择原因提交申诉，由学校审核处理。</div>
        <div class="appeal-reasons">
          ${reasons
            .map(
              (r) => `<div class="appeal-reason ${reason === r ? 'selected' : ''}" data-act="appeal-pick" data-r="${r}">
                <span class="radio"></span>${r}</div>`
            )
            .join('')}
        </div>`,
        `<button class="btn-primary" data-act="appeal-submit" style="height:46px;border-radius:12px">提交申诉</button>`
      );
    },

    resetConfirm() {
      return `<div class="dialog-mask" data-act="close-modal">
        <div class="dialog" data-stop="1">
          <div class="dialog-title">重置演示数据</div>
          <div class="dialog-text">将清除本机保存的打卡记录、学生信息与核身状态，恢复到初始演示数据。</div>
          <div class="dialog-actions">
            <button class="dialog-btn primary" data-act="reset-confirm">确认重置</button>
            <button class="dialog-btn light" data-act="close-modal">取消</button>
          </div>
        </div>
      </div>`;
    },
  };

  return { home, record, profile, gorun, userInfo, planInfo, checklist, face, faceScan, run, result, success, Modals, navBar };
})();
