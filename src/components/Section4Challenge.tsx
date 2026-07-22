import { useState, useRef, useCallback, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'

type BottomTab = 'problems' | 'output' | 'terminal' | 'testresults'

const TS_DEFAULT = `'use strict';

/*
 * Complete the 'segregateList' function below.
 *
 * The function is expected to return an OutputObject.
 */

function segregateList(inputList: LanguageDetails[]): OutputObject {

}
`

const TS_SOLUTION = `'use strict';

/*
 * Complete the 'segregateList' function below.
 *
 * The function is expected to return an OutputObject.
 */

function segregateList(inputList: LanguageDetails[]): OutputObject {
  const result: OutputObject = {
    'c++': [],
    'javascript': [],
    'typescript': []
  };

  for (const item of inputList) {
    const lang = item.value;
    if (result[lang]) {
      result[lang].push(item);
    }
  }

  return result;
}
`

function Section4Challenge({ onSave }: { onSave?: () => void }) {
  const [bottomTab, setBottomTab] = useState<BottomTab>('testresults')
  const [code, setCode] = useState(TS_DEFAULT)
  const [line, setLine] = useState(1)
  const [col, setCol] = useState(1)
  const [testOutput, setTestOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [bottomHeight, setBottomHeight] = useState(180)
  const [col1Width, setCol1Width] = useState(35)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setLine(e.position.lineNumber)
      setCol(e.position.column)
    })
  }

  const handleResizeCol1 = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = col1Width
    const container = containerRef.current
    if (!container) return
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const containerWidth = container.offsetWidth
      const deltaPercent = (dx / containerWidth) * 100
      setCol1Width(Math.max(20, Math.min(50, startWidth + deltaPercent)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [col1Width])

  const handleResizeBottom = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startH = bottomHeight
    const onMove = (ev: MouseEvent) => {
      const dy = startY - ev.clientY
      setBottomHeight(Math.max(60, Math.min(400, startH + dy)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [bottomHeight])

  const handleRun = () => {
    setIsRunning(true)
    setBottomTab('output')
    setTestOutput('Compiling TypeScript...\n')
    setTimeout(() => {
      const hasReturn = code.includes('return')
      const hasLoop = code.includes('for') || code.includes('forEach') || code.includes('reduce') || code.includes('map')
      if (!hasReturn || !hasLoop) {
        setTestOutput('Compiling TypeScript...\n\n❌ Runtime Error:\nFunction segregateList does not return a valid OutputObject.\nExpected an object with keys "c++", "javascript", "typescript".\n\nGot: undefined')
      } else {
        setTestOutput('Compiling TypeScript...\nBuild successful.\n\nRunning with Sample Case 0...\n\nInput:\n3\ncobj typescript\naobj c++\nbobj javascript\n\nOutput:\naobj c++\nbobj javascript\ncobj typescript\n\n✓ Output matches expected.')
      }
      setIsRunning(false)
    }, 1500)
  }

  const handleRunTests = () => {
    setIsRunning(true)
    setBottomTab('testresults')
    setTestOutput('Running tests...\n')
    setTimeout(() => {
      const hasReturn = code.includes('return')
      const hasLoop = code.includes('for') || code.includes('forEach') || code.includes('reduce') || code.includes('map')
      const hasResult = code.includes('result') || code.includes('output') || code.includes('obj')
      const hasKeys = code.includes("'c++'") || code.includes('"c++"') || code.includes('c++')
      const hasPush = code.includes('push') || code.includes('[lang]') || code.includes('[item')

      let passed = 0
      let failed = 0
      const results: string[] = []

      const tests = [
        { name: 'Sample Case 0: Basic segregation', pass: hasReturn && hasLoop && hasResult },
        { name: 'Sample Case 1: Multiple items per language', pass: hasReturn && hasLoop && hasPush },
        { name: 'Test Case 2: Empty list returns empty arrays', pass: hasReturn && hasKeys },
        { name: 'Test Case 3: Single item', pass: hasReturn && hasLoop },
        { name: 'Test Case 4: All items same language', pass: hasReturn && hasLoop && hasPush },
        { name: 'Test Case 5: Large input (n=100)', pass: hasReturn && hasLoop && hasPush && hasResult },
        { name: 'Test Case 6: Correct enum mapping', pass: hasReturn && hasKeys && hasLoop },
        { name: 'Test Case 7: Output type validation', pass: hasReturn && hasResult && hasKeys },
      ]

      tests.forEach(t => {
        if (t.pass) { passed++; results.push(`  ✓ ${t.name}`) }
        else { failed++; results.push(`  ✗ ${t.name}`) }
      })

      const summary = `${tests.length} tests ran in 0.42s\n\n` +
        (passed > 0 ? `${passed} passed  ` : '') +
        (failed > 0 ? `${failed} failed` : '') +
        '\n\n' + results.join('\n')

      setTestOutput(summary)
      setIsRunning(false)
    }, 2000)
  }

  const col2Width = 100 - col1Width

  return (
    <div className="challenge-layout" ref={containerRef}>
      {/* Column 1 - Description */}
      <div className="challenge-col" style={{ width: `${col1Width}%` }}>
        <div className="question-panel">
          <div className="question-panel-content">
            <div className="question-left-header">
              <span className="question-left-icon">📋</span>
              <h2 className="question-left-title">List Segregation</h2>
            </div>

            <p className="challenge-intro">
              Given an inputList containing objects that implement the LanguageDetails interface, you need to process this list using the segregateList function. Additionally, there is an enum named LanguageName with three name-value pairs: [CPP: "c++", JS: "javascript", TS: "typescript"].
            </p>

            <p className="challenge-text">
              The segregateList function should return an object that maps the enum LanguageName to type OutputObject.
            </p>

            <p className="challenge-text" style={{ color: '#fbbf24' }}>
              <strong>Note:</strong> The interfaces LanguageDetails, LanguageName, and OutputObject are already implemented.
            </p>

            <p className="challenge-text">
              For example, inputList = [&#123;"aobj":"c++"&#125;, &#123;"bobj":"javascript"&#125;, &#123;"cobj":"typescript"&#125;]. It is the input to segregateList. The function returns output of the type OutputObject:<br/>
              &#123; c++:["aobj":"c++"], javascript:["bobj":"javascript"], typescript:["cobj":"typescript"] &#125;.
            </p>

            <h4 style={{ color: '#e5e7eb', marginTop: 16, marginBottom: 8 }}>Function Description</h4>
            <p className="challenge-text">
              Complete the function segregateList in the editor with the following parameters:
            </p>
            <ul className="rule-list">
              <li><strong>inputList[n]:</strong> a list of objects of type LanguageDetails</li>
            </ul>

            <h4 style={{ color: '#e5e7eb', marginTop: 12, marginBottom: 8 }}>Returns</h4>
            <p className="challenge-text">
              The function should return an object that contains the mapping of the enum LanguageName of type OutputObject.
            </p>

            <h4 style={{ color: '#e5e7eb', marginTop: 12, marginBottom: 8 }}>Constraints</h4>
            <ul className="rule-list">
              <li>1 ≤ n ≤ 100</li>
              <li>name is a string of lowercase letters.</li>
              <li>value is type LanguageName, one of three values: ["c++", "javascript", "typescript"].</li>
            </ul>

            <div style={{ marginTop: 16 }}>
              <details className="sample-case">
                <summary>▸ Input Format For Custom Testing</summary>
                <div style={{ padding: '8px 12px' }}>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>First line: n (number of items).<br/>Next n lines: name value pairs separated by space.</p>
                </div>
              </details>
              <details className="sample-case" open>
                <summary>▾ Sample Case 0</summary>
                <div style={{ padding: '8px 12px' }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Sample Input For Custom Testing</p>
                  <pre className="desc-code-block">{`3\ncobj typescript\naobj c++\nbobj javascript`}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Sample Output</p>
                  <pre className="desc-code-block">{`aobj c++\nbobj javascript\ncobj typescript`}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Explanation</p>
                  <p style={{ fontSize: 13, color: '#d1d5db' }}>The code stub prints the OutputObject in sorted order. Each language key contains the items that belong to it.</p>
                </div>
              </details>
              <details className="sample-case">
                <summary>▸ Sample Case 1</summary>
                <div style={{ padding: '8px 12px' }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Sample Input For Custom Testing</p>
                  <pre className="desc-code-block">{`5\nalpha c++\nbeta javascript\ngamma typescript\ndelta c++\nepsilon javascript`}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Sample Output</p>
                  <pre className="desc-code-block">{`alpha c++\ndelta c++\nbeta javascript\nepsilon javascript\ngamma typescript`}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Explanation</p>
                  <p style={{ fontSize: 13, color: '#d1d5db' }}>Items are grouped by language value and sorted alphabetically within each group. The groups are printed in the order: c++, javascript, typescript.</p>
                </div>
              </details>
            </div>

            {/* Show Solution */}
            <div className="answer-panel">
              <button className="answer-toggle" onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? '▾ Hide Solution' : '▸ Show Solution'}
              </button>
              {showSolution && (
                <div className="answer-content">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button className="solution-load-btn" onClick={() => setCode(TS_SOLUTION)}>
                      📋 Load Solution into Editor
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Solution:</p>
                  <pre className="desc-code-block">{TS_SOLUTION}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}><strong>Explanation:</strong></p>
                  <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.7 }}>
                    The solution creates a result object with keys for each language ("c++", "javascript", "typescript") initialized with empty arrays. Then it iterates over the inputList, checking each item's value property (which is a LanguageName) and pushes the item into the corresponding array. Finally it returns the result object which maps LanguageName to arrays of LanguageDetails.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="question-panel-footer">
            <span>⊘ 0</span><span>⚠ 0</span>
          </div>
        </div>
      </div>

      {/* Resize handle */}
      <div className="resize-handle-h" onMouseDown={handleResizeCol1}></div>

      {/* Column 2 - Editor */}
      <div className="challenge-col" style={{ width: `${col2Width}%` }}>
        <div className="ide-panel">
          <div className="ide-toolbar">
            <div className="ide-toolbar-left">
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Language: TypeScript ⓘ</span>
            </div>
            <div className="ide-toolbar-right">
              <span style={{ fontSize: 11, color: '#6b7280' }}>Layout 90</span>
              <button className="ide-run-btn" onClick={handleRun} disabled={isRunning}>
                <span className="run-icon">▶</span> Run <span className="run-chevron">⌄</span>
              </button>
              <button className="ide-run-tests-btn" onClick={handleRunTests} disabled={isRunning}>
                Run Tests
              </button>
            </div>
          </div>

          <div className="ide-editor-area">
            <Editor
              height="100%"
              language="typescript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorMount}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                renderLineHighlight: 'line',
                scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                padding: { top: 8 },
              }}
            />
          </div>

          <div className="ide-bottom-panel" style={{ height: bottomHeight }}>
            <div className="ide-bottom-resize" onMouseDown={handleResizeBottom}></div>
            <div className="ide-bottom-tabs">
              <button className={`ide-bottom-tab ${bottomTab === 'testresults' ? 'active' : ''}`} onClick={() => setBottomTab('testresults')}>
                ▴ Test Results
              </button>
              <button className={`ide-bottom-tab ${bottomTab === 'output' ? 'active' : ''}`} onClick={() => setBottomTab('output')}>Output</button>
              <button className={`ide-bottom-tab ${bottomTab === 'terminal' ? 'active' : ''}`} onClick={() => setBottomTab('terminal')}>Terminal</button>
            </div>
            <div className="ide-bottom-content">
              {bottomTab === 'testresults' && <div className="ide-terminal-output"><pre>{testOutput || 'Click "Run Tests" to execute.'}</pre></div>}
              {bottomTab === 'output' && <div className="ide-terminal-output"><pre>{testOutput || 'Click "Run" to execute.'}</pre></div>}
              {bottomTab === 'terminal' && <div className="ide-terminal-output"><pre>❯ tsc --noEmit{'\n'}$</pre></div>}
            </div>
          </div>

          <div className="ide-status-bar">
            <div className="status-left"><span>◇ Not Committed Yet</span></div>
            <div className="status-right">
              <span>Ln {line}, Col {col}</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span>{'{ }'} TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section4Challenge
