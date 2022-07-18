import React, {useState} from 'react';
import './App.css';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.5.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function App() {

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  const signatureEndpoint = 'http://localhost:4000'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  const sdkKey = 'vXg4kmQnzvSvjHMwCmOcdXSjqmxP6BowVafd'
  const leaveUrl = 'http://localhost:3000'
  const role = 0

  var [meetingNumber, setMeetingNumber] = useState('');
  var [userName, setUserName] = useState('Guest')
  var [userEmail, setUserEmail] = useState('')
  var [passWord, setPassWord] = useState('')
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  var registrantToken = ''

  const handleSubmit = event => {
    console.log('handleSubmit ran');
    event.preventDefault(); // 👈️ prevent page refresh

    // 👇️ display input values here
    console.log('meetingNumber 👉️', meetingNumber);
    console.log('userName 👉️', userName);
    console.log('passWord 👉️', passWord);
    console.log('userEmail 👉️', userEmail);


    // 👇️ clear all input values in the form
    setMeetingNumber('');
  }

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
      }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          sdkKey: sdkKey,
          userEmail: userEmail,
          passWord: passWord,
          tk: registrantToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

   

  return (
    <div className='App'>
      <main>
             <div className="navbar-header">
                <a className="navbar-brand" href="/choose-platform">BeTalent Zoom Meeting</a>
            </div>
            <div className="form-bg">
            <img src={process.env.PUBLIC_URL + '/logo_betalent.svg'}  alt='betalent' width="300" height="100" style={{marginRight: 400}}/>

            <div id="navbar" className="websdktest">
                <form className="navbar-form navbar" id="meeting_form" onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginTop: 200, marginLeft:200}}>
                        <input type="text" name="display_name" id="display_name" maxLength="100"
                            placeholder="Name" className="form-control" 
                            onChange={event => setUserName(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <input type="text" name="meeting_number" id="meeting_number" maxLength="200"
                            style={{width:150, marginTop: 200}} placeholder="Meeting Number" className="form-control" 
                            onChange={event => setMeetingNumber(event.target.value)} required
                            /> </div>
                    <div className="form-group">
                        <input type="text" name="meeting_pwd" id="meeting_pwd" style={{width:150, marginTop: 200}}
                            maxLength="32" placeholder="Meeting Password" className="form-control" 
                            onChange={event => setPassWord(event.target.value)} required/> </div>
                    <div className="form-group">
                        <input type="text" name="meeting_email" id="meeting_email" style={{width:150, marginTop: 200}}
                            maxLength="32" placeholder="Email option" className="form-control"
                            onChange={event => setUserEmail(event.target.value)} />
                    </div>
                    <div className="form-group" style={{marginTop: 200}}>
                        <select id="meeting_china" className="sdk-select">
                            <option value={0}>Global</option>
                            <option value={1}>China</option>
                        </select>
                    </div>
                    <div className="form-group" style={{marginTop: 200, marginRight:0}}>
                        <select id="meeting_lang" className="sdk-select">
                            <option value="en-US">English</option>
                            <option value="de-DE">German Deutsch</option>
                            <option value="es-ES">Spanish Español</option>
                            <option value="fr-FR">French Français</option>
                            <option value="jp-JP">Japanese 日本語</option>
                            <option value="pt-PT">Portuguese Portuguese</option>
                            <option value="ru-RU">Russian Русский</option>
                            <option value="zh-CN">Chinese 简体中文</option>
                            <option value="zh-TW">Chinese 繁体中文</option>
                            <option value="ko-KO">Korean 한국어</option>
                            <option value="vi-VN">Vietnamese Tiếng Việt</option>
                            <option value="it-IT">Italian italiano</option>
                        </select> 
                     </div>
                    <div className='button-div' style={{marginRight:820}}>
                        <button type='submit' onClick={getSignature} className="button-inizia-ora-big">Join Meeting</button>
                        <button type="submit" className="button-inizia-ora-big" id="clear_all">Clear</button>
                    </div>
                 </form>
            </div>
          </div>    
      </main>
    </div>
  );
}

export default App;
