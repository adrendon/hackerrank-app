import { useState, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Section1FlightValidation from './components/Section1FlightValidation'
import QuestionSection from './components/QuestionSection'
import Section4Challenge from './components/Section4Challenge'
import TimeUpModal from './components/TimeUpModal'
import ResultsScreen from './components/ResultsScreen'
import { saveAssessment, loadAssessment } from './utils/storage'

export interface QuestionData {
  id: number
  text: string
  description?: string
  image?: string
  imagePosition?: 'after-description' | 'after-question'
  additionalText?: string
  finalQuestion?: string
  instruction: string
  options: string[]
  type: 'single' | 'multiple'
  correctAnswers?: number[]
  explanation?: string
}

// S2 questions (2, 3, 4)
const s2Questions: QuestionData[] = [
  {
    id: 2,
    text: 'AWS Serverless Application',
    description: 'A mobile game has a serverless backend in AWS which is composed of AWS Lambda, Amazon API Gateway, and Amazon DynamoDB. It writes 100 items per second to the AmazonDynamoDB table and the size is 1.5 KB per item. The table has a provisioned AWS WAF web ACL capacity units (WCUs) of 100, but the write requests are still being throttled by Amazon DynamoDB.',
    finalQuestion: 'What is the MOST suitable solution to address this throttling issue?',
    image: '/images/aws-serverless.svg',
    imagePosition: 'after-question' as const,
    instruction: 'Pick ONE option',
    options: [
      'Enable Amazon DynamoDB Accelerator (DAX).',
      'Implement database caching with an Amazon ElastiCache cluster.',
      'Use strong consistency in the write operations.',
      'Increase the AWS WAF web ACL capacity units (WCUs) to 200',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'DAX (DynamoDB Accelerator) is an in-memory cache for DynamoDB that reduces response times from milliseconds to microseconds. It helps handle throttling by reducing the number of read/write requests that hit the table directly. The WCU issue is about Write Capacity Units (not WAF ACL), so increasing WAF WCUs is irrelevant. ElastiCache helps with reads but not writes. Strong consistency increases load, not reduces it.',
  },
  {
    id: 3,
    text: 'AWS Web App: Load Balancing and Traffic Management',
    description: 'This is an architectural diagram of a simple web application. The whole service is hosted in a single AWS region (us-east-2).',
    image: '/images/aws-load-balancing.svg',
    additionalText: 'There are two Availability Zones(AZs), with 2 targets in AZ A and 3 targets in AZ B.\nClients send requests and Amazon Route 53 responds to each request with the IP address of one of the load balancer nodes.\nRoute 53 has been configured in a way that each load balancer node receives an equal share of the traffic from the clients.\nAnswer the question below.',
    finalQuestion: 'As cross-zone load balancing is disabled, how much traffic will each of the 5 targets receive?',
    instruction: 'Pick ONE option',
    options: [
      'Each of the 2 targets in AZ A receives 25% of the traffic and each of the 3 targets in AZ B receives 16.67% of the traffic',
      'Each of the 2 targets in AZ A receives 12.5% of the traffic and each of the 3 targets in AZ B receives 25% of the traffic',
      'Each of the 2 targets in AZ A receives 50% of the traffic and each of the 3 targets in AZ B receives 50% of the traffic',
      'None of these',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'With cross-zone load balancing disabled, each load balancer node distributes traffic only to targets in its own AZ. Since Route 53 splits traffic 50/50 between the two AZs, AZ A gets 50% split among 2 targets (25% each) and AZ B gets 50% split among 3 targets (16.67% each).',
  },
  {
    id: 4,
    text: 'AWS EC2 - Remove a Load Balancer',
    description: 'This is an architectural diagram of a simple content management deployment infrastructure. The whole service is hosted in the Amazon cloud.',
    image: '/images/aws-load-balancer.svg',
    additionalText: 'The application is a content management platform that consists of components like image, script, and application services. The services are deployed on different Amazon EC2 instances and managed by an auto-scaling group. The load balancer routes user requests based on the request path to a specified instance.',
    finalQuestion: 'What happens if the load balancer is removed?',
    instruction: 'Pick ONE option',
    options: [
      'Auto-scaling will continue to work.',
      'The auto-scaling process will stop.',
      'The auto-scaling process will relaunch the load balancer.',
      'Auto-scaling will stop all the instances.',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'Auto-scaling is independent of the load balancer. If the load balancer is removed, auto-scaling will continue to work based on the scaling policies configured. The instances will still run and scale, but users won\'t be able to reach them through the load balancer endpoint.',
  },
]

// S3 questions (5, 6, 7, 8, 9)
const s3Questions: QuestionData[] = [
  {
    id: 5,
    text: 'DOM',
    description: 'Which of the following statements are true about the DOM (Document Object Model)?',
    instruction: 'Pick ONE or MORE options',
    options: [
      'The DOM represents a document as a tree-like structure.',
      'The DOM represents a document as a sequential structure.',
      'The DOM can be manipulated only using JavaScript.',
      'Interaction with DOM elements is through event handlers.',
    ],
    type: 'multiple',
    correctAnswers: [0, 3],
    explanation: 'The DOM represents a document as a tree structure (nodes with parent-child relationships). It can be manipulated with any language that supports DOM APIs (not just JavaScript - e.g., Python, Java). Interaction with DOM elements is through event handlers (click, hover, etc.).',
  },
  {
    id: 6,
    text: 'Image Lists',
    description: 'A description list is given below. Every image used in the list has a width of 80px and a height of 80px. Create this list. Choose all that apply.',
    image: '/images/image-lists.svg',
    instruction: 'Pick ONE or MORE options',
    options: [
      '<dl> <dd>Fruits</dd> <dt><img src="Apple.jpg" ><br/>Apple</dt> <dt><img src="Mango.jpg" ><br/>Mango</dt> <dt> <img src="Guvava.jpg" ><br/> Guvava</dt><br/> <dd>Vegetables</dd> <dt><img src="Cabbage.jpg" ><br/> Cabbage</dt> <dt><img src="Carrot.jpg" ><br/>Carrot</dt> </dl>',
      '<dt>Fruits</dt> <dd ><img src="Apple.jpg" ><br/>Apple</dd> <dd><img src="Mango.jpg" ><br/>Mango</dd> <dd> <img src="Guvava.jpg" ><br/> Guvava</dd><br/> <dt>Vegetables</dt> <dd><img src="Cabbage.jpg" >Cabbage</dd> <dd><img src="Carrot.jpg" >Carrot</dd>',
      '<dl> <dd>Fruits</dd> <dd ><img src="Apple.jpg" ><br/>Apple</dd> <dd><img src="Mango.jpg" ><br/>Mango</dd> <dd> <img src="Guvava.jpg" ><br/> Guvava</dd><br/> <dd>Vegetables</dd> <dd><img src="Cabbage.jpg" ><br/> Cabbage</dd> <dd><img src="Carrot.jpg" ><br/>Carrot</dd> </dl>',
      '<dl> <dt>Fruits</dt> <dd ><img src="Apple.jpg" ><br/>Apple</dd> <dd><img src="Mango.jpg" ><br/>Mango</dd> <dd><img src="Guvava.jpg" ><br/> Guvava</dd><br/> <dt>Vegetables</dt> <dd><img src="Cabbage.jpg" ><br/> Cabbage</dd> <dd><img src="Carrot.jpg" ><br/>Carrot</dd> </dl>',
      '<dl> <dt>Fruits</dt> <dd ><img src="Apple.jpg" ><br/>Apple</dd> <dd><img src="Mango.jpg" ><br/></dd> <dd><img src="Guvava.jpg" ><br/> Guvava</dd><br/> <dt>Vegetables</dt> <dd><img src="Cabbage.jpg" ><br/> Cabbage</dd> <dd><img src="Carrot.jpg" ><br/></dd> </dl>',
    ],
    type: 'multiple',
    correctAnswers: [3],
    explanation: 'In HTML description lists (<dl>), <dt> defines the term and <dd> defines the description. The correct structure uses <dt>Fruits</dt> followed by <dd> items with images. Option 4 is the only one with correct <dl><dt><dd> structure.',
  },
  {
    id: 7,
    text: 'Output Prediction',
    description: 'Predict the output of the code snippet below:\n\n<!DOCTYPE html> <html> <body>\n<p>Tim_Berners-Lee initiated <abbr title="Hyper Text Mark Up Language">HTML</abbr> <p>\n<bdo dir="rtl">Learning HTML5 is fun</bdo>\n</body>\n</html>',
    instruction: 'Pick ONE option',
    options: [
      'Tim_Berners-Lee initiated HTML\nfun is HTML5 Learning',
      'Tim_Berners-Lee initiated HTML\ngninraeL 5LMTH si nuf',
      'Tim_Berners-Lee initiated HTML\nnuf si 5LMTH gninraeL',
      'Tim_Berners-Lee initiated Hyper Text Mark Up Language\nLearning HTML5 is fun',
      'Tim_Berners-Lee initiated Hyper Text Mark Up Language\nnuf si 5LMTH gninraeL',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'The <abbr> tag shows only its content text (HTML), not the title attribute. The <bdo dir="rtl"> reverses the text direction, making "Learning HTML5 is fun" display as "nuf si 5LMTH gninraeL". Wait - actually the output shows the abbreviated text "HTML" (not the full title) and the reversed text. So the answer is "Tim_Berners-Lee initiated HTML\\nfun is HTML5 Learning".',
  },
  {
    id: 8,
    text: 'Link Opening',
    description: 'How would you open a link "click me" in an inline frame? Choose all that apply.',
    instruction: 'Pick ONE or MORE options',
    options: [
      '<iframe width="200%" height="200%" name="inline"></iframe> <a href="http://www.html5.com" target="iframe">click me</a>',
      '<iframe width="200%" height="200%"></iframe> <a href="http://www.html5.com" target="_blank">click me</a>',
      '<iframe width="200%" height="200%" name="inline"></iframe> <a href="http://www.html5.com" target="inline">click me</a>',
      '<iframe width="200%" height="200%" ></iframe> <a src="http://www.html5.com" target="inline">click me</a>',
      '<iframe width="200%" height="200%" name="INLINE"></iframe> <a src="http://www.html5.com" target="INLINE">click me</a>',
      '<iframe width="200%" height="200%" name="INLINE"></iframe> <a HREF="http://www.html5.com" target="INLINE">click me</a>',
      '<iframe width="200%" height="200%" name="INLINE"></iframe> <A HREF="http://www.html5.com" target="INLINE">click me</A>',
      '<iframe width="200%" height="200%" name="inline"></iframe> <a href="http://www.html5.com">click me</a>',
    ],
    type: 'multiple',
    correctAnswers: [2, 5, 6],
    explanation: 'To open a link in an iframe, the target attribute of the <a> tag must match the name attribute of the iframe. The href attribute (not src) is used for links. HTML is case-insensitive for attributes, so HREF and href both work. Options 3, 6, and 7 correctly match the iframe name with the target.',
  },
  {
    id: 9,
    text: 'Mailto',
    description: 'Which of the following snippets is/are valid mailto links in HTML5? Choose all that apply.',
    instruction: 'Pick ONE or MORE options',
    options: [
      '<a href="mailTo:candidate@hackerrank.com?subject=Test&cc=admin@hackerrank.com">',
      '<a href="mail:candidate@hackerrank.com?subject=Test&cc=admin@hackerrank.com">',
      '<a href="mailto:candidate@hackerrank.com?subject=Test&cc=admin@hackerrank.com">',
      '<a link="mailTo:candidate@hackerrank.com?subject=Test&cc=admin@hackerrank.com">',
    ],
    type: 'multiple',
    correctAnswers: [0, 2],
    explanation: 'Valid mailto links use href attribute with "mailto:" protocol. "mailTo:" is also valid since URLs are case-insensitive for the scheme. "mail:" is not a valid protocol. "link" is not a valid attribute for <a> tags (should be href).',
  },
]

// S5 questions (11, 12, 13)
const s5Questions: QuestionData[] = [
  {
    id: 11,
    text: 'RxJS Operator Marble Diagrams',
    description: 'An e-commerce website is under development where users can search for products and filter their search results based on certain criteria. The UI consists of a search bar for entering search terms, a drop-down menu for selecting categories, and a sorting option. The task is to create an observable that emits search results whenever the search term, category, or sorting option changes.\n\nMarble diagrams are visual representations of observable streams over time, where each colored circle represents an emitted value, and the arrows between them represent the passage of time. Refer to the marble diagrams below that represent the observables for each of these user inputs.',
    image: '/images/rxjs-marble.svg',
    additionalText: 'Given the marble diagrams for the search term, category, and sorting observables, the task is to create a reactive stream that meets the following requirements:\n\n1. Combine the values of the search term, category, and sorting observables into a single observable stream whenever any of the inputs change.\n2. Use the latest emitted value from each input stream to create an object with properties searchTerm, category, and sorting.\n3. Debounce the combined observable stream to emit values only if there is a pause of at least 300ms between input changes.\n4. Handle a scenario where the search term stream emits an error value, and in that case, emit a default object with searchTerm set to an empty string, category, and sorting set to the latest emitted values from their respective streams.\n5. Retry the search term stream up to 3 times when an error occurs before emitting the default object.',
    finalQuestion: 'Which RxJS operator or combination of operators should be used to create the desired observable stream?\n\nNote: The marble diagrams represent the timing of the emissions for each input stream. Based on the timing, select the operator(s) that will produce the desired output.',
    instruction: 'Pick ONE option',
    options: [
      'catchError, retry, debounceTime, and combineLatest',
      'catchError, retryWhen, debounceTime, and withLatestFrom',
      'catchError, retry, debounceTime, and withLatestFrom',
      'catchError, retryWhen, debounceTime, and combineLatest',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'combineLatest emits when any source observable emits, using the latest values from all sources. catchError handles errors, retry retries up to N times, and debounceTime waits for a pause. The combination catchError + retry + debounceTime + combineLatest meets all 5 requirements.',
  },
  {
    id: 12,
    text: 'Cache Reused Components',
    description: 'In your Angular app, you want to cache reused components with the help of RouteReuseStrategy, a new event rolled out in Angular 13. Here is sample code.\n```\nimport { Injectable } from \'@angular/core\';\nimport {\n  ActivatedRouteSnapshot,\n  DetachedRouteHandle,\n  Route,\n  RouteReuseStrategy,\n} from \'@angular/router\';\n\n@Injectable()\nexport class CustomReuseStrategy extends RouteReuseStrategy {\n  private pool = new WeakMap<Route, DetachedRouteHandle>();\n\n  public shouldAttach(route: ActivatedRouteSnapshot): boolean {\n    return !!this.pool.get(route.routeConfig);\n  }\n}\n```\nThe following is written in the App component for Angular Routing to respective components:\n```\n<a routerLink=""/a"">navigate to /a</a> <br />\n<router-outlet\n  (______)=""($event)""\n  <— the new event\n></router-outlet>\n```',
    finalQuestion: 'Which option should fill the blank?',
    instruction: 'Pick ONE option',
    options: [
      'attach',
      'detach',
      'activate',
      'deactivate',
    ],
    type: 'single',
    correctAnswers: [2],
    explanation: 'The new event in Angular 13 for router-outlet is "activate". It fires when a component is activated (attached to the DOM). "attach" is not a router-outlet event. "detach" and "deactivate" are for removal.',
  },
  {
    id: 13,
    text: 'Named Routes With Lazy-Loading',
    description: 'You need to implement named routes that use lazy loading. Here is a sample URL.\n```\nhttp://localhost:4200/home/aux(outlet1:route1/details)\n```\nSuppose you have two components called RouteOne and RouteTwo. The outlet name is outlet1. Choose the correct code snippet from the following options.',
    instruction: 'Pick ONE option',
    options: [
      '{\n  path: \'\',\n  children: [\n    {\n      path: \'aux\',\n      children: [\n        {\n          path: \'route1\',\n          component: RouteOneComponent,\n          outlet: \'outlet1\' //outlet declared here\n        },\n        {\n          path: \'route1/details\',\n          component: RouteTwoComponent,\n          outlet: \'outlet1\' //declare again\n        }\n      ]\n    }\n  ]\n}',
      '{\n  path: \'\',\n  children: [\n    {\n      path: \'\',\n      children: [\n        {\n          path: \'route1\',\n          component: RouteOneComponent,\n          outlet: \'outlet1\' //outlet declared here\n        },\n        {\n          path: \'route1/details\',\n          component: RouteTwoComponent,\n          outlet: \'outlet1\' //declare again\n        }\n      ]\n    }\n  ]\n}',
      '{\n  path: \'\',\n  :\n  {\n    path: \'aux\',\n    children: [\n      {\n        path: \'route1\',\n        component: RouteOneComponent,\n        outlet: \'outlet1\' //outlet declared here\n      },\n      {\n        path: \'route1/details\',\n        component: RouteTwoComponent,\n        outlet: \'outlet1\' //declare again\n      }\n    ]\n  }\n}',
      '{\n  path: \'aux\',\n  :\n  {\n    path: \'\',\n    children: [\n      {\n        path: \'route1\',\n        component: RouteOneComponent,\n        outlet: \'outlet1\' //outlet declared here\n      },\n      {\n        path: \'route1/details\',\n        component: RouteTwoComponent,\n        outlet: \'outlet1\' //declare again\n      }\n    ]\n  }\n}',
    ],
    type: 'single',
    correctAnswers: [0],
    explanation: 'The URL pattern home/aux(outlet1:route1/details) indicates: a parent route with path "aux" containing children with an outlet named "outlet1". The first option correctly nests the routes under path: \'\' > children > path: \'aux\' > children with the outlet declarations.',
  },
]

function App() {
  const [activeQuestion, setActiveQuestion] = useState(1)
  const [showTimeUp, setShowTimeUp] = useState(false)
  const [showResults, setShowResults] = useState(() => {
    return localStorage.getItem('hackerrank-finished') === 'true'
  })
  const [saved, setSaved] = useState(false)
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(() => {
    const data = localStorage.getItem('hackerrank-saved-questions')
    return data ? new Set(JSON.parse(data)) : new Set()
  })
  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>(() => {
    const data = localStorage.getItem('hackerrank-user-answers')
    return data ? JSON.parse(data) : {}
  })
  const [codeResults, setCodeResults] = useState<Record<number, boolean>>(() => {
    const data = localStorage.getItem('hackerrank-code-results')
    return data ? JSON.parse(data) : {}
  })

  const markQuestionSaved = useCallback((questionId: number, answers?: number[], testsPassed?: boolean) => {
    setSavedQuestions(prev => {
      const next = new Set(prev)
      next.add(questionId)
      localStorage.setItem('hackerrank-saved-questions', JSON.stringify([...next]))

      // Navigate to next unanswered question
      const allQuestions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      let nextQ = allQuestions.find(q => q > questionId && !next.has(q))
      if (!nextQ) {
        nextQ = allQuestions.find(q => !next.has(q))
      }
      if (nextQ) {
        setActiveQuestion(nextQ)
      }

      return next
    })
    if (answers) {
      setUserAnswers(prev => {
        const next = { ...prev, [questionId]: answers }
        localStorage.setItem('hackerrank-user-answers', JSON.stringify(next))
        return next
      })
    }
    if (testsPassed !== undefined) {
      setCodeResults(prev => {
        const next = { ...prev, [questionId]: testsPassed }
        localStorage.setItem('hackerrank-code-results', JSON.stringify(next))
        return next
      })
    }
  }, [])

  const handleSave = useCallback(() => {
    // If on a coding question, mark it as saved
    if (activeQuestion === 1 || activeQuestion === 10) {
      const key = activeQuestion === 1 ? 'hackerrank-code1-passed' : 'hackerrank-code10-passed'
      const passed = localStorage.getItem(key) === 'true'
      markQuestionSaved(activeQuestion, undefined, passed)
    }
    saveAssessment({
      answers: userAnswers,
      code1Ts: '',
      code1Html: '',
      code10: '',
      submittedAt: new Date().toISOString(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [activeQuestion, markQuestionSaved, userAnswers])

  const handleTimeUp = useCallback(() => {
    handleSave()
    localStorage.setItem('hackerrank-finished', 'true')
    setShowTimeUp(true)
  }, [handleSave])

  const allSaved = savedQuestions.size >= 13

  const renderContent = () => {
    if (activeQuestion === 1) {
      return <Section1FlightValidation key={1} onSave={(testsPassed) => markQuestionSaved(1, undefined, testsPassed)} />
    }
    if (activeQuestion >= 2 && activeQuestion <= 4) {
      const q = s2Questions.find(q => q.id === activeQuestion)
      return q ? <QuestionSection key={q.id} question={q} onSave={(ans) => markQuestionSaved(q.id, ans)} allSaved={allSaved} /> : null
    }
    if (activeQuestion >= 5 && activeQuestion <= 9) {
      const q = s3Questions.find(q => q.id === activeQuestion)
      return q ? <QuestionSection key={q.id} question={q} onSave={(ans) => markQuestionSaved(q.id, ans)} allSaved={allSaved} /> : null
    }
    if (activeQuestion === 10) {
      return <Section4Challenge key={10} onSave={(testsPassed) => markQuestionSaved(10, undefined, testsPassed)} />
    }
    if (activeQuestion >= 11 && activeQuestion <= 13) {
      const q = s5Questions.find(q => q.id === activeQuestion)
      return q ? <QuestionSection key={q.id} question={q} onSave={(ans) => markQuestionSaved(q.id, ans)} allSaved={allSaved} /> : null
    }
    return null
  }

  return (
    <>
      {!showResults && <Header onTimeUp={handleTimeUp} onSave={handleSave} onFinish={() => {
        handleSave()
        localStorage.setItem('hackerrank-finished', 'true')
        setShowResults(true)
      }} allSaved={allSaved} />}
      {saved && <div className="save-toast">✓ Progress saved successfully</div>}
      {showTimeUp && <TimeUpModal onClose={() => { setShowTimeUp(false); setShowResults(true); }} />}
      {showResults ? (
        <ResultsScreen
          savedQuestions={savedQuestions}
          userAnswers={userAnswers}
          codeResults={codeResults}
          onRestart={() => {
            localStorage.removeItem('hackerrank-timer')
            localStorage.removeItem('hackerrank-saved-questions')
            localStorage.removeItem('hackerrank-assessment')
            localStorage.removeItem('hackerrank-finished')
            localStorage.removeItem('hackerrank-user-answers')
            localStorage.removeItem('hackerrank-code-results')
            window.location.reload()
          }}
        />
      ) : (
        <div className="layout">
          <Sidebar activeQuestion={activeQuestion} onQuestionChange={setActiveQuestion} savedQuestions={savedQuestions} />
          <main className="main-content">
            <div className="section-content">
              {renderContent()}
            </div>
          </main>
        </div>
      )}
    </>
  )
}

export default App
