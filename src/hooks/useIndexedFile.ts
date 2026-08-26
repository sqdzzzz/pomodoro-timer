import { useEffect, useState } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { getFile, type FileKey } from '@/utils/db'

/** objectURL 缓存：避免每次渲染都重新读取 IndexedDB 并创建新 URL */
const urlCache = new Map<string, string>()

export interface IndexedFileState {
  url: string | null
  hasFile: boolean
}

/**
 * 从 IndexedDB 读取自定义文件并生成 objectURL。
 * 依赖 store 的 filesVersion，上传/删除文件后调用 bumpFilesVersion() 即可刷新。
 */
export function useIndexedFile(key: FileKey | null): IndexedFileState {
  const filesVersion = usePomodoroStore((s) => s.filesVersion)
  const [state, setState] = useState<IndexedFileState>({ url: null, hasFile: false })

  useEffect(() => {
    let cancelled = false
    setState({ url: null, hasFile: false })

    if (!key) {
      return
    }

    const cached = urlCache.get(key)
    if (cached) {
      setState({ url: cached, hasFile: true })
      return
    }

    getFile(key)
      .then((blob) => {
        if (!blob) return
        const objectUrl = URL.createObjectURL(blob)
        urlCache.set(key, objectUrl)
        if (!cancelled) setState({ url: objectUrl, hasFile: true })
      })
      .catch(() => {
        if (!cancelled) setState({ url: null, hasFile: false })
      })

    return () => {
      cancelled = true
    }
  }, [key, filesVersion])

  return state
}
