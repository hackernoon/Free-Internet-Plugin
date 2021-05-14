let blocklist = {};

blocklist.background = {};

var urls = [
  "adelaidenow.com.au",
  "adweek.com",
  "arabianbusiness.com",
  "afr.com",
  "bild.de",
  "bloomberg.com",
  "boston.com",
  "bostonglobe.com",
  "bostonherald.com",
  "businessinsider.com",
  "chicagotribune.com",
  "couriermail.com.au",
  "csmonitor.com",
  "dagbladet.no",
  "dallasnews.com",
  "dpgmedia.nl",
  "economist.com",
  "fijitimes.com.fj",
  "ft.com",
  "guardian.co.tt",
  "handelsblatt.com",
  "heraldsun.com.au",
  "independent.ie",
  "irishtimes.com",
  "jacksonville.com",
  "houstonchronicle.com",
  "latimes.com",
  "makerpad.co",
  "medium.com",
  "nationalpost.com",
  "nbr.co.nz",
  "newsweek.com",
  "nnsl.com",
  "ntnews.com.au",
  "nymag.com",
  "nytimes.com",
  "ocregister.com",
  "politico.com",
  "scientificamerican.com",
  "seattletimes.com",
  "seekingalpha.com",
  "techinasia.com",
  "technologyreview.com",
  "techradar.com",
  "telegraph.co.uk",
  "theathletic.com",
  "theatlantic.com",
  "theaustralian.com.au",
  "thedailybeast.com",
  "thediplomat.com",
  "theglobeandmail.com",
  "theguardian.com",
  "theinformation.com",
  "thestar.com",
  "thetimes.co.uk",
  "time.com",
  "towardsdatascience.com",
  "usatoday.com",
  "uxdesign.cc",
  "vanityfair.com",
  "vogue.com",
  "washingtonpost.com",
  "wired.com",
  "wsj.com",
  "wwd.com"
]


blocklist.background.GET_BLOCKLIST = 'getBlocklist';
blocklist.background.ADD_TO_BLOCKLIST = 'addToBlocklist';
blocklist.background.ADD_LIST_TO_BLOCKLIST = 'addListToBlocklist';
blocklist.background.DELETE_FROM_BLOCKLIST = 'deleteFromBlocklist';

blocklist.background.HOST_REGEX = new RegExp(
  '^https?://(www[.])?([0-9a-zA-Z.-]+).*$');

blocklist.background.startBackgroundListeners = function () {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

      if (request == "updateCounter") {
        localStorage.totalBlocked = parseInt(localStorage.totalBlocked) + 1
        socket.send(localStorage.totalBlocked)
      }

      else if (request.type == blocklist.background.GET_BLOCKLIST) {
        //put blocked urls here ⬇️
        let blocklistPatterns = urls;
        if (!localStorage.blocklist) {
          localStorage.totalBlocked = 0;
          localStorage['blocklist'] = JSON.stringify(blocklistPatterns);
        } else {
          blocklistPatterns = JSON.parse(localStorage['blocklist']);
        }
        sendResponse({
          blocklist: blocklistPatterns
        });
      } else if (request.type == blocklist.background.ADD_TO_BLOCKLIST) {
        let blocklists = JSON.parse(localStorage['blocklist']);
        if (blocklists.indexOf(request.pattern) == -1) {
          blocklists.push(request.pattern);
          blocklists.sort();
          localStorage['blocklist'] = JSON.stringify(blocklists);
        }
        sendResponse({
          success: 1,
          pattern: request.pattern
        });

      } else if (request.type == blocklist.background.ADD_LIST_TO_BLOCKLIST) {
        let regex = /(https?:\/\/)?(www[.])?([0-9a-zA-Z.-]+).*(\r\n|\n)?/g;
        let arr = [];
        while ((m = regex.exec(request.pattern)) !== null) {
          arr.push(m[3]);
        }

        let blocklists = JSON.parse(localStorage['blocklist']);
        for (let i = 0, length = arr.length; i < length; i++) {
          if (blocklists.indexOf(arr[i]) == -1) {
            blocklists.push(arr[i]);
          }
        }

        blocklists.sort();
        localStorage['blocklist'] = JSON.stringify(blocklists);

        sendResponse({
          success: 1,
          pattern: request.pattern
        });


      } else if (request.type == blocklist.background.DELETE_FROM_BLOCKLIST) {
        let blocklists = JSON.parse(localStorage['blocklist']);
        let index = blocklists.indexOf(request.pattern);
        if (index != -1) {
          blocklists.splice(index, 1);
          localStorage['blocklist'] = JSON.stringify(blocklists);
          sendResponse({
            pattern: request.pattern
          });
        }
      }
    }
  )
};

blocklist.background.getHostNameFromUrl = function (pattern) {
  return pattern.replace(blocklist.background.HOST_REGEX, '$2');
}


blocklist.background.startBackgroundListeners();

var socket = new WebSocket('ws://localhost:8000')

socket.addEventListener('open', function (event) {
  socket.send(localStorage.totalBlocked);
});

