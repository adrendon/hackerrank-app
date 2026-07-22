import { useState, useRef, useCallback, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'

type EditorTab = 'ts' | 'html'
type BottomTab = 'problems' | 'output' | 'terminal'

const TS_DEFAULT = `import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'flight-validation',
  templateUrl: './flightValidation.component.html',
  styleUrls: ['./flightValidation.component.scss'],
  standalone: false
})
export class FlightValidation {
  constructor() {
  }
}
`

const HTML_DEFAULT = `<div class="layout-column justify-contents-center align-items-center">
  <form class="layout-column" novalidate>
    <label>
      <input
        type="text"
        data-test-id="number-input"
        class="white large outlined"
        placeholder="Flight Number"
      />
      <div data-test-id="number-input-error" class="error-text">
      </div>
    </label>
    <label>
      <input
        type="text"
        data-test-id="source-input"
        formControlName="source"
        class="white large outlined"
        [class]="{'error': ''}"
        placeholder="Source"
      />
      <div class="error-text" data-test-id="source-input-error">
      </div>
    </label>
    <label>
      <input
        type="text"
        formControlName="destination"
        data-test-id="destination-input"
        class="white large outlined"
        [class]="{'error': ''}"
        placeholder="Destination"
      />
      <div data-test-id="destination-input-error" class="error-text">
      </div>
    </label>
    <button class="w-30 mt-20" type="submit" data-test-id="submit-button">
      Submit
    </button>
  </form>
</div>
`

const TS_SOLUTION = `import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'flight-validation',
  templateUrl: './flightValidation.component.html',
  styleUrls: ['./flightValidation.component.scss'],
  standalone: false
})
export class FlightValidation implements OnInit {
  flightForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.flightForm = this.fb.group({
      number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\\d{3}$/)
        ]
      ],
      source: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z]+$/)
        ]
      ],
      destination: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z]+$/)
        ]
      ]
    });
  }

  get numberError(): string {
    const ctrl = this.flightForm.get('number');
    if (ctrl?.touched) {
      if (ctrl.hasError('required')) return 'Flight Number is required';
      if (ctrl.hasError('pattern')) return 'Flight Number should be a 3 digit number';
    }
    return '';
  }

  get sourceError(): string {
    const ctrl = this.flightForm.get('source');
    if (ctrl?.touched) {
      if (ctrl.hasError('required')) return 'Source is required';
      if (ctrl.hasError('minlength')) return 'Source should contain a minimum of 3 characters';
      if (ctrl.hasError('pattern')) return 'Source should only contain letters';
    }
    return '';
  }

  get destinationError(): string {
    const ctrl = this.flightForm.get('destination');
    if (ctrl?.touched) {
      if (ctrl.hasError('required')) return 'Destination is required';
      if (ctrl.hasError('minlength')) return 'Destination should contain a minimum of 3 characters';
      if (ctrl.hasError('pattern')) return 'Destination should only contain letters';
    }
    return '';
  }

  get isFormValid(): boolean {
    return this.flightForm.valid
      && this.flightForm.get('number')!.touched
      && this.flightForm.get('source')!.touched
      && this.flightForm.get('destination')!.touched;
  }
}
`

const HTML_SOLUTION = `<div class="layout-column justify-contents-center align-items-center">
  <form class="layout-column" novalidate [formGroup]="flightForm">
    <label>
      <input
        type="text"
        formControlName="number"
        data-test-id="number-input"
        class="white large outlined"
        [class]="{'error': numberError}"
        placeholder="Flight Number"
      />
      <div data-test-id="number-input-error" class="error-text">
        {{ numberError }}
      </div>
    </label>
    <label>
      <input
        type="text"
        data-test-id="source-input"
        formControlName="source"
        class="white large outlined"
        [class]="{'error': sourceError}"
        placeholder="Source"
      />
      <div class="error-text" data-test-id="source-input-error">
        {{ sourceError }}
      </div>
    </label>
    <label>
      <input
        type="text"
        formControlName="destination"
        data-test-id="destination-input"
        class="white large outlined"
        [class]="{'error': destinationError}"
        placeholder="Destination"
      />
      <div data-test-id="destination-input-error" class="error-text">
        {{ destinationError }}
      </div>
    </label>
    <button class="w-30 mt-20" type="submit" data-test-id="submit-button"
      [disabled]="!isFormValid">
      Submit
    </button>
  </form>
</div>
`

function AnimatedPreview() {
  const [step, setStep] = useState(0)
  const [hidden, setHidden] = useState(false)
  const totalSteps = 12
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const durations = [1500, 1200, 1000, 800, 1200, 1000, 800, 1200, 1000, 1500, 2000, 1000]

  useEffect(() => {
    const scheduleNext = (currentStep: number) => {
      timerRef.current = setTimeout(() => {
        const next = (currentStep + 1) % totalSteps
        setStep(next)
        scheduleNext(next)
      }, durations[currentStep])
    }

    scheduleNext(step)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive state from step
  const numberValue = step >= 3 ? '123' : step >= 2 ? '12' : ''
  const numberFocused = step >= 1 && step < 3
  const numberTouched = step >= 1
  const numberError = numberTouched ? (numberValue === '' ? 'Flight Number is required' : (!/^\d{3}$/.test(numberValue) ? 'Flight Number should be a 3 digit number' : '')) : ''

  const sourceValue = step >= 6 ? 'NYC' : step >= 5 ? 'NY' : ''
  const sourceFocused = step >= 4 && step < 6
  const sourceTouched = step >= 4
  const sourceError = sourceTouched ? (sourceValue === '' ? 'Source is required' : (sourceValue.length < 3 ? 'Source should contain a minimum of 3 characters' : '')) : ''

  const destValue = step >= 9 ? 'SEA' : step >= 8 ? 'SE' : ''
  const destFocused = step >= 7 && step < 9
  const destTouched = step >= 7
  const destError = destTouched ? (destValue === '' ? 'Destination is required' : (destValue.length < 3 ? 'Destination should contain a minimum of 3 characters' : '')) : ''

  const isValid = !numberError && !sourceError && !destError && numberTouched && sourceTouched && destTouched
  const submitted = step === 10

  return (
    <div>
      <button className="hide-animation-btn" onClick={() => setHidden(!hidden)}>
        {hidden ? 'Show animation' : 'Hide animation'}
      </button>
      {!hidden && (
        <div className="preview-box">
      <div className="preview-header">
        <span className="preview-dot red"></span>
        <span className="preview-dot yellow"></span>
        <span className="preview-dot green"></span>
        <span className="preview-title">VALIDATION</span>
      </div>
      <div className="preview-body">
        <div className="anim-field">
          <input
            className={`preview-input ${numberFocused ? 'focused' : ''} ${numberError ? 'has-error' : ''}`}
            value={numberValue}
            placeholder="Flight Number"
            readOnly
          />
          {numberError && <div className="anim-error">{numberError}</div>}
        </div>
        <div className="anim-field">
          <input
            className={`preview-input ${sourceFocused ? 'focused' : ''} ${sourceError ? 'has-error' : ''}`}
            value={sourceValue}
            placeholder="Source"
            readOnly
          />
          {sourceError && <div className="anim-error">{sourceError}</div>}
        </div>
        <div className="anim-field">
          <input
            className={`preview-input ${destFocused ? 'focused' : ''} ${destError ? 'has-error' : ''}`}
            value={destValue}
            placeholder="Destination"
            readOnly
          />
          {destError && <div className="anim-error">{destError}</div>}
        </div>
        <button className={`preview-submit ${!isValid ? 'disabled' : ''} ${submitted ? 'submitted' : ''}`} disabled={!isValid}>
          Submit
        </button>
      </div>
    </div>
      )}
    </div>
  )
}

function Section1FlightValidation({ onSave }: { onSave?: () => void }) {
  const [activeTab, setActiveTab] = useState<EditorTab>('ts')
  const [bottomTab, setBottomTab] = useState<BottomTab>('problems')
  const [tsCode, setTsCode] = useState(TS_DEFAULT)
  const [htmlCode, setHtmlCode] = useState(HTML_DEFAULT)
  const [line, setLine] = useState(1)
  const [col, setCol] = useState(1)
  const [testOutput, setTestOutput] = useState('')
  const [problems, setProblems] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [bottomHeight, setBottomHeight] = useState(180)
  // Column widths as percentages
  const [col1Width, setCol1Width] = useState(30)
  const [col2Width, setCol2Width] = useState(70)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setLine(e.position.lineNumber)
      setCol(e.position.column)
    })
  }

  // Horizontal resize between col1 and col2
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
      const newW = Math.max(15, Math.min(50, startWidth + deltaPercent))
      setCol1Width(newW)
      if (!showPreview) {
        setCol2Width(100 - newW)
      } else {
        setCol2Width(Math.max(25, col2Width - deltaPercent + (startWidth - newW ? 0 : 0)))
      }
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
  }, [col1Width, col2Width, showPreview])

  // Horizontal resize between col2 and col3 (preview)
  const handleResizeCol2 = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = col2Width
    const container = containerRef.current
    if (!container) return

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const containerWidth = container.offsetWidth
      const deltaPercent = (dx / containerWidth) * 100
      const newW = Math.max(25, Math.min(70, startWidth + deltaPercent))
      setCol2Width(newW)
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
  }, [col2Width])

  // Vertical resize for bottom panel
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

  // When preview shows, adjust widths
  useEffect(() => {
    if (showPreview) {
      setCol1Width(25)
      setCol2Width(45)
    } else {
      setCol1Width(30)
      setCol2Width(70)
    }
  }, [showPreview])

  const handleRun = () => {
    setIsRunning(true)
    setTestOutput('Compiling...\n')
    setTimeout(() => {
      setShowPreview(true)
      setTestOutput('Build successful.')
      setIsRunning(false)
    }, 1500)
  }

  const handleRunTests = () => {
    setIsRunning(true)
    setBottomTab('output')
    setTestOutput('Running tests...\n')

    setTimeout(() => {
      const results: string[] = []
      let passed = 0
      let failed = 0

      const hasRequired = tsCode.includes('Validators.required')
      const hasPattern = tsCode.includes('Validators.pattern')
      const hasMinLength = tsCode.includes('Validators.minLength')
      const hasTouched = tsCode.includes('touched')
      const hasFormGroup = tsCode.includes('FormGroup')
      const hasFormBuilder = tsCode.includes('FormBuilder')
      const hasNumberInput = htmlCode.includes('data-test-id="number-input"')
      const hasSourceInput = htmlCode.includes('data-test-id="source-input"')
      const hasDestInput = htmlCode.includes('data-test-id="destination-input"')
      const hasSubmitBtn = htmlCode.includes('data-test-id="submit-button"')

      const tests = [
        { name: 'FlightValidation > Initial UI is rendered as expected', pass: hasFormGroup && hasFormBuilder && hasNumberInput && hasSourceInput && hasDestInput },
        { name: 'FlightValidation > Validation flight number required works', pass: hasRequired && hasTouched && tsCode.includes('Flight Number is required') },
        { name: 'FlightValidation > Validation flight number pattern works', pass: hasPattern && tsCode.includes('Flight Number should be a 3 digit number') },
        { name: 'FlightValidation > Validation source required works', pass: hasRequired && tsCode.includes('Source is required') },
        { name: 'FlightValidation > Validation source minlength works', pass: hasMinLength && tsCode.includes('Source should contain a minimum of 3 characters') },
        { name: 'FlightValidation > Validation source pattern works', pass: hasPattern && tsCode.includes('Source should only contain letters') },
        { name: 'FlightValidation > Validation destination required works', pass: hasRequired && tsCode.includes('Destination is required') },
        { name: 'FlightValidation > Validation destination minlength works', pass: hasMinLength && tsCode.includes('Destination should contain a minimum of 3 characters') },
        { name: 'FlightValidation > Validation destination pattern works', pass: hasPattern && tsCode.includes('Destination should only contain letters') },
        { name: 'FlightValidation > Submit button disabled initially', pass: hasSubmitBtn && (htmlCode.includes('[disabled]') || htmlCode.includes('disabled')) },
        { name: 'FlightValidation > Submit button enabled when valid', pass: tsCode.includes('isFormValid') && hasTouched },
      ]

      tests.forEach(t => {
        if (t.pass) { passed++; results.push(`  ✓ ${t.name}`) }
        else { failed++; results.push(`  ✗ ${t.name}`) }
      })

      const summary = `${tests.length} tests ran in 0.51s\n\n` +
        `${passed} passed` + (failed > 0 ? `  ${failed} failed` : '') +
        '\n\n' + results.join('\n')

      setTestOutput(summary)
      setProblems(failed > 0 ? [`${failed} test(s) failed`] : [])
      setIsRunning(false)
    }, 2000)
  }

  const previewWidth = showPreview ? (100 - col1Width - col2Width) : 0

  return (
    <div className="challenge-layout" ref={containerRef}>
      {/* Column 1 - Description */}
      <div className="challenge-col" style={{ width: `${col1Width}%` }}>
        <div className="question-panel">
          <div className="question-panel-content">
            <div className="question-left-header">
              <span className="question-left-icon">📋</span>
              <h2 className="question-left-title">Flight Validation</h2>
            </div>

            <p className="challenge-intro">Create a Flight Validation component as shown.</p>

            <AnimatedPreview />

            <p className="challenge-text">The component should perform the following validations in the form.</p>

            <div className="validation-rules">
              <p className="rule-header">• The flight number input field should pass the following validations. In case of an error, the appropriate message should be shown in <code>&lt;div data-test-id="number-input-error"&gt;&lt;/div&gt;</code>.</p>
              <ul className="rule-list">
                <li>The field is required.
                  <ul><li><strong>For this error, show the message 'Flight Number is required'.</strong></li></ul>
                </li>
                <li>The length should be 3 and should contain only number.
                  <ul><li><strong>For this error, show the message 'Flight Number should be a 3 digit number'.</strong></li></ul>
                </li>
              </ul>

              <p className="rule-header">• The source input field should pass the following validations. In case of error, the appropriate message should be shown in <code>&lt;div data-test-id="source-input-error"&gt;&lt;/div&gt;</code>.</p>
              <ul className="rule-list">
                <li>The field is required.
                  <ul><li><strong>For this error show the message 'Source is required'.</strong></li></ul>
                </li>
                <li>The minimum length is 3.
                  <ul><li><strong>For this error show the message 'Source should contain a minimum of 3 characters'.</strong></li></ul>
                </li>
                <li>The field should contain only letters.
                  <ul><li><strong>For this error show the message 'Source should only contain letters'.</strong></li></ul>
                </li>
              </ul>

              <p className="rule-header">• The destination input field should pass the following validations. In case of error, the appropriate message should be shown in <code>&lt;div data-test-id="destination-input-error"&gt;&lt;/div&gt;</code>.</p>
              <ul className="rule-list">
                <li>The field is required.
                  <ul><li><strong>For this error show the message 'Destination is required'.</strong></li></ul>
                </li>
                <li>The minimum length is 3.
                  <ul><li><strong>For this error show the message 'Destination should contain a minimum of 3 characters'.</strong></li></ul>
                </li>
                <li>The field should contain only letters.
                  <ul><li><strong>For this error show the message 'Destination should only contain letters'.</strong></li></ul>
                </li>
              </ul>

              <p className="rule-header">• Validations should trigger when the input is touched for the first time.</p>
              <p className="rule-header">• Initially, the submit button should be disabled. When any field is invalid, the submit button should be disabled.</p>
              <p className="rule-header">• When all fields are touched and valid, the submit button should be enabled.</p>

              <p className="rule-header" style={{ marginTop: 16 }}>The following <em>data-test-id</em> attributes are required in the component for the tests to pass:</p>
              <ul className="rule-list">
                <li>The flight number input: <code>'number-input'</code></li>
                <li>The source input: <code>'source-input'</code></li>
                <li>The destination input: <code>'destination-input'</code></li>
                <li>The submit button: <code>'submit-button'</code></li>
                <li>The div containing the error message for:
                  <ul>
                    <li>the number input: <code>'number-input-error'</code></li>
                    <li>the source input: <code>'source-input-error'</code></li>
                    <li>the destination input: <code>'destination-input-error'</code></li>
                  </ul>
                </li>
              </ul>

              <p className="note-text">Please note that the component has these data-test-id attributes for test cases and certain classes and IDs for rendering purposes. They should not be changed.</p>
            </div>

            {/* Show Solution */}
            <div className="answer-panel">
              <button className="answer-toggle" onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? '▾ Hide Solution' : '▸ Show Solution'}
              </button>
              {showSolution && (
                <div className="answer-content">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button className="solution-load-btn" onClick={() => { setTsCode(TS_SOLUTION); setHtmlCode(HTML_SOLUTION); }}>
                      📋 Load Solution into Editor
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>flightValidation.component.ts:</p>
                  <pre className="desc-code-block">{TS_SOLUTION}</pre>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>flightValidation.component.html:</p>
                  <pre className="desc-code-block">{HTML_SOLUTION}</pre>
                </div>
              )}
            </div>
          </div>
          <div className="question-panel-footer">
            <span>⊘ 0</span><span>⚠ 0</span>
          </div>
        </div>
      </div>

      {/* Resize handle 1 */}
      <div className="resize-handle-h" onMouseDown={handleResizeCol1}></div>

      {/* Column 2 - Editor */}
      <div className="challenge-col" style={{ width: `${col2Width}%` }}>
        <div className="ide-panel">
          {/* Toolbar */}
          <div className="ide-toolbar">
            <div className="ide-toolbar-left"></div>
            <div className="ide-toolbar-right">
              <button className="ide-run-btn" onClick={handleRun} disabled={isRunning}>
                <span className="run-icon">▶</span> Run <span className="run-chevron">⌄</span>
              </button>
              <button className="ide-run-tests-btn" onClick={handleRunTests} disabled={isRunning}>
                Run Tests
              </button>
              <div className="ide-toolbar-icons">
                <span>⧉</span><span>□</span><span>⚙</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="editor-tabs">
            <button className={`editor-tab ${activeTab === 'ts' ? 'active' : ''}`} onClick={() => setActiveTab('ts')}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#1976d2"/><text x="7" y="16" fontSize="9" fill="white" fontWeight="bold">TS</text></svg>
              flightValidation.component.ts
              <span className="tab-modified">M</span>
            </button>
            <button className={`editor-tab ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#dd0031"/><text x="5" y="16" fontSize="7" fill="white" fontWeight="bold">NG</text></svg>
              flightValidation.component.html
              <span className="tab-modified">M</span>
            </button>
          </div>

          {/* Editor */}
          <div className="ide-editor-area">
            <Editor
              height="100%"
              language={activeTab === 'ts' ? 'typescript' : 'html'}
              theme="vs-dark"
              value={activeTab === 'ts' ? tsCode : htmlCode}
              onChange={(value) => activeTab === 'ts' ? setTsCode(value || '') : setHtmlCode(value || '')}
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

          {/* Bottom panel */}
          <div className="ide-bottom-panel" style={{ height: bottomHeight }}>
            <div className="ide-bottom-resize" onMouseDown={handleResizeBottom}></div>
            <div className="ide-bottom-tabs">
              <button className={`ide-bottom-tab ${bottomTab === 'problems' ? 'active' : ''}`} onClick={() => setBottomTab('problems')}>
                Problems {problems.length > 0 && <span className="problem-badge">{problems.length}</span>}
              </button>
              <button className={`ide-bottom-tab ${bottomTab === 'output' ? 'active' : ''}`} onClick={() => setBottomTab('output')}>Output</button>
              <button className={`ide-bottom-tab ${bottomTab === 'terminal' ? 'active' : ''}`} onClick={() => setBottomTab('terminal')}>Terminal</button>
            </div>
            <div className="ide-bottom-content">
              {bottomTab === 'problems' && (
                <div className="ide-terminal-output">
                  {problems.length === 0 ? <span className="terminal-dim">No problems detected.</span> : problems.map((p, i) => <div key={i} className="terminal-error">{p}</div>)}
                </div>
              )}
              {bottomTab === 'output' && <div className="ide-terminal-output"><pre>{testOutput || 'Click "Run Tests" to execute.'}</pre></div>}
              {bottomTab === 'terminal' && <div className="ide-terminal-output"><pre>❯ bun{'\n'}$ ng serve{'\n'}Building...</pre></div>}
            </div>
          </div>

          {/* Status bar */}
          <div className="ide-status-bar">
            <div className="status-left"><span>◇ Not Committed Yet</span></div>
            <div className="status-right">
              <span>Ln {line}, Col {col}</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span>{activeTab === 'ts' ? '{ } TypeScript' : '( ) HTML'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resize handle 2 + Column 3 - Preview (only when Run is clicked) */}
      {showPreview && (
        <>
          <div className="resize-handle-h" onMouseDown={handleResizeCol2}></div>
          <div className="challenge-col" style={{ width: `${previewWidth}%` }}>
            <div className="preview-column">
              <div className="preview-column-header">
                <span>Preview</span>
                <span className="preview-close" onClick={() => setShowPreview(false)}>×</span>
              </div>
              <LivePreview tsCode={tsCode} htmlCode={htmlCode} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Live Preview component
function LivePreview({ tsCode, htmlCode }: { tsCode: string; htmlCode: string }) {
  const [form, setForm] = useState({ number: '', source: '', destination: '' })
  const [touched, setTouched] = useState({ number: false, source: false, destination: false })

  const hasRequired = tsCode.includes('Validators.required')
  const hasPattern3Digits = tsCode.includes('pattern') && tsCode.includes('\\d{3}')
  const hasMinLength3 = tsCode.includes('minLength(3)')
  const hasLettersOnly = tsCode.includes('[a-zA-Z]')

  const getNumberError = () => {
    if (!touched.number) return ''
    if (hasRequired && !form.number) return 'Flight Number is required'
    if (hasPattern3Digits && !/^\d{3}$/.test(form.number)) return 'Flight Number should be a 3 digit number'
    return ''
  }

  const getSourceError = () => {
    if (!touched.source) return ''
    if (hasRequired && !form.source) return 'Source is required'
    if (hasMinLength3 && form.source.length < 3) return 'Source should contain a minimum of 3 characters'
    if (hasLettersOnly && form.source && !/^[a-zA-Z]+$/.test(form.source)) return 'Source should only contain letters'
    return ''
  }

  const getDestError = () => {
    if (!touched.destination) return ''
    if (hasRequired && !form.destination) return 'Destination is required'
    if (hasMinLength3 && form.destination.length < 3) return 'Destination should contain a minimum of 3 characters'
    if (hasLettersOnly && form.destination && !/^[a-zA-Z]+$/.test(form.destination)) return 'Destination should only contain letters'
    return ''
  }

  const isValid = touched.number && touched.source && touched.destination
    && !getNumberError() && !getSourceError() && !getDestError()

  return (
    <div className="live-preview">
      <div className="live-preview-browser">
        <div className="live-preview-url">
          <span className="url-arrows">← →</span>
          <span className="url-reload">↻</span>
          <span className="url-bar">https://vm-3c74bcdc-59ea-...</span>
        </div>
      </div>
      <div className="live-preview-content">
        <div className="live-form">
          <input
            className={`live-input ${touched.number && getNumberError() ? 'error' : ''}`}
            placeholder="Flight Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            onBlur={() => setTouched({ ...touched, number: true })}
          />
          {getNumberError() && <div className="live-error">{getNumberError()}</div>}
          <input
            className={`live-input ${touched.source && getSourceError() ? 'error' : ''}`}
            placeholder="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            onBlur={() => setTouched({ ...touched, source: true })}
          />
          {getSourceError() && <div className="live-error">{getSourceError()}</div>}
          <input
            className={`live-input ${touched.destination && getDestError() ? 'error' : ''}`}
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            onBlur={() => setTouched({ ...touched, destination: true })}
          />
          {getDestError() && <div className="live-error">{getDestError()}</div>}
          <button className="live-submit" disabled={!isValid}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Section1FlightValidation
