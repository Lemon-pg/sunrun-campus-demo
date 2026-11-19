/* ============================================================
   数据层：学期规则、演示数据、本地存储与成绩计算
   ============================================================ */
window.AppData = (function () {
  'use strict';

  const STORAGE_KEY = 'sunrun-campus:v3';
  const DATA_VERSION = 3;
  const SEED_ID = 'completed-51-v3';

  /* 演示时钟：固定在学期内的一个周四上午，方便展示完整学期进度 */
  const DEMO_NOW = '2026-10-30T16:44:00+08:00';

  const SEMESTER = {
    title: '2026~2027第一学期',
    planName: '2026~2027第一学期大二大三大三',
    start: '2026-08-24',
    end: '2026-12-20',
    uploadEnd: '2026-12-20T22:00:00+08:00',
    dailyStart: '06:00',
    dailyEnd: '22:00',
    area: '各校区田径场'
  };

  /* 本学期跑步计划（与真实截图一致：51 次、单次不少于 2 公里） */
  const PLAN = {
    targetRuns: 51,
    minKm: 2.0,
    scope: '大二大三大三',
    title: '2026~2027第一学期',
    start: '2026-08-24',
    end: '2026-12-20',
    maxDaily: 1,
    slowestPace: "7'00\"",
    minCadence: 130,
    midCheck: '0.4-0.8公里',
    allowPause: '允许',
    runWindow: '06:00-22:00'
  };

  /* 历史跑步计划（与真实截图中的“跑步计划”弹层一致） */
  const PLAN_HISTORY = [
    {
      name: '校园阳光健康跑（2025-09-22~2025-12-21）',
      start: '2025-09-22',
      end: '2025-12-21',
      status: '已结束'
    },
    {
      name: '校园阳光健康跑（2026-03-09~2026-06-21）',
      start: '2026-03-09',
      end: '2026-06-21',
      status: '已结束'
    },
    {
      name: '2026~2027第一学期大二大三大三',
      start: '2026-08-24',
      end: '2026-12-20',
      status: '进行中',
      current: true
    }
  ];

  /* 官方计分表：有效跑步次数 -> 体育课成绩（满分15分） */
  const SCORE_TABLE = [
    { runs: 4, points: 1 },
    { runs: 8, points: 2 },
    { runs: 12, points: 3 },
    { runs: 16, points: 4 },
    { runs: 20, points: 5 },
    { runs: 24, points: 6 },
    { runs: 28, points: 7 },
    { runs: 32, points: 8 },
    { runs: 35, points: 9 },
    { runs: 38, points: 10 },
    { runs: 41, points: 11 },
    { runs: 44, points: 12 },
    { runs: 47, points: 13 },
    { runs: 49, points: 14 },
    { runs: 51, points: 15 }
  ];

  const RULES = {
    male: {
      label: '男生',
      minKm: 2.0,
      maxPaceSec: 7 * 60,
      minCadence: 130,
      paceText: "7'00\"",
      cadenceText: '130'
    },
    female: {
      label: '女生',
      minKm: 2.0,
      maxPaceSec: 8 * 60,
      minCadence: 120,
      paceText: "8'00\"",
      cadenceText: '120'
    }
  };

  const FAQ = [
    {
      q: '如果学生信息不正确怎么办？',
      a: '可在「我的 - 学生信息」中修改姓名与学号；学院、学校信息由学校统一维护。如仍不正确，请联系体育学院阳光跑负责老师。'
    },
    {
      q: '跑步成绩如何计算？',
      a: '阳光跑成绩占体育课总成绩的 15%。按有效打卡次数计分：4 次得 1 分，8 次得 2 分……完成本学期 51 次计划可获 15 分，具体见「我的 - 学期成绩」。'
    },
    {
      q: '重复打卡算不算成绩？',
      a: '每天只统计 1 次有效跑步。同一天再次完成的记录会标记为「重复打卡」，保留记录但不计入成绩；人脸核身未通过的记录可在跑步详情中发起申诉。'
    },
    {
      q: '为什么跑步中没有步数/配速？',
      a: '请确认已授权支付宝运动读取运动数据，并将支付宝的电池策略设置为「无限制」。开跑后点击左下角锁屏，保持运动页面打开。'
    },
    {
      q: '在哪里查看数据是否同步到学校？',
      a: '运动结束后需完成人脸核身，并点击「同步数据到学校」。同步成功后，可在「运动打卡 - 近期记录」中查看本次记录及同步时间。'
    },
    {
      q: '雨天或田径场封闭怎么办？',
      a: '请以学校通知为准，恶劣天气暂停跑步不会影响计分进度；补跑安排以体育学院通知为准。'
    }
  ];

  const GUIDE_TASKS = [
    { key: 'video', title: '查看运动视频' },
    { key: 'quiz', title: '参加答题测试' },
    { key: 'insurance', title: '领取保险' }
  ];

  const QUIZ = [
    {
      q: '单次有效跑步的最低里程是多少？',
      options: ['1.5 公里', '2.0 公里', '3.0 公里'],
      answer: 1
    },
    {
      q: '每天最多可以计入几次有效跑步？',
      options: ['1 次', '2 次', '不限次数'],
      answer: 0
    },
    {
      q: '跑步结束后，在哪里把数据同步给学校？',
      options: ['支付宝运动的分享按钮', '运动结果页的「同步数据到学校」', '无需同步，自动上传'],
      answer: 1
    }
  ];

  /* 演示种子数据：计划已完成 51 次
     - 51 条有效跑步记录，跨越 2026-08-25 ~ 2026-10-29
     - 另含 1 条「人脸核身未通过」记录（不计入打卡次数，用于展示申诉）
     - 今天 2026-10-30 尚未打卡 */
  const SEED_RECORDS = (() => {
    const records = [];
    const startDate = new Date('2026-08-25T00:00:00+08:00');
    const spanDays = 65; // 到 2026-10-29
    const distances = [2.01, 2.35, 3.0, 2.65, 2.1, 2.6, 2.0, 2.15, 2.65, 2.54, 2.24, 2.4, 2.2, 2.12, 2.3];
    for (let i = 0; i < 51; i++) {
      const offset = Math.round((i * spanDays) / 50);
      const day = new Date(startDate.getTime() + offset * 86400000);
      const hour = i % 3 === 0 ? 7 : i % 3 === 1 ? 18 : 20;
      const minute = (i * 7 + 5) % 60;
      day.setHours(hour, minute, (i * 13) % 60, 0);
      const distanceKm = distances[i % distances.length];
      const pace = 318 + (i % 7) * 8; // 5'18" ~ 6'14"
      const durationSec = Math.round(distanceKm * pace);
      const cadence = 160 + ((i * 7) % 18);
      const endedAt = new Date(day.getTime() + durationSec * 1000);
      const syncedAt = new Date(endedAt.getTime() + 22000);
      records.push({
        id: 'seed-v-' + i,
        startedAt: day.toISOString(),
        endedAt: endedAt.toISOString(),
        syncedAt: syncedAt.toISOString(),
        distanceKm,
        durationSec,
        cadence,
        calories: Math.round(distanceKm * 55),
        valid: true,
        reason: '',
        status: 'success',
        faceVerified: true,
        inTrack: true,
        routeSeed: i * 3 + 1
      });
    }
    // 人脸核身未通过记录（不计入 51 次）
    const failStart = new Date('2026-10-28T18:10:34+08:00');
    const failDuration = 167;
    const failEnd = new Date(failStart.getTime() + failDuration * 1000);
    records.push({
      id: 'seed-face-fail',
      startedAt: failStart.toISOString(),
      endedAt: failEnd.toISOString(),
      syncedAt: new Date(failEnd.getTime() + 22000).toISOString(),
      distanceKm: 0.71,
      durationSec: failDuration,
      cadence: 286,
      calories: 39,
      valid: false,
      reason: '人脸核身未通过',
      status: 'face_fail',
      faceVerified: false,
      inTrack: true,
      paceSecOverride: 237,
      routeSeed: 99
    });
    records.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    return records;
  })();

  const defaultState = () => ({
    version: DATA_VERSION,
    seedId: SEED_ID,
    profile: {
      name: '李同学',
      studentId: '202500000000',
      college: '经济学院',
      school: '山东财经大学',
      grade: '2025级',
      phoneMasked: '187******33',
      gender: 'male',
      avatarHue: 0
    },
    records: JSON.parse(JSON.stringify(SEED_RECORDS)),
    guide: { video: true, quiz: true, insurance: false, insuranceSkipped: false },
    goals: { distanceKm: null, durationMin: null },
    voiceOn: true,
    verifiedAt: null,
    favorites: false
  });

  let state = null;

  function load() {
    try {
      ['sunrun-campus:v1', 'sunrun-campus:v2'].forEach((k) => localStorage.removeItem(k));
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === DATA_VERSION && parsed.seedId === SEED_ID && parsed.profile && Array.isArray(parsed.records)) {
          state = Object.assign(defaultState(), parsed);
          state.guide = Object.assign({ video: false, quiz: false, insurance: false, insuranceSkipped: false }, parsed.guide || {});
          state.profile = Object.assign(defaultState().profile, parsed.profile);
          return state;
        }
      }
    } catch (e) {
      /* ignore corrupted storage */
    }
    state = defaultState();
    save();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage may be unavailable */
    }
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    state = defaultState();
    save();
    return state;
  }

  function getState() {
    return state;
  }

  function now() {
    return new Date(DEMO_NOW);
  }

  /* ---------------- 工具 ---------------- */

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function fmtDuration(totalSec) {
    const s = Math.max(0, Math.round(totalSec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  }

  function fmtDurationShort(sec) {
    const s = Math.max(0, Math.round(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}小时${m}分`;
    return `${m}分${pad(s % 60)}秒`;
  }

  function fmtPace(secPerKm) {
    if (!secPerKm || !isFinite(secPerKm)) return "--'--\"";
    const s = Math.round(secPerKm);
    return `${Math.floor(s / 60)}'${pad(s % 60)}"`;
  }

  function fmtPaceDetail(secPerKm) {
    if (!secPerKm || !isFinite(secPerKm)) return "--'--\"min/km";
    const s = Math.round(secPerKm);
    return `${Math.floor(s / 60)}'${pad(s % 60)}"min/km`;
  }

  function fmtClock(date) {
    const d = date instanceof Date ? date : new Date(date);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fmtDateTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}:${pad(d.getSeconds())}`;
  }

  function fmtDateCN(date) {
    const d = date instanceof Date ? date : new Date(date);
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${week}`;
  }

  function dayKey(date) {
    const d = date instanceof Date ? date : new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function scoreForCount(count) {
    let points = 0;
    let reached = null;
    for (const row of SCORE_TABLE) {
      if (count >= row.runs) {
        points = row.points;
        reached = row;
      }
    }
    return { points, reached };
  }

  function nextScoreRow(count) {
    for (const row of SCORE_TABLE) {
      if (count < row.runs) return row;
    }
    return null;
  }

  function validRecords() {
    return state.records.filter((r) => r.valid);
  }

  function validCount() {
    return validRecords().length;
  }

  function todayValidRecord() {
    const key = dayKey(now());
    return state.records.find((r) => r.valid && dayKey(r.startedAt) === key);
  }

  function rule() {
    return RULES[state.profile.gender] || RULES.male;
  }

  function semesterProgress() {
    const start = new Date(SEMESTER.start + 'T00:00:00+08:00');
    const end = new Date(SEMESTER.end + 'T22:00:00+08:00');
    const cur = now();
    const total = end - start;
    const done = Math.min(Math.max(cur - start, 0), total);
    const pct = total > 0 ? (done / total) * 100 : 0;
    const totalDays = Math.round(total / 86400000);
    const remainDays = Math.max(0, Math.ceil((end - cur) / 86400000));
    const week = Math.max(1, Math.floor((cur - start) / (7 * 86400000)) + 1);
    return { pct, totalDays, remainDays, week };
  }

  function weekDays() {
    /* 最近 7 天（含演示当日） */
    const base = now();
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base.getTime() - i * 86400000);
      const key = dayKey(d);
      const done = state.records.some((r) => r.valid && dayKey(r.startedAt) === key);
      arr.push({ date: d, key, done, isToday: i === 0, label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()] });
    }
    return arr;
  }

  function maskedName(name) {
    const n = name || (state && state.profile && state.profile.name) || '';
    return n.length > 1 ? n.slice(0, 1) + '**' : n;
  }

  function validRunsLast30Days() {
    const base = now();
    const threshold = base.getTime() - 30 * 86400000;
    return state.records.filter((r) => r.valid && new Date(r.startedAt).getTime() >= threshold).length;
  }

  function nextDayKey() {
    /* 演示时钟顺延一天，用于连续打卡演示 */
    return now();
  }

  function makeId() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function saveRecord(record) {
    state.records.unshift(record);
    save();
  }

  function setGuide(key, value) {
    state.guide[key] = value;
    if (key === 'insurance' && !value) {
      /* 未领取保险不影响打卡，视为已处理 */
    }
    save();
  }

  function guideReady() {
    const g = state.guide;
    return !!(g.video && g.quiz && (g.insurance || g.insuranceSkipped));
  }

  function setVerified() {
    state.verifiedAt = now().toISOString();
    save();
  }

  function isVerified() {
    return !!state.verifiedAt;
  }

  function setProfile(patch) {
    state.profile = Object.assign(state.profile, patch);
    save();
  }

  function setGoal(goal) {
    state.goals = Object.assign({ distanceKm: null, durationMin: null }, goal);
    save();
  }

  function setVoice(on) {
    state.voiceOn = !!on;
    save();
  }

  function toggleFavorite() {
    state.favorites = !state.favorites;
    save();
    return state.favorites;
  }

  return {
    STORAGE_KEY,
    DEMO_NOW,
    SEMESTER,
    PLAN,
    PLAN_HISTORY,
    SCORE_TABLE,
    RULES,
    FAQ,
    GUIDE_TASKS,
    QUIZ,
    load,
    save,
    reset,
    getState,
    now,
    pad,
    fmtDuration,
    fmtDurationShort,
    fmtPace,
    fmtPaceDetail,
    fmtClock,
    fmtDateTime,
    fmtDateCN,
    dayKey,
    scoreForCount,
    nextScoreRow,
    validRecords,
    validCount,
    todayValidRecord,
    rule,
    semesterProgress,
    weekDays,
    maskedName,
    validRunsLast30Days,
    nextDayKey,
    makeId,
    saveRecord,
    setGuide,
    guideReady,
    setVerified,
    isVerified,
    setProfile,
    setGoal,
    setVoice,
    toggleFavorite
  };
})();
