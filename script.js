const firebaseConfig = {
  apiKey: "AIzaSyCphFtk6KHrc7CknMP8WFYBzgC96yVIoVk",
  authDomain: "openai-e66ce.firebaseapp.com",
  projectId: "openai-e66ce",
  storageBucket: "openai-e66ce.firebasestorage.app",
  messagingSenderId: "1040371097263",
  appId: "1:1040371097263:web:a38b15c504b8fcfbafbe5a"
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

const loginPage =
document.getElementById('loginPage')

const loadingPage =
document.getElementById('loadingPage')

const mainApp =
document.getElementById('mainApp')

const loadingText =
document.getElementById('loadingText')

const loginBtn =
document.getElementById('loginBtn')

const hamburgerBtn =
document.getElementById('hamburgerBtn')

const hamburgerMenu =
document.getElementById('hamburgerMenu')

const profileBtn =
document.getElementById('profileBtn')

const profilePopup =
document.getElementById('profilePopup')

const closeProfile =
document.getElementById('closeProfile')

const monitorBtn =
document.getElementById('monitorBtn')

const monitorPopup =
document.getElementById('monitorPopup')

const closeMonitor =
document.getElementById('closeMonitor')

const uploadProfile =
document.getElementById('uploadProfile')

const profileImage =
document.getElementById('profileImage')

const saveProfile =
document.getElementById('saveProfile')

const sendBtn =
document.getElementById('sendBtn')

const promptInput =
document.getElementById('prompt')

const chatContainer =
document.getElementById('chatContainer')

const typing =
document.getElementById('typing')

const voiceBtn =
document.getElementById('voiceBtn')

const chatMenu =
document.getElementById('chatMenu')

const googleBtn =
document.getElementById('googleBtn')

const githubBtn =
document.getElementById('githubBtn')

const emailInput =
document.getElementById('email')

const passwordInput =
document.getElementById('password')

loginBtn.addEventListener(
  'click',
  async()=>{

    const email =
    emailInput.value

    const password =
    passwordInput.value

    if(!email || !password){

      alert(
        'Isi Gmail dan Password'
      )

      return

    }

    try{

      await firebase.auth()
      .signInWithEmailAndPassword(
        email,
        password
      )

      startLoading()

    }catch(err){

      try{

        await firebase.auth()
        .createUserWithEmailAndPassword(
          email,
          password
        )

        startLoading()

      }catch(error){

        alert(error.message)

      }

    }

  }
)

googleBtn.addEventListener(
  'click',
  async()=>{

    const provider =
    new firebase.auth.GoogleAuthProvider()

    try{

      await firebase.auth()
      .signInWithPopup(provider)

      startLoading()

    }catch(err){

      alert(err.message)

    }

  }
)

githubBtn.addEventListener(
  'click',
  ()=>{

    alert(
      'Github Login Coming Soon'
    )

  }
)

function startLoading(){

  loginPage.style.display =
  'none'

  loadingPage.style.display =
  'flex'

  let percent = 0

  const interval =
  setInterval(()=>{

    percent++

    loadingText.innerText =
    percent + '%'

    if(percent >= 100){

      clearInterval(interval)

      loadingPage.style.display =
      'none'

      mainApp.style.display =
      'flex'

    }

  },30)

}

hamburgerBtn.addEventListener(
  'click',
  ()=>{

    if(
      hamburgerMenu.style.display
      === 'block'
    ){

      hamburgerMenu.style.display =
      'none'

    }else{

      hamburgerMenu.style.display =
      'block'

    }

  }
)

profileBtn.addEventListener(
  'click',
  ()=>{

    monitorPopup.style.display =
    'none'

    profilePopup.style.display =
    'block'

    hamburgerMenu.style.display =
    'none'

  }
)

closeProfile.addEventListener(
  'click',
  ()=>{

    profilePopup.style.display =
    'none'

  }
)

monitorBtn.addEventListener(
  'click',
  ()=>{

    profilePopup.style.display =
    'none'

    monitorPopup.style.display =
    'block'

    hamburgerMenu.style.display =
    'none'

  }
)

closeMonitor.addEventListener(
  'click',
  ()=>{

    monitorPopup.style.display =
    'none'

  }
)

chatMenu.addEventListener(
  'click',
  ()=>{

    profilePopup.style.display =
    'none'

    monitorPopup.style.display =
    'none'

    hamburgerMenu.style.display =
    'none'

  }
)

uploadProfile.addEventListener(
  'change',
  (e)=>{

    const file =
    e.target.files[0]

    if(file){

      const reader =
      new FileReader()

      reader.onload =
      function(event){

        profileImage.src =
        event.target.result

      }

      reader.readAsDataURL(file)

    }

  }
)

saveProfile.addEventListener(
  'click',
  ()=>{

    const username =
    document
    .getElementById('username')
    .value

    const bio =
    document
    .getElementById('bio')
    .value

    const birthDate =
    document
    .getElementById('birthDate')
    .value

    localStorage.setItem(
      'username',
      username
    )

    localStorage.setItem(
      'bio',
      bio
    )

    localStorage.setItem(
      'birthDate',
      birthDate
    )

    localStorage.setItem(
      'profileImage',
      profileImage.src
    )

    alert(
      'Profile berhasil disimpan'
    )

    profilePopup.style.display =
    'none'

  }
)

window.addEventListener(
  'load',
  ()=>{

    const savedUsername =
    localStorage.getItem(
      'username'
    )

    const savedImage =
    localStorage.getItem(
      'profileImage'
    )

    if(savedImage){

      profileImage.src =
      savedImage

    }

    if(savedUsername){

      document
      .getElementById(
        'username'
      ).value =
      savedUsername

    }

  }
)

async function sendMessage(){

  const prompt =
  promptInput.value

  if(!prompt) return

  const userDiv =
  document.createElement('div')

  userDiv.className =
  'userMessage'

  userDiv.innerText =
  prompt

  chatContainer.appendChild(
    userDiv
  )

  db.collection('analytics')
  .doc('global')
  .set({

    totalChats:
    firebase.firestore
    .FieldValue.increment(1)

  },{
    merge:true
  })

  promptInput.value = ''

  typing.style.display =
  'block'

  chatContainer.scrollTop =
  chatContainer.scrollHeight

  try{

    const response =
    await fetch('/api/chat',{

      method:'POST',

      headers:{
        'Content-Type':
        'application/json'
      },

      body:JSON.stringify({
        message:prompt
      })

    })

    const data =
    await response.json()

    typing.style.display =
    'none'

    const aiDiv =
    document.createElement('div')

    aiDiv.className =
    'aiMessage'

    aiDiv.innerText =
    data.reply

    chatContainer.appendChild(
      aiDiv
    )

    chatContainer.scrollTop =
    chatContainer.scrollHeight

  }catch(err){

    typing.style.display =
    'none'

    const aiDiv =
    document.createElement('div')

    aiDiv.className =
    'aiMessage'

    aiDiv.innerText =
    'Server Error'

    chatContainer.appendChild(
      aiDiv
    )

  }

}

sendBtn.addEventListener(
  'click',
  sendMessage
)

voiceBtn.addEventListener(
  'click',
  ()=>{

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition

    if(!SpeechRecognition){

      alert(
        'Voice tidak support'
      )

      return

    }

    const recognition =
    new SpeechRecognition()

    recognition.lang =
    'id-ID'

    recognition.start()

    recognition.onresult =
    (e)=>{

      promptInput.value =
      e.results[0][0].transcript

    }

  }
)

const randomUserId =
Math.random()
.toString(36)
.substring(2)

db.collection('onlineUsers')
.doc(randomUserId)
.set({

  online:true,

  createdAt:
  Date.now()

})

db.collection('analytics')
.doc('global')
.onSnapshot((doc)=>{

  const data =
  doc.data()

  if(data){

    document
    .getElementById(
      'chatCount'
    ).innerText =
    data.totalChats || 0

  }

})

db.collection('onlineUsers')
.onSnapshot((snapshot)=>{

  document
  .getElementById(
    'onlineCount'
  ).innerText =
  snapshot.size

})

const ctx =
document
.getElementById(
  'chartCanvas'
)

const chart =
new Chart(ctx,{

  type:'line',

  data:{

    labels:[
      '1',
      '2',
      '3',
      '4',
      '5'
    ],

    datasets:[{

      label:
      'Realtime Activity',

      data:[
        0,
        0,
        0,
        0,
        0
      ],

      borderColor:
      '#ff003c',

      tension:.4

    }]

  },

  options:{

    responsive:true,

    maintainAspectRatio:false

  }

})

setInterval(()=>{

  const current =
  chart.data
  .datasets[0]
  .data

  current.shift()

  current.push(

    Math.floor(
      Math.random()*50
    )

  )

  chart.update()

},2000)