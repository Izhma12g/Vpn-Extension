const button = document.getElementById('connect');
const vpnStatus = document.getElementById('time');
let intervalId;
let iteration = 0;


document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('connect');
  const vpnStatus = document.getElementById('time');

  function updateUI(connected, startTime, updated) {
    if (connected) {
    
      button.style.backgroundColor = 'red';
      if (!updated) { 
        button.innerHTML = '<img src="media/throbber.gif" alt="Loading...">';
        vpnStatus.textContent = 'Connected for 0s'; 
      } else {
        button.textContent = 'Disconnect';
      }
      intervalId = setInterval(() => {
        button.textContent = 'Disconnect';1
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);

        if (elapsedTime < 60) {
          vpnStatus.textContent = `Connected for ${elapsedTime}s`;
        } else {
          const elapsedMinutes = Math.floor(elapsedTime / 60);
          const remainingSeconds = elapsedTime % 60;
          vpnStatus.textContent = `Connected for ${elapsedMinutes}m ${remainingSeconds}s`;
        }
      }, 1000);
    } else if (!connected) {
      chrome.runtime.sendMessage({action: "clearProxy"});
      button.textContent = 'Connect';
      button.style.backgroundColor = '';
      vpnStatus.textContent = 'Connect to get started';
      clearInterval(intervalId);
    }
    button.style.display = 'block';
    vpnStatus.style.visibility = 'visible';
  }

  // Handle button click
  button.addEventListener('click', () => {
    if (button.textContent === 'Connect') {
      chrome.runtime.sendMessage({action: "setProxy"});
      chrome.runtime.sendMessage({ action: 'connect' }, (response) => {
        if (response && response.success) {
          updateUI(true, response.startTime);
        }
      });
    } else {
      chrome.runtime.sendMessage({action: "clearProxy"});
      chrome.runtime.sendMessage({ action: 'disconnect' }, (response) => {
        if (response && response.success) {
          updateUI(false);
        } else {
          console.error('Failed to disconnect VPN');
        }
      });
    }
  });

  // Check status on popup load
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      updateUI(response.vpnConnected, response.startTime, 1);
    }
  });
});

document.getElementById('gate').addEventListener('contextmenu', (event) => {
  event.preventDefault(); 
  iteration++;
  if (iteration === 3) {
    document.getElementById('settingsLink').click();
    iteration = 0;
  }
});