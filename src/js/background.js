let blocklist = {};

blocklist.background = {};

var urls = [
  "bild.de",
  "bloomberg.com",
  "boston.com",
  "bostonglobe.com",
  "businessinsider.com",
  "chicagotribune.com",
  "dagbladet.no",
  "dallasnews.com",
  "dev.to",
  "economist.com",
  "ft.com",
  "handelsblatt.com",
  "hnytimes.com",
  "houstonchronicle.com",
  "latimes.com",
  "makerpad.co",
  "medium.com",
  "newsweek.com",
  "nymag.com",
  "politico.com",
  "seekingalpha.com",
  "techradar.com",
  "theathletic.com",
  "theatlantic.com",
  "thedailybeast.com",
  "theguardian.com",
  "theinformation.com",
  "thetimes.co.uk",
  "time.com",
  "towardsdatascience.com",
  "usatoday.com",
  "uxdesign.cc",
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
      if (request.type == blocklist.background.GET_BLOCKLIST) {
        //put blocked urls here ⬇️
        let blocklistPatterns = urls;
        if (!localStorage.blocklist) {
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

