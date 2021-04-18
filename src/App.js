import { useState, useEffect } from 'react'
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const keyWords = {
  complaints: [
    'headache',
    'head hurts',
    'head pain'
  ],
  timeResponses: [
    'today',
    'yesterday',
    'this week',
    'this year',
    'last week',
    'last year',
    'a day ago',
    'a few hours',
    'a couple days ago',
    '1 day ago',
    '2 day ago',
    '3 day ago',
    '4 days ago',
    'a week ago',
    '1 week ago',
    '2 weeks ago',
    '3 weeks ago',
    '4 weeks ago',
    'a couple weeks ago'
  ],
  bodyParts: [
    'neck', 'head', 'shoulder', 'knees', 'feet',
    'ankle', 'armpit', 'abdomen', 'anus',
    'artery', 'abs', 'alleles',
    'belly', 'bone', 'body', 'brain',
    'buttock', 'beard', 'bile', 'breasts',
    'chest', 'cheek', 'chin', 'claw', 
    'chignon', 'calf', 'cranium', 'cortex', 
    'dimple', 'dandruff',
    'eye', 'elbow', 'eyebrow',
  ],
  bodyParts2: [
    'neck', 'head', 'shoulder', 'knees', 'feet',
    'ankle', 'armpit', 'abdomen', 'anus',
    'artery', 'abs', 'alleles',
    'belly', 'bone', 'body', 'brain',
    'buttock', 'beard', 'bile', 'breasts',
    'chest', 'cheek', 'chin', 'claw', 
    'chignon', 'calf', 'cranium', 'cortex', 
    'dimple', 'dandruff',
    'eye', 'elbow', 'eyebrow',
  ],
  nature: [
    'painful',
    'annoying',
    'aggravating',
    'excruciating',
    'pulsing' 
  ],
  aggravatingFactors: [
    'touch',
    'putting weight',
    'pressure'
  ],
  relievingFactors: [
    'rest',
    'laying down',
    'elevation',
    'ice',
    'heat'
  ]

}

const questions = [
  { 
    text: 'what brings you in today', 
    new: false, 
    possibleAnswers: keyWords.complaints, 
    updates: 'chiefComplaint' 
  },
  { 
    text: 'major concerns', 
    new: true, 
    possibleAnswers: keyWords.complaints, 
    updates: 'chiefComplaint' 
  },
  { text: 'goals for the appointment', new: true, possibleAnswers: keyWords.complaints, updates: 'chiefComplaint' },
  { text: 'when did it start', new: true, possibleAnswers: keyWords.timeResponses, updates: 'onset' },
  { text: 'where is it located', new: true, possibleAnswers: keyWords.bodyParts, updates: 'location' },
  { text: 'where does it radiate to', new: true, possibleAnswers: keyWords.bodyParts2, updates: 'radiation' },
  { text: 'where does it radiates to', new: true, possibleAnswers: keyWords.bodyParts2, updates: 'radiation' },
  { text: 'how long does it last', new: true, possibleAnswers: keyWords.timeResponses, updates: 'duration'},
  { text: 'does it wax/wane', new: true, possibleAnswers: ['yes', 'no'] },
  { text: 'how would you describe the nature of it', new: true, possibleAnswers: keyWords.nature, updates: 'character' },
  { text: 'does anything hurt it', new: true, possibleAnswers: keyWords.aggravatingFactors, updates: 'aggravatingFactors' },
  { text: 'any aggravating factors', new: true, possibleAnswers: keyWords.aggravatingFactors, updates: 'aggravatingFactors' },
  { text: 'does anything help it', new: true, possibleAnswers: keyWords.relievingFactors, updates: 'relievingFactors' },
  { text: 'any relieving/alleviating factors', new: true, possibleAnswers: keyWords.relievingFactors, updates: 'relievingFactors'},
  { text: 'when does it tend to occur', new: true, possibleAnswers: ['in the morning', 'at night'], updates: 'temporalFactors'},
  { text: 'how bad is it on a pain scale of 1 to 10', new: true, possibleAnswers: ['1','2','3','4','5','6','7','8','9','10'], updates: 'severity' },
]

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('what brings you in today')
  const [patient, setPatient] = useState({
    age: 19,
    name: 'Jawwaad',
    sex: 'male',
    complaint: {
      chiefComplaint: '',
      onset: '',
      duration: '',
      location: '',
      radiation: '',
      character: '',
      aggravatingFactors: '',
      relievingFactors: '',
      temporalFactors: '',
      severity: null,
    }
  })

  useEffect(() => {
    handleListen()
  }, [isListening])

  useEffect(() => {
    transcriptToNote()
  }, [note])

  const transcriptToNote = () => {
    console.log(typeof note)
    if(note === null) return
    
    questions.forEach((question, i) => {
      if(note.search(question.text) !== -1 && question.new) {
        setCurrentQuestion(question.text)
        questions[i].new = false
      }
    })
  
    let complaint
    let updatedPatient = patient

    const currQuestion = questions.find(question => question.text === currentQuestion)
    currQuestion.possibleAnswers.forEach(answer => {
      if(note.toLowerCase().search(answer.toLowerCase()) !== -1) updatedPatient['complaint'][currQuestion.updates] = answer
    })
    console.log(updatedPatient)
    setPatient(updatedPatient)

  }

  const handleListen = () => {
    if(isListening) {
      console.log('object')
      mic.start()
      mic.onend = () => {
        console.log('continue...')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mic is on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      
      setNote(transcript)
      
      mic.onerror = e => {
        console.log(e.error)
      }
    }
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Transcript</h2>
        {isListening ? <span>listening</span> : <span>not listening</span>}
        <button onClick={() => setIsListening(prev => !prev)}>Start/Stop</button>
        <p>{note}</p>
      </div>
      <div className="box">
        <h2>E-Clinic Notes</h2>
        {note && <p>
        The patient is a {patient.age || '____'} year old {patient.sex || '____'} who presents with a chief complaint of {patient.complaint.chiefComplaint || '____'}.
        </p>}
        {
          note && <p>
            Patient notes his {patient.complaint.chiefComplaint || '____'} started {patient.complaint.onset || '____'}. 
            Patient reports his {patient.complaint.chiefComplaint || '____'} is located at the {patient.complaint.location || '____'}, radiates to the {patient.complaint.radiation || '____'} at times.
            When asked to describe his {patient.complaint.chiefComplaint || '____'}, he notes it is {patient.complaint.character || '____'} in nature. 
            The patient {patient.complaint.relievingFactors || '____'} to alleviate his {patient.complaint.chiefComplaint || '____'} and {patient.complaint.aggravatingFactors || '____'} aggravate his {patient.complaint.chiefComplaint || '____'}. 
            The patient notes that the {patient.complaint.chiefComplaint || '____'} tends to occur {patient.complaint.temporalFactors || '____'}. 
            On a pain scale of 1-10, the patient notes his pain is a {patient.complaint.severity || '____'}.
          </p>
        }
      </div>
      <h2>Current Question: {currentQuestion}?</h2>
    </div>
  );
}

export default App;
