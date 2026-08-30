import type { TimerMode } from '@/types'

export type Language = 'zh' | 'en'

export interface TranslationDict {
  appName: string
  footer: string
  modes: Record<TimerMode, string>
  timerLabels: Record<TimerMode, string>
  controls: {
    start: string
    pause: string
    reset: string
  }
  stats: {
    today: string
    total: string
    pomodoros: string
    completed: string
  }
  chart: {
    last7Days: string
    pomodoros: string
  }
  settings: {
    title: string
    language: string
    workMinutes: string
    shortBreak: string
    longBreak: string
    longBreakInterval: string
    minutes: string
    pomodorosUnit: string
    sound: string
    notifications: string
    background: string
    backgroundNone: string
    backgroundImage: string
    backgroundVideo: string
    backgroundVideoVolume: string
    pauseBackgroundVideo: string
    playBackgroundVideo: string
    backgroundVideoProgress: string
    videoVolumeHint: string
    uploadImage: string
    uploadVideo: string
    uploadBgm: string
    removeFile: string
    customVideo: string
    customImage: string
    defaultBgm: string
    customBgm: string
    bgm: string
    bgmVolume: string
    alertSound: string
    alertVolume: string
    alertDefault: string
    alertNailong: string
    alertGugugaga: string
    alertCustom: string
    uploadAlert: string
    preview: string
    uiOpacity: string
    immersiveMode: string
    resetOpacity: string
  }
  notifications: {
    workDoneTitle: string
    longBreakBody: string
    shortBreakBody: string
    breakOverTitle: string
    breakOverBody: string
  }
  documentTitle: {
    paused: string
  }
  theme: {
    toDark: string
    toLight: string
  }
  weekdays: [string, string, string, string, string, string, string]
}

export const translations: Record<Language, TranslationDict> = {
  zh: {
    appName: '番茄钟',
    footer: '专注 · 休息 · 循环',
    modes: {
      work: '专注',
      shortBreak: '短休息',
      longBreak: '长休息',
    },
    timerLabels: {
      work: '专注时间',
      shortBreak: '短休息',
      longBreak: '长休息',
    },
    controls: {
      start: '开始计时',
      pause: '暂停计时',
      reset: '重置计时',
    },
    stats: {
      today: '今日',
      total: '累计',
      pomodoros: '个番茄',
      completed: '已完成',
    },
    chart: {
      last7Days: '近 7 天',
      pomodoros: '个番茄',
    },
    settings: {
      title: '设置',
      language: '语言',
      workMinutes: '专注时长',
      shortBreak: '短休息',
      longBreak: '长休息',
      longBreakInterval: '长休息间隔',
      minutes: '分钟',
      pomodorosUnit: '个番茄',
      sound: '提示音',
      notifications: '桌面通知',
      background: '背景',
      backgroundNone: '无',
      backgroundImage: '图片',
      backgroundVideo: '视频',
      backgroundVideoVolume: '背景视频音量',
      pauseBackgroundVideo: '暂停背景视频',
      playBackgroundVideo: '播放背景视频',
      backgroundVideoProgress: '背景视频进度（可点击或拖动调整）',
      videoVolumeHint: '调节音量即可开启背景视频的声音（浏览器要求先静音自动播放）',
      uploadImage: '选择图片',
      uploadVideo: '选择视频',
      uploadBgm: '选择音乐',
      removeFile: '移除',
      customVideo: '自定义视频',
      customImage: '自定义图片',
      defaultBgm: '默认音乐',
      customBgm: '自定义音乐',
      bgm: '背景音乐',
      bgmVolume: 'BGM 音量',
      alertSound: '提醒音',
      alertVolume: '提醒音音量',
      alertDefault: '默认',
      alertNailong: '奶龙大笑',
      alertGugugaga: '咕咕嘎嘎',
      alertCustom: '自定义',
      uploadAlert: '选择音频',
      preview: '试听',
      uiOpacity: 'UI 透明度',
      immersiveMode: '沉浸模式',
      resetOpacity: '还原',
    },
    notifications: {
      workDoneTitle: '番茄完成！',
      longBreakBody: '干得漂亮！去休息一会儿吧。',
      shortBreakBody: '稍作休息，放松一下。',
      breakOverTitle: '休息结束',
      breakOverBody: '准备继续专注了吗？',
    },
    documentTitle: {
      paused: '已暂停',
    },
    theme: {
      toDark: '切换到深色模式',
      toLight: '切换到浅色模式',
    },
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  },
  en: {
    appName: 'Pomodoro',
    footer: 'Focus, rest, repeat.',
    modes: {
      work: 'Focus',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
    },
    timerLabels: {
      work: 'Focus Time',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
    },
    controls: {
      start: 'Start timer',
      pause: 'Pause timer',
      reset: 'Reset timer',
    },
    stats: {
      today: 'Today',
      total: 'Total',
      pomodoros: 'pomodoros',
      completed: 'completed',
    },
    chart: {
      last7Days: 'Last 7 Days',
      pomodoros: 'pomodoros',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      workMinutes: 'Focus length',
      shortBreak: 'Short break',
      longBreak: 'Long break',
      longBreakInterval: 'Long break interval',
      minutes: 'min',
      pomodorosUnit: 'pomodoros',
      sound: 'Sound',
      notifications: 'Notifications',
      background: 'Background',
      backgroundNone: 'None',
      backgroundImage: 'Image',
      backgroundVideo: 'Video',
      backgroundVideoVolume: 'Video volume',
      pauseBackgroundVideo: 'Pause background video',
      playBackgroundVideo: 'Play background video',
      backgroundVideoProgress: 'Background video progress (click or drag to seek)',
      videoVolumeHint: 'Adjust the volume to enable background video sound (muted autoplay is required by browsers)',
      uploadImage: 'Choose image',
      uploadVideo: 'Choose video',
      uploadBgm: 'Choose music',
      removeFile: 'Remove',
      customVideo: 'Custom video',
      customImage: 'Custom image',
      defaultBgm: 'Default music',
      customBgm: 'Custom music',
      bgm: 'Background music',
      bgmVolume: 'BGM volume',
      alertSound: 'Alert sound',
      alertVolume: 'Alert volume',
      alertDefault: 'Default',
      alertNailong: 'Nailong laugh',
      alertGugugaga: 'Gugu Gaga',
      alertCustom: 'Custom',
      uploadAlert: 'Choose audio',
      preview: 'Preview',
      uiOpacity: 'UI opacity',
      immersiveMode: 'Immersive',
      resetOpacity: 'Reset',
    },
    notifications: {
      workDoneTitle: 'Pomodoro completed!',
      longBreakBody: 'Great job! Take a long break.',
      shortBreakBody: 'Take a short break.',
      breakOverTitle: 'Break is over',
      breakOverBody: 'Ready to focus again?',
    },
    documentTitle: {
      paused: 'paused',
    },
    theme: {
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
    },
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
}
