'use client'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const TEMPLATES: Record<string, Record<string, string>> = {
  python: {
    default: `# Python Solution
import sys
input = sys.stdin.readline

def solve():
    # Your code here
    pass

solve()
`,
    hello: `print("Hello, World!")
`,
    sum: `a, b = map(int, input().split())
print(a + b)
`,
  },
  cpp: {
    default: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}
`,
    hello: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
    sum: `#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
`,
  },
}

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  height?: string
}

export default function CodeEditor({ language, value, onChange, height = '100%' }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleMount = useCallback((editor: any) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  return (
    <MonacoEditor
      height={height}
      language={language === 'cpp' ? 'cpp' : 'python'}
      theme="vs-dark"
      value={value}
      onChange={v => onChange(v || '')}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        bracketPairColorization: { enabled: true },
        suggest: { showKeywords: true },
        quickSuggestions: true,
        formatOnPaste: true,
        formatOnType: false,
      }}
    />
  )
}

export { TEMPLATES }
